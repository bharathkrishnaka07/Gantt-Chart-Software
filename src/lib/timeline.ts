import {
  addMonths,
  differenceInDays,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  endOfYear,
  format,
  isWithinInterval,
  startOfMonth,
  startOfQuarter,
  startOfYear,
} from "date-fns";
import type { TimelineColumn, ZoomLevel } from "@/types/roadmap";
import { MIN_TASK_WIDTH, COLUMN_WIDTHS, LANE_HEADER_WIDTH, TIMELINE_HEADER_HEIGHT, MILESTONE_ROW_HEIGHT } from "@/lib/gantt/layout";

const COLUMN_WIDTHS_MAP: Record<ZoomLevel, number> = COLUMN_WIDTHS;

export function getColumnWidth(zoom: ZoomLevel): number {
  return COLUMN_WIDTHS_MAP[zoom];
}

export function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}

export function toISODate(date: Date): string {
  return date.toISOString();
}

export function buildTimelineColumns(
  startDate: Date,
  endDate: Date,
  zoom: ZoomLevel
): TimelineColumn[] {
  const columns: TimelineColumn[] = [];

  switch (zoom) {
    case "year": {
      const years = new Set<number>();
      let current = startOfMonth(startDate);
      while (current <= endDate) {
        years.add(current.getFullYear());
        current = addMonths(current, 1);
      }
      Array.from(years)
        .sort()
        .forEach((year) => {
          const start = startOfYear(new Date(year, 0, 1));
          const end = endOfYear(new Date(year, 0, 1));
          columns.push({
            key: `year-${year}`,
            label: String(year),
            start,
            end,
            width: COLUMN_WIDTHS.year,
          });
        });
      break;
    }
    case "quarter": {
      let current = startOfQuarter(startDate);
      while (current <= endDate) {
        const end = endOfQuarter(current);
        const q = Math.floor(current.getMonth() / 3) + 1;
        columns.push({
          key: `q-${current.getFullYear()}-${q}`,
          label: `Q${q} ${format(current, "yyyy")}`,
          start: current,
          end,
          width: COLUMN_WIDTHS.quarter,
        });
        current = addMonths(startOfQuarter(current), 3);
      }
      break;
    }
    case "week": {
      const weeks = eachWeekOfInterval(
        { start: startDate, end: endDate },
        { weekStartsOn: 1 }
      );
      weeks.forEach((weekStart) => {
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
        columns.push({
          key: `w-${format(weekStart, "yyyy-MM-dd")}`,
          label: format(weekStart, "MMM d"),
          start: weekStart,
          end: weekEnd,
          width: COLUMN_WIDTHS.week,
        });
      });
      break;
    }
    case "month":
    default: {
      const months = eachMonthOfInterval({ start: startDate, end: endDate });
      months.forEach((monthStart) => {
        columns.push({
          key: `m-${format(monthStart, "yyyy-MM")}`,
          label: format(monthStart, "MMM yyyy"),
          start: monthStart,
          end: endOfMonth(monthStart),
          width: COLUMN_WIDTHS.month,
        });
      });
      break;
    }
  }

  return columns;
}

export function getTimelineWidth(columns: TimelineColumn[]): number {
  return columns.reduce((sum, col) => sum + col.width, 0);
}

export function dateToPixel(
  date: Date,
  columns: TimelineColumn[],
  timelineStart: Date,
  timelineEnd: Date
): number {
  const totalWidth = getTimelineWidth(columns);
  const totalDays = Math.max(differenceInDays(timelineEnd, timelineStart), 1);
  const dayOffset = differenceInDays(date, timelineStart);
  return Math.max(0, Math.min(totalWidth, (dayOffset / totalDays) * totalWidth));
}

export function pixelToDate(
  pixel: number,
  columns: TimelineColumn[],
  timelineStart: Date,
  timelineEnd: Date
): Date {
  const totalWidth = getTimelineWidth(columns);
  const totalDays = Math.max(differenceInDays(timelineEnd, timelineStart), 1);
  const ratio = Math.max(0, Math.min(1, pixel / totalWidth));
  const daysToAdd = Math.round(ratio * totalDays);
  const result = new Date(timelineStart);
  result.setDate(result.getDate() + daysToAdd);
  return result;
}

export function getTaskPosition(
  startDate: Date,
  endDate: Date,
  columns: TimelineColumn[],
  timelineStart: Date,
  timelineEnd: Date
): { left: number; width: number } {
  const left = dateToPixel(startDate, columns, timelineStart, timelineEnd);
  const right = dateToPixel(endDate, columns, timelineStart, timelineEnd);
  return {
    left,
    width: Math.max(right - left, MIN_TASK_WIDTH),
  };
}

export function snapToDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  return d;
}

export function clampDate(date: Date, min: Date, max: Date): Date {
  if (date < min) return new Date(min);
  if (date > max) return new Date(max);
  return date;
}

export function isDateInTimeline(date: Date, start: Date, end: Date): boolean {
  return isWithinInterval(date, { start, end });
}

export function getMilestonePosition(
  date: Date,
  columns: TimelineColumn[],
  timelineStart: Date,
  timelineEnd: Date
): number {
  return dateToPixel(date, columns, timelineStart, timelineEnd);
}

export const LANE_HEIGHT = 88;
export { LANE_HEADER_WIDTH, TIMELINE_HEADER_HEIGHT, MILESTONE_ROW_HEIGHT } from "@/lib/gantt/layout";
