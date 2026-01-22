import type { RenderContext } from '../types/RenderContext';
import type { Settings } from '../types/Settings';
import type {
    CustomKeybind,
    Widget,
    WidgetEditorDisplay,
    WidgetItem
} from '../types/Widget';

type DisplayMode = 'running' | 'recent' | 'both';

export class ToolsActivityWidget implements Widget {
    getDefaultColor(): string { return 'green'; }
    getDescription(): string { return 'Shows currently running and recently used tools'; }
    getDisplayName(): string { return 'Tools Activity'; }

    getEditorDisplay(item: WidgetItem): WidgetEditorDisplay {
        const mode = item.metadata?.display ?? 'running';
        const modifiers: string[] = [];

        if (mode === 'recent') {
            modifiers.push('recent only');
        } else if (mode === 'both') {
            modifiers.push('all');
        }

        return {
            displayText: this.getDisplayName(),
            modifierText: modifiers.length > 0 ? `(${modifiers.join(', ')})` : undefined
        };
    }

    handleEditorAction(action: string, item: WidgetItem): WidgetItem | null {
        if (action === 'toggle-mode') {
            const currentMode = (item.metadata?.display ?? 'running') as DisplayMode;
            let nextMode: DisplayMode;

            if (currentMode === 'running') {
                nextMode = 'recent';
            } else if (currentMode === 'recent') {
                nextMode = 'both';
            } else {
                nextMode = 'running';
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
        const displayMode = (item.metadata?.display ?? 'running') as DisplayMode;

        if (context.isPreview) {
            if (displayMode === 'running') {
                return item.rawValue ? '▶ Read, Edit' : 'Tools: ▶ Read, Edit';
            } else if (displayMode === 'recent') {
                return item.rawValue ? '✓ Bash, Grep' : 'Tools: ✓ Bash, Grep';
            }
            return item.rawValue ? '▶ Read ✓ Bash' : 'Tools: ▶ Read ✓ Bash';
        }

        const activity = context.activityMetrics;
        if (!activity) {
            return item.rawValue ? '-' : 'Tools: -';
        }

        const parts: string[] = [];

        // Running tools
        if (displayMode === 'running' || displayMode === 'both') {
            if (activity.runningTools.length > 0) {
                const running = activity.runningTools.map(t => t.name).join(', ');
                parts.push(`▶ ${running}`);
            }
        }

        // Recent tools
        if (displayMode === 'recent' || displayMode === 'both') {
            if (activity.recentTools.length > 0) {
                const recent = activity.recentTools.slice(0, 3).map(t => t.name).join(', ');
                parts.push(`✓ ${recent}`);
            }
        }

        if (parts.length === 0) {
            return item.rawValue ? '-' : 'Tools: -';
        }

        const result = parts.join(' ');
        return item.rawValue ? result : `Tools: ${result}`;
    }

    getCustomKeybinds(): CustomKeybind[] {
        return [
            { key: 'm', label: '(m)ode toggle', action: 'toggle-mode' }
        ];
    }

    supportsRawValue(): boolean { return true; }
    supportsColors(_item: WidgetItem): boolean { return true; }
}