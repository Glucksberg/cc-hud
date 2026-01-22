import type { RenderContext } from '../types/RenderContext';
import type { Settings } from '../types/Settings';
import type {
    CustomKeybind,
    Widget,
    WidgetEditorDisplay,
    WidgetItem
} from '../types/Widget';
import { detectApiTier } from '../utils/activity-parser';

type DisplayMode = 'tier' | 'usage' | 'both';

export class UsageLimitsWidget implements Widget {
    getDefaultColor(): string { return 'magenta'; }
    getDescription(): string { return 'Shows API tier and usage limits'; }
    getDisplayName(): string { return 'Usage Limits'; }

    getEditorDisplay(item: WidgetItem): WidgetEditorDisplay {
        const mode = item.metadata?.display ?? 'tier';
        const modifiers: string[] = [];

        if (mode === 'usage') {
            modifiers.push('usage only');
        } else if (mode === 'both') {
            modifiers.push('detailed');
        }

        return {
            displayText: this.getDisplayName(),
            modifierText: modifiers.length > 0 ? `(${modifiers.join(', ')})` : undefined
        };
    }

    handleEditorAction(action: string, item: WidgetItem): WidgetItem | null {
        if (action === 'toggle-mode') {
            const currentMode = (item.metadata?.display ?? 'tier') as DisplayMode;
            let nextMode: DisplayMode;

            if (currentMode === 'tier') {
                nextMode = 'usage';
            } else if (currentMode === 'usage') {
                nextMode = 'both';
            } else {
                nextMode = 'tier';
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
        const displayMode = (item.metadata?.display ?? 'tier') as DisplayMode;

        if (context.isPreview) {
            if (displayMode === 'tier') {
                return item.rawValue ? 'Pro' : 'Tier: Pro';
            } else if (displayMode === 'usage') {
                return item.rawValue ? '45/50 msgs' : 'Usage: 45/50 msgs';
            }
            return item.rawValue ? 'Pro 45/50' : 'Tier: Pro 45/50';
        }

        // Detect tier from model ID
        const modelId = context.data?.model?.id;
        const tier = detectApiTier(modelId);

        // Get usage limits if available
        const usageLimits = context.activityMetrics?.usageLimits;

        const tierDisplay = getTierDisplay(tier);

        if (displayMode === 'usage') {
            if (usageLimits?.messagesUsed !== undefined && usageLimits.messagesLimit !== undefined) {
                return item.rawValue
                    ? `${usageLimits.messagesUsed}/${usageLimits.messagesLimit} msgs`
                    : `Usage: ${usageLimits.messagesUsed}/${usageLimits.messagesLimit} msgs`;
            }
            return item.rawValue ? '-' : 'Usage: -';
        }

        if (displayMode === 'both') {
            if (usageLimits?.messagesUsed !== undefined && usageLimits.messagesLimit !== undefined) {
                return item.rawValue
                    ? `${tierDisplay} ${usageLimits.messagesUsed}/${usageLimits.messagesLimit}`
                    : `Tier: ${tierDisplay} ${usageLimits.messagesUsed}/${usageLimits.messagesLimit}`;
            }
            return item.rawValue ? tierDisplay : `Tier: ${tierDisplay}`;
        }

        // Tier mode (default)
        return item.rawValue ? tierDisplay : `Tier: ${tierDisplay}`;
    }

    getCustomKeybinds(): CustomKeybind[] {
        return [
            { key: 'm', label: '(m)ode toggle', action: 'toggle-mode' }
        ];
    }

    supportsRawValue(): boolean { return true; }
    supportsColors(_item: WidgetItem): boolean { return true; }
}

function getTierDisplay(tier: string): string {
    switch (tier) {
    case 'free': return 'Free';
    case 'pro': return 'Pro';
    case 'max': return 'Max';
    case 'team': return 'Team';
    default: return '?';
    }
}