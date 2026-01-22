/**
 * Represents a tool invocation from the transcript
 */
export interface ToolInvocation {
    name: string;
    timestamp: Date;
    isRunning: boolean;
}

/**
 * Represents a subagent/task from the transcript
 */
export interface SubagentTask {
    id: string;
    description: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    timestamp: Date;
}

/**
 * Represents a todo item from the transcript
 */
export interface TodoItem {
    content: string;
    status: 'pending' | 'in_progress' | 'completed';
}

/**
 * Usage limits based on API tier
 */
export interface UsageLimits {
    tier: 'free' | 'pro' | 'max' | 'team' | 'unknown';
    messagesUsed?: number;
    messagesLimit?: number;
    resetTime?: Date;
}

/**
 * Activity metrics extracted from transcript JSONL
 */
export interface ActivityMetrics {
    /** Currently running tools */
    runningTools: ToolInvocation[];
    /** Recently completed tools (last 5) */
    recentTools: ToolInvocation[];
    /** Active subagents/tasks */
    activeAgents: SubagentTask[];
    /** Completed subagents/tasks (last 5) */
    completedAgents: SubagentTask[];
    /** Current todo items */
    todos: TodoItem[];
    /** Usage limits info */
    usageLimits?: UsageLimits;
}