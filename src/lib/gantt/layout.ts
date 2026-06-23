/** Shared Gantt canvas dimensions — single source of truth */

export const LANE_HEADER_WIDTH = 300;
export const TIMELINE_HEADER_HEIGHT = 64;
export const MILESTONE_ROW_HEIGHT = 64;

export const TASK_ROW_HEIGHT = 44;
export const TASK_ROW_GAP = 12;
export const LANE_PADDING_Y = 16;
export const LANE_MIN_HEIGHT = 80;
export const MIN_TASK_WIDTH = 64;

export const COLUMN_WIDTHS = {
  week: 128,
  month: 160,
  quarter: 120,
  year: 140,
} as const;
