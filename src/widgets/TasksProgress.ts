import type { RenderContext } from '../types/RenderContext';
import type { Settings } from '../types/Settings';
import type {
    CustomKeybind,
    Widget,
    WidgetEditorDisplay,
    WidgetItem
} from '../types/Widget';

type DisplayMode = 'progress' | 'count' | 'bar';

/**
 * Widget for displaying task progress from the new Tasks system (v2.1.16+)
 * Tracks TaskCreate/TaskUpdate/TaskList tool invocations
 */
export class TasksProgressWidget implements Widget {
    getDefaultColor(): string { return 'cyan'; }
    getDescription(): string { return 'Shows task list progress (new Tasks system)'; }
    getDisplayName(): string { return 'Tasks Progress'; }

    getEditorDisplay(item: WidgetItem): WidgetEditorDisplay {
        const mode = item.metadata?.display ?? 'progress';
        const modifiers: string[] = [];

        if (mode === 'count') {
            modifiers.push('count only');
        } else if (mode === 'bar') {
            modifiers.push('progress bar');
        }

        return {
            displayText: this.getDisplayName(),
            modifierText: modifiers.length > 0 ? `(${modifiers.join(', ')})` : undefined
        };
    }

    handleEditorAction(action: string, item: WidgetItem): WidgetItem | null {
        if (action === 'toggle-mode') {
            const currentMode = (item.metadata?.display ?? 'progress') as DisplayMode;
            let nextMode: DisplayMode;

            if (currentMode === 'progress') {
                nextMode = 'count';
            } else if (currentMode === 'count') {
                nextMode = 'bar';
            } else {
                nextMode = 'progress';
            }

            return {
                ...item,
                metadata: {
                    ...item.metadata,
                    display: nextMode
                }
            };
        }
        return null;
    }

    render(item: WidgetItem, context: RenderContext, _settings: Settings): string | null {
        const displayMode = (item.metadata?.display ?? 'progress') as DisplayMode;

        if (context.isPreview) {
            if (displayMode === 'progress') {
                return item.rawValue ? '3/5 (60%)' : 'Tasks: 3/5 (60%)';
            } else if (displayMode === 'count') {
                return item.rawValue ? '3/5' : 'Tasks: 3/5';
            }
            return item.rawValue ? '[########....] 60%' : 'Tasks: [########....] 60%';
        }

        const activity = context.activityMetrics;
        if (!activity || activity.tasks.length === 0) {
            if (displayMode === 'bar') {
                return item.rawValue ? '[............] 0%' : 'Tasks: [............] 0%';
            }
            return item.rawValue ? '0/0' : 'Tasks: 0/0';
        }

        const total = activity.tasks.length;
        const completed = activity.tasks.filter(t => t.status === 'completed').length;
        const inProgress = activity.tasks.filter(t => t.status === 'in_progress').length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        if (displayMode === 'bar') {
            const barWidth = 12;
            const filledWidth = Math.floor((completed / total) * barWidth);
            const inProgressWidth = Math.min(Math.ceil((inProgress / total) * barWidth), barWidth - filledWidth);
            const emptyWidth = barWidth - filledWidth - inProgressWidth;

            const bar = '#'.repeat(filledWidth) + '='.repeat(inProgressWidth) + '.'.repeat(emptyWidth);
            return item.rawValue ? `[${bar}] ${percentage}%` : `Tasks: [${bar}] ${percentage}%`;
        }

        if (displayMode === 'count') {
            return item.rawValue ? `${completed}/${total}` : `Tasks: ${completed}/${total}`;
        }

        // Progress mode (default)
        return item.rawValue ? `${completed}/${total} (${percentage}%)` : `Tasks: ${completed}/${total} (${percentage}%)`;
    }

    getCustomKeybinds(): CustomKeybind[] {
        return [
            { key: 'm', label: '(m)ode toggle', action: 'toggle-mode' }
        ];
    }

    supportsRawValue(): boolean { return true; }
    supportsColors(_item: WidgetItem): boolean { return true; }
}