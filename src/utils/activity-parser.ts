import * as fs from 'fs';
import { promisify } from 'util';

import type {
    ActivityMetrics,
    SubagentTask,
    TodoItem,
    ToolInvocation,
    UsageLimits
} from '../types/ActivityMetrics';

const readFile = promisify(fs.readFile);

interface TranscriptMessage {
    timestamp?: string;
    isSidechain?: boolean;
    type?: string;
    message?: {
        role?: string;
        content?: {
            type?: string;
            name?: string;
            id?: string;
            tool_use_id?: string;
            input?: Record<string, unknown>;
        }[];
    };
    toolName?: string;
    toolId?: string;
    subagentId?: string;
    subagentDescription?: string;
    subagentStatus?: string;
}

/**
 * Parse transcript JSONL to extract activity metrics including sidechain messages
 */
export async function getActivityMetrics(transcriptPath: string): Promise<ActivityMetrics> {
    const defaultMetrics: ActivityMetrics = {
        runningTools: [],
        recentTools: [],
        activeAgents: [],
        completedAgents: [],
        todos: []
    };

    try {
        if (!fs.existsSync(transcriptPath)) {
            return defaultMetrics;
        }

        const content = await readFile(transcriptPath, 'utf-8');
        const lines = content.trim().split('\n').filter(line => line.trim());

        const toolInvocations = new Map<string, ToolInvocation>();
        const agentTasks = new Map<string, SubagentTask>();
        const todos: TodoItem[] = [];

        for (const line of lines) {
            try {
                const data = JSON.parse(line) as TranscriptMessage;

                // Parse tool invocations (including sidechain)
                parseToolInvocations(data, toolInvocations);

                // Parse subagent/task activity
                parseAgentActivity(data, agentTasks);

                // Parse todo updates from message content
                parseTodoUpdates(data, todos);
            } catch {
                // Skip invalid JSON lines - expected during partial writes or corrupted entries
            }
        }

        // Separate running vs completed tools
        const runningTools: ToolInvocation[] = [];
        const recentTools: ToolInvocation[] = [];

        for (const tool of toolInvocations.values()) {
            if (tool.isRunning) {
                runningTools.push(tool);
            } else {
                recentTools.push(tool);
            }
        }

        // Sort by timestamp and limit recent tools
        recentTools.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        const limitedRecentTools = recentTools.slice(0, 5);

        // Separate active vs completed agents
        const activeAgents: SubagentTask[] = [];
        const completedAgents: SubagentTask[] = [];

        for (const agent of agentTasks.values()) {
            if (agent.status === 'running' || agent.status === 'pending') {
                activeAgents.push(agent);
            } else {
                completedAgents.push(agent);
            }
        }

        // Sort completed agents by timestamp and limit
        completedAgents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        const limitedCompletedAgents = completedAgents.slice(0, 5);

        return {
            runningTools,
            recentTools: limitedRecentTools,
            activeAgents,
            completedAgents: limitedCompletedAgents,
            todos
            // Note: usageLimits is reserved for future use when API provides this data
        };
    } catch {
        // Return default metrics on any file read/parse error - graceful degradation
        return defaultMetrics;
    }
}

/**
 * Parse tool invocations from transcript message
 */
function parseToolInvocations(
    data: TranscriptMessage,
    toolMap: Map<string, ToolInvocation>
): void {
    const timestamp = data.timestamp ? new Date(data.timestamp) : new Date();

    // Check for tool_use content blocks (tool start)
    if (data.message?.content) {
        for (const block of data.message.content) {
            if (block.type === 'tool_use' && block.name && block.id) {
                toolMap.set(block.id, {
                    name: block.name,
                    timestamp,
                    isRunning: true
                });
            }

            // Check for tool_result blocks (tool completion)
            if (block.type === 'tool_result' && block.tool_use_id) {
                const existingTool = toolMap.get(block.tool_use_id);
                if (existingTool) {
                    existingTool.isRunning = false;
                    existingTool.timestamp = timestamp;
                }
            }
        }
    }
}

/**
 * Parse subagent/task activity from transcript message
 */
function parseAgentActivity(
    data: TranscriptMessage,
    agentMap: Map<string, SubagentTask>
): void {
    const timestamp = data.timestamp ? new Date(data.timestamp) : new Date();

    // Look for Task tool invocations
    if (data.message?.content) {
        for (const block of data.message.content) {
            if (block.type === 'tool_use' && block.name === 'Task' && block.id) {
                const input = block.input as { description?: string; subagent_type?: string } | undefined;
                const description = input?.description ?? input?.subagent_type ?? 'Task';

                agentMap.set(block.id, {
                    id: block.id,
                    description,
                    status: 'running',
                    timestamp
                });
            }

            // Check for task completion
            if (block.type === 'tool_result' && block.tool_use_id) {
                const existingAgent = agentMap.get(block.tool_use_id);
                if (existingAgent) {
                    existingAgent.status = 'completed';
                    existingAgent.timestamp = timestamp;
                }
            }
        }
    }
}

/** Valid todo status values */
const VALID_TODO_STATUSES = ['pending', 'in_progress', 'completed'] as const;

/**
 * Type guard to validate todo status
 */
function isValidTodoStatus(status: string): status is TodoItem['status'] {
    return VALID_TODO_STATUSES.includes(status as TodoItem['status']);
}

/**
 * Parse todo updates from transcript messages
 * Looks for TodoWrite tool invocations
 */
function parseTodoUpdates(
    data: TranscriptMessage,
    todos: TodoItem[]
): void {
    if (data.message?.content) {
        for (const block of data.message.content) {
            if (block.type === 'tool_use' && block.name === 'TodoWrite') {
                const input = block.input as { todos?: { content: string; status: string }[] } | undefined;
                if (input?.todos && Array.isArray(input.todos)) {
                    // Clear and replace todos with latest state
                    todos.length = 0;
                    for (const todo of input.todos) {
                        if (todo.content && todo.status && isValidTodoStatus(todo.status)) {
                            todos.push({
                                content: todo.content,
                                status: todo.status
                            });
                        }
                    }
                }
            }
        }
    }
}

/**
 * Infer API tier from model ID using heuristics.
 *
 * **Important:** This is a heuristic approximation. The actual API tier
 * (free/pro/max/team) depends on the user's subscription, not the model.
 * This function maps model capability tiers to likely subscription tiers:
 * - Opus models → likely "Max" subscription (highest tier)
 * - Sonnet models → likely "Pro" subscription
 * - Haiku models → could be any tier (shown as "Free" for simplicity)
 *
 * For accurate tier information, the API would need to provide subscription data.
 *
 * @param modelId - The model ID string from Claude Code (e.g., "claude-sonnet-4-5-20250929")
 * @returns Inferred tier or 'unknown' if model pattern not recognized
 */
export function detectApiTier(modelId?: string): UsageLimits['tier'] {
    if (!modelId)
        return 'unknown';

    // Map model capability to likely subscription tier (heuristic)
    if (modelId.includes('opus'))
        return 'max';
    if (modelId.includes('sonnet'))
        return 'pro';
    if (modelId.includes('haiku'))
        return 'free';

    return 'unknown';
}