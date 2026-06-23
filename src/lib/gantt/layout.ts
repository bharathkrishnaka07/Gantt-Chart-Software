/** Shared Gantt canvas dimensions — single source of truth */

export const LANE_HEADER_WIDTH = 340;
export const TIMELINE_HEADER_HEIGHT = 64;
export const MILESTONE_ROW_HEIGHT = 64;
export const LANE_LABEL_ACTIONS_HEIGHT = 44;
export const LANE_LABEL_PADDING = 24;

export const TASK_ROW_HEIGHT = 44;
export const TASK_ROW_GAP = 12;
export const LANE_PADDING_Y = 16;
export const LANE_MIN_HEIGHT = 96;
export const MIN_TASK_WIDTH = 64;

export const COLUMN_WIDTHS = {
  week: 128,
  month: 160,
  quarter: 120,
  year: 140,
} as const;

/** Minimum row height so multi-line lane titles + actions are never clipped */
export function estimateLaneLabelHeight(laneName: string): number {
  const usableWidth = LANE_HEADER_WIDTH - 56;
  const charsPerLine = Math.max(12, Math.floor(usableWidth / 7.5));
  const lines = Math.max(1, Math.ceil(laneName.length / charsPerLine));
  const titleHeight = lines * 22;
  return LANE_LABEL_PADDING + titleHeight + LANE_LABEL_ACTIONS_HEIGHT;
}

export function getLaneRowHeight(
  laneName: string,
  taskContentHeight: number,
  collapsed: boolean
): number {
  if (collapsed) return 52;
  return Math.max(taskContentHeight, estimateLaneLabelHeight(laneName), LANE_MIN_HEIGHT);
}

