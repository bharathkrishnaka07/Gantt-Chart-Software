import type { RoadmapTask } from "@/types/roadmap";

export const TASK_ROW_HEIGHT = 36;
export const TASK_ROW_GAP = 6;
export const LANE_PADDING_Y = 10;
export const LANE_MIN_HEIGHT = 56;
export const MIN_TASK_WIDTH = 28;

export interface TaskRowLayout {
  taskId: string;
  row: number;
  left: number;
  width: number;
  top: number;
}

export interface LaneLayoutResult {
  layouts: Map<string, TaskRowLayout>;
  contentHeight: number;
  rowCount: number;
}

interface PixelRect {
  left: number;
  width: number;
}

function normalizeRect(rect: { left: number; width: number }): PixelRect {
  return { left: rect.left, width: Math.max(rect.width, MIN_TASK_WIDTH) };
}

/** True when two task bars would visually overlap on the timeline */
function rectsOverlap(a: PixelRect, b: PixelRect): boolean {
  const aRight = a.left + a.width;
  const bRight = b.left + b.width;
  // Small gap tolerance — treat sub-pixel touch as overlap
  return a.left < bRight - 0.5 && aRight > b.left + 0.5;
}

function tasksOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  const aStartMs = startOfDay(aStart).getTime();
  const aEndMs = endOfDay(aEnd).getTime();
  const bStartMs = startOfDay(bStart).getTime();
  const bEndMs = endOfDay(bEnd).getTime();
  return aStartMs <= bEndMs && aEndMs >= bStartMs;
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

interface RowEntry {
  start: Date;
  end: Date;
  taskId: string;
  rect: PixelRect;
}

/** Assign overlapping tasks to separate rows within a swim lane */
export function layoutTasksInLane(
  tasks: RoadmapTask[],
  getRect: (start: Date, end: Date) => { left: number; width: number }
): LaneLayoutResult {
  if (tasks.length === 0) {
    return {
      layouts: new Map(),
      contentHeight: LANE_MIN_HEIGHT,
      rowCount: 1,
    };
  }

  const sorted = [...tasks].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const rows: RowEntry[][] = [];
  const layouts = new Map<string, TaskRowLayout>();

  for (const task of sorted) {
    const start = new Date(task.startDate);
    const end = new Date(task.endDate);
    const rect = normalizeRect(getRect(start, end));

    let assignedRow = -1;
    for (let r = 0; r < rows.length; r++) {
      const hasConflict = rows[r].some(
        (existing) =>
          rectsOverlap(rect, existing.rect) ||
          tasksOverlap(start, end, existing.start, existing.end)
      );
      if (!hasConflict) {
        assignedRow = r;
        rows[r].push({ start, end, taskId: task.id, rect });
        break;
      }
    }

    if (assignedRow === -1) {
      assignedRow = rows.length;
      rows.push([{ start, end, taskId: task.id, rect }]);
    }

    layouts.set(task.id, {
      taskId: task.id,
      row: assignedRow,
      left: rect.left,
      width: rect.width,
      top: LANE_PADDING_Y + assignedRow * (TASK_ROW_HEIGHT + TASK_ROW_GAP),
    });
  }

  const rowCount = rows.length;
  const contentHeight = Math.max(
    LANE_MIN_HEIGHT,
    LANE_PADDING_Y * 2 + rowCount * TASK_ROW_HEIGHT + Math.max(0, rowCount - 1) * TASK_ROW_GAP
  );

  return { layouts, contentHeight, rowCount };
}

export function getTaskBackground(laneColor: string): string {
  const hex = laneColor.replace("#", "");
  if (hex.length !== 6) return "rgba(37, 99, 235, 0.10)";
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, 0.12)`;
}

export function getTaskBorderAccent(color: string): string {
  return color || "#2563EB";
}
