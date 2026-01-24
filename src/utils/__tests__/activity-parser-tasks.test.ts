import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { getActivityMetrics } from '../activity-parser';

describe('getActivityMetrics - Tasks parsing', () => {
    const createTempTranscript = (lines: object[]): string => {
        const tempDir = os.tmpdir();
        const tempFile = path.join(tempDir, `test-transcript-${Date.now()}.jsonl`);
        const content = lines.map(l => JSON.stringify(l)).join('\n');
        fs.writeFileSync(tempFile, content);
        return tempFile;
    };

    const cleanupFile = (filePath: string) => {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    };

    it('should parse TaskCreate tool invocations', async () => {
        const transcript = createTempTranscript([
            {
                timestamp: '2026-01-24T00:00:00Z',
                message: {
                    role: 'assistant',
                    content: [{
                        type: 'tool_use',
                        name: 'TaskCreate',
                        id: 'task-1',
                        input: {
                            subject: 'Fix the bug',
                            description: 'Fix the race condition bug'
                        }
                    }]
                }
            }
        ]);

        try {
            const metrics = await getActivityMetrics(transcript);
            expect(metrics.tasks).toHaveLength(1);
            expect(metrics.tasks[0].id).toBe('task-1');
            expect(metrics.tasks[0].subject).toBe('Fix the bug');
            expect(metrics.tasks[0].status).toBe('pending');
        } finally {
            cleanupFile(transcript);
        }
    });

    it('should parse TaskUpdate to change task status', async () => {
        const transcript = createTempTranscript([
            {
                timestamp: '2026-01-24T00:00:00Z',
                message: {
                    role: 'assistant',
                    content: [{
                        type: 'tool_use',
                        name: 'TaskCreate',
                        id: 'task-1',
                        input: {
                            subject: 'Fix the bug'
                        }
                    }]
                }
            },
            {
                timestamp: '2026-01-24T00:01:00Z',
                message: {
                    role: 'assistant',
                    content: [{
                        type: 'tool_use',
                        name: 'TaskUpdate',
                        id: 'update-1',
                        input: {
                            taskId: 'task-1',
                            status: 'in_progress'
                        }
                    }]
                }
            }
        ]);

        try {
            const metrics = await getActivityMetrics(transcript);
            expect(metrics.tasks).toHaveLength(1);
            expect(metrics.tasks[0].status).toBe('in_progress');
        } finally {
            cleanupFile(transcript);
        }
    });

    it('should parse multiple tasks with different statuses', async () => {
        const transcript = createTempTranscript([
            {
                timestamp: '2026-01-24T00:00:00Z',
                message: {
                    role: 'assistant',
                    content: [
                        {
                            type: 'tool_use',
                            name: 'TaskCreate',
                            id: 'task-1',
                            input: { subject: 'Task 1' }
                        },
                        {
                            type: 'tool_use',
                            name: 'TaskCreate',
                            id: 'task-2',
                            input: { subject: 'Task 2' }
                        },
                        {
                            type: 'tool_use',
                            name: 'TaskCreate',
                            id: 'task-3',
                            input: { subject: 'Task 3' }
                        }
                    ]
                }
            },
            {
                timestamp: '2026-01-24T00:01:00Z',
                message: {
                    role: 'assistant',
                    content: [
                        {
                            type: 'tool_use',
                            name: 'TaskUpdate',
                            id: 'upd-1',
                            input: { taskId: 'task-1', status: 'completed' }
                        },
                        {
                            type: 'tool_use',
                            name: 'TaskUpdate',
                            id: 'upd-2',
                            input: { taskId: 'task-2', status: 'in_progress' }
                        }
                    ]
                }
            }
        ]);

        try {
            const metrics = await getActivityMetrics(transcript);
            expect(metrics.tasks).toHaveLength(3);

            const task1 = metrics.tasks.find(t => t.id === 'task-1');
            const task2 = metrics.tasks.find(t => t.id === 'task-2');
            const task3 = metrics.tasks.find(t => t.id === 'task-3');

            expect(task1?.status).toBe('completed');
            expect(task2?.status).toBe('in_progress');
            expect(task3?.status).toBe('pending');
        } finally {
            cleanupFile(transcript);
        }
    });

    it('should handle TaskUpdate for tasks not created in session', async () => {
        const transcript = createTempTranscript([
            {
                timestamp: '2026-01-24T00:00:00Z',
                message: {
                    role: 'assistant',
                    content: [{
                        type: 'tool_use',
                        name: 'TaskUpdate',
                        id: 'upd-1',
                        input: {
                            taskId: 'external-task',
                            status: 'in_progress',
                            subject: 'External task'
                        }
                    }]
                }
            }
        ]);

        try {
            const metrics = await getActivityMetrics(transcript);
            expect(metrics.tasks).toHaveLength(1);
            expect(metrics.tasks[0].id).toBe('external-task');
            expect(metrics.tasks[0].subject).toBe('External task');
            expect(metrics.tasks[0].status).toBe('in_progress');
        } finally {
            cleanupFile(transcript);
        }
    });
});
