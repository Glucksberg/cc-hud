import { execSync } from 'child_process';

import type { RenderContext } from '../types/RenderContext';
import type { Settings } from '../types/Settings';
import type {
    Widget,
    WidgetEditorDisplay,
    WidgetItem
} from '../types/Widget';

// Cache for BTC price to avoid excessive API calls
let cachedPrice: number | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION_MS = 60000; // 1 minute cache

function formatPrice(price: number): string {
    if (price >= 1000) {
        return `${(price / 1000).toFixed(1)}k`;
    }
    return price.toFixed(0);
}

function fetchBtcPrice(): number | null {
    const now = Date.now();

    // Return cached value if still valid
    if (cachedPrice !== null && (now - cacheTimestamp) < CACHE_DURATION_MS) {
        return cachedPrice;
    }

    try {
        // Use Coinbase API (free, no auth required, generous rate limits)
        const result = execSync(
            'curl -s "https://api.coinbase.com/v2/prices/BTC-USD/spot"',
            { timeout: 5000, encoding: 'utf-8' }
        );

        const data = JSON.parse(result) as { data?: { amount?: string } };
        const price = data.data?.amount ? parseFloat(data.data.amount) : undefined;

        if (typeof price === 'number') {
            cachedPrice = price;
            cacheTimestamp = now;
            return price;
        }
    } catch {
        // Return cached value even if expired, or null
        if (cachedPrice !== null) {
            return cachedPrice;
        }
    }

    return null;
}

export class BtcPriceWidget implements Widget {
    getDefaultColor(): string { return 'yellow'; }
    getDescription(): string { return 'Shows current Bitcoin price in USD'; }
    getDisplayName(): string { return 'BTC Price'; }
    getEditorDisplay(_item: WidgetItem): WidgetEditorDisplay {
        return { displayText: this.getDisplayName() };
    }

    render(item: WidgetItem, context: RenderContext, _settings: Settings): string | null {
        if (context.isPreview) {
            return item.rawValue ? '$100.5k' : 'BTC: $100.5k';
        }

        const price = fetchBtcPrice();
        if (price === null) {
            return null;
        }

        const formatted = `$${formatPrice(price)}`;
        return item.rawValue ? formatted : `BTC: ${formatted}`;
    }

    supportsRawValue(): boolean { return true; }
    supportsColors(_item: WidgetItem): boolean { return true; }
}
