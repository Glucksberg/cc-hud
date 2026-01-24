import { describe, expect, it } from 'vitest';
import { TasksProgressWidget } from '../TasksProgress';
import type { RenderContext } from '../../types/RenderContext';
import type { Settings } from '../../types/Settings';
import type { WidgetItem } from '../../types/Widget';

describe('TasksProgressWidget', () => {
    const widget = new TasksProgressWidget();

    const createContext = (tasks: { status: string }[]): RenderContext => ({
        modelId: 'test',
        transcriptPath: '/test/path.jsonl',
        terminalWidth: 100,
        isPreview: false,
        activityMetrics: {
            runningTools: [],
            recentTools: [],
            activeAgents: [],
            completedAgents: [],
            todos: [],
            tasks: tasks.map((t, i) => ({
                id: `task-${i}`,
                subject: `Task ${i}`,
                status: t.status as 'pending' | 'in_progress' | 'completed'
            }))
        }
    });

    const createItem = (overrides: Partial<WidgetItem> = {}): WidgetItem => ({
        id: 'test',
        type: 'tasks-progress',
        ...overrides
    });

    const settings = {} as Settings;

    it('should show 0/0 when no tasks', () => {
        const context = createContext([]);
        const result = widget.render(createItem(), context, settings);
        expect(result).toBe('Tasks: 0/0');
    });

    it('should show correct count with tasks', () => {
        const context = createContext([
            { status: 'completed' },
            { status: 'completed' },
            { status: 'in_progress' },
            { status: 'pending' },
            { status: 'pending' }
        ]);
        const result = widget.render(createItem(), context, settings);
        expect(result).toBe('Tasks: 2/5 (40%)');
    });

    it('should show raw value without label', () => {
        const context = createContext([
            { status: 'completed' },
            { status: 'pending' }
        ]);
        const result = widget.render(createItem({ rawValue: true }), context, settings);
        expect(result).toBe('1/2 (50%)');
    });

    it('should show count mode', () => {
        const context = createContext([
            { status: 'completed' },
            { status: 'pending' }
        ]);
        const item = createItem({ metadata: { display: 'count' } });
        const result = widget.render(item, context, settings);
        expect(result).toBe('Tasks: 1/2');
    });

    it('should show bar mode', () => {
        const context = createContext([
            { status: 'completed' },
            { status: 'completed' },
            { status: 'in_progress' },
            { status: 'pending' }
        ]);
        const item = createItem({ metadata: { display: 'bar' } });
        const result = widget.render(item, context, settings);
        expect(result).toMatch(/Tasks: \[#+[=.]*\] 50%/);
    });

    it('should have correct default color', () => {
        expect(widget.getDefaultColor()).toBe('cyan');
    });

    it('should support raw value', () => {
        expect(widget.supportsRawValue()).toBe(true);
    });

    it('should toggle mode on action', () => {
        const item = createItem();

        // Default -> count
        let updated = widget.handleEditorAction('toggle-mode', item);
        expect(updated?.metadata?.display).toBe('count');

        // count -> bar
        updated = widget.handleEditorAction('toggle-mode', updated!);
        expect(updated?.metadata?.display).toBe('bar');

        // bar -> progress
        updated = widget.handleEditorAction('toggle-mode', updated!);
        expect(updated?.metadata?.display).toBe('progress');
    });
});
