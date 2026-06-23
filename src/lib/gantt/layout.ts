/** Shared Gantt canvas dimensions — single source of truth */

export const LANE_HEADER_WIDTH = 340;
export const TIMELINE_HEADER_HEIGHT = 64;
export const MILESTONE_ROW_HEIGHT = 64;
export const LANE_LABEL_PADDING = 16;

export const TASK_ROW_HEIGHT = 44;
export const TASK_ROW_GAP = 12;
export const LANE_PADDING_Y = 16;
export const LANE_MIN_HEIGHT = 52;
export const MIN_TASK_WIDTH = 64;

export const COLUMN_WIDTHS = {
  week: 128,
  month: 160,
  quarter: 120,
  year: 140,
} as const;

/** Extra space at timeline edges so task bars aren't clipped when scrolling */
export const TIMELINE_EDGE_PADDING = 96;

/** Rough px width for task title at text-sm — used in presentation mode */
export function estimateTaskLabelWidth(title: string): number {
  return Math.ceil(title.length * 7.5) + 44;
}

/** Minimum row height for lane label (single-line header + optional 2nd line) */
export function estimateLaneLabelHeight(laneName: string): number {
  const usableWidth = LANE_HEADER_WIDTH - 108;
  const charsPerLine = Math.max(14, Math.floor(usableWidth / 7.5));
  const lines = Math.min(2, Math.max(1, Math.ceil(laneName.length / charsPerLine)));
  const titleHeight = lines * 20;
  return LANE_LABEL_PADDING + titleHeight + 20;
}

export function getLaneRowHeight(
  laneName: string,
  taskContentHeight: number,
  collapsed: boolean
): number {
  if (collapsed) return 52;
  return Math.max(taskContentHeight, estimateLaneLabelHeight(laneName), LANE_MIN_HEIGHT);
}

