import type { RenderContext } from '../types/RenderContext';
import type { Settings } from '../types/Settings';
import type {
    CustomKeybind,
    Widget,
    WidgetEditorDisplay,
    WidgetItem
} from '../types/Widget';

type DisplayMode = 'count' | 'detail' | 'minimal';

export class AgentsActivityWidget implements Widget {
    getDefaultColor(): string { return 'blue'; }
    getDescription(): string { return 'Shows active subagents and tasks'; }
    getDisplayName(): string { return 'Agents Activity'; }

    getEditorDisplay(item: WidgetItem): WidgetEditorDisplay {
        const mode = item.metadata?.display ?? 'count';
        const modifiers: string[] = [];

        if (mode === 'detail') {
            modifiers.push('detailed');
        } else if (mode === 'minimal') {
            modifiers.push('minimal');
        }

        return {
            displayText: this.getDisplayName(),
            modifierText: modifiers.length > 0 ? `(${modifiers.join(', ')})` : undefined
        };
    }

    handleEditorAction(action: string, item: WidgetItem): WidgetItem | null {
        if (action === 'toggle-mode') {
            const currentMode = (item.metadata?.display ?? 'count') as DisplayMode;
            let nextMode: DisplayMode;

            if (currentMode === 'count') {
                nextMode = 'detail';
            } else if (currentMode === 'detail') {
                nextMode = 'minimal';
            } else {
                nextMode = 'count';
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
        const displayMode = (item.metadata?.display ?? 'count') as DisplayMode;

        if (context.isPreview) {
            if (displayMode === 'count') {
                return item.rawValue ? '2 active' : 'Agents: 2 active';
            } else if (displayMode === 'detail') {
                return item.rawValue ? '▶ Explore, Build' : 'Agents: ▶ Explore, Build';
            }
            return item.rawValue ? '2' : '🤖 2';
        }

        const activity = context.activityMetrics;
        if (!activity) {
            return item.rawValue ? '0' : 'Agents: 0';
        }

        const activeCount = activity.activeAgents.length;
        const completedCount = activity.completedAgents.length;

        if (displayMode === 'minimal') {
            if (activeCount === 0) {
                return item.rawValue ? '0' : '🤖 0';
            }
            return item.rawValue ? String(activeCount) : `🤖 ${activeCount}`;
        }

        if (displayMode === 'detail') {
            if (activeCount === 0) {
                if (completedCount > 0) {
                    const recent = activity.completedAgents.slice(0, 2).map(a => a.description).join(', ');
                    return item.rawValue ? `✓ ${recent}` : `Agents: ✓ ${recent}`;
                }
                return item.rawValue ? '-' : 'Agents: -';
            }

            const active = activity.activeAgents.slice(0, 2).map(a => a.description).join(', ');
            return item.rawValue ? `▶ ${active}` : `Agents: ▶ ${active}`;
        }

        // Count mode (default)
        if (activeCount === 0 && completedCount === 0) {
            return item.rawValue ? '0' : 'Agents: 0';
        }

        if (activeCount > 0) {
            return item.rawValue ? `${activeCount} active` : `Agents: ${activeCount} active`;
        }

        return item.rawValue ? `${completedCount} done` : `Agents: ${completedCount} done`;
    }

    getCustomKeybinds(): CustomKeybind[] {
        return [
            { key: 'm', label: '(m)ode toggle', action: 'toggle-mode' }
        ];
    }

    supportsRawValue(): boolean { return true; }
    supportsColors(_item: WidgetItem): boolean { return true; }
}