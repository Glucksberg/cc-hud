import type { BlockMetrics } from '../types';

import type { ActivityMetrics } from './ActivityMetrics';
import type { StatusJSON } from './StatusJSON';
import type { TokenMetrics } from './TokenMetrics';

export interface RenderContext {
    data?: StatusJSON;
    tokenMetrics?: TokenMetrics | null;
    sessionDuration?: string | null;
    blockMetrics?: BlockMetrics | null;
    activityMetrics?: ActivityMetrics | null;
    terminalWidth?: number | null;
    isPreview?: boolean;
    lineIndex?: number;  // Index of the current line being rendered (for theme cycling)
    globalSeparatorIndex?: number;  // Global separator index that continues across lines
}