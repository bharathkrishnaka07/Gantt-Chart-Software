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
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
} from "date-fns";
import type { TimelineColumn, ZoomLevel } from "@/types/roadmap";

export interface ZoomConfig {
  mode: ZoomLevel;
  columnWidth: number;
  headerHeight: number;
  rowHeight: number;
  laneHeaderWidth: number;
}

export const ZOOM_CONFIGS: Record<ZoomLevel, ZoomConfig> = {
  week: { mode: "week", columnWidth: 80, headerHeight: 56, rowHeight: 52, laneHeaderWidth: 220 },
  month: { mode: "month", columnWidth: 140, headerHeight: 56, rowHeight: 52, laneHeaderWidth: 220 },
  quarter: { mode: "quarter", columnWidth: 100, headerHeight: 56, rowHeight: 52, laneHeaderWidth: 220 },
  year: { mode: "year", columnWidth: 120, headerHeight: 56, rowHeight: 52, laneHeaderWidth: 220 },
};

export class GanttEngine {
  private startDate: Date;
  private endDate: Date;
  private config: ZoomConfig;
  private _columns: TimelineColumn[];

  constructor(startDate: Date, endDate: Date, zoom: ZoomLevel) {
    this.startDate = startOfMonth(startDate);
    this.endDate = endOfMonth(endDate);
    this.config = ZOOM_CONFIGS[zoom];
    this._columns = GanttEngine.buildColumns(this.startDate, this.endDate, zoom);
  }

  static buildColumns(startDate: Date, endDate: Date, zoom: ZoomLevel): TimelineColumn[] {
    const columns: TimelineColumn[] = [];
    const widths = ZOOM_CONFIGS[zoom].columnWidth;

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
            columns.push({
              key: `year-${year}`,
              label: String(year),
              start: startOfYear(new Date(year, 0, 1)),
              end: endOfYear(new Date(year, 0, 1)),
              width: widths,
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
            width: widths,
          });
          current = addMonths(startOfQuarter(current), 3);
        }
        break;
      }
      case "week": {
        eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 }).forEach(
          (weekStart) => {
            columns.push({
              key: `w-${format(weekStart, "yyyy-MM-dd")}`,
              label: format(weekStart, "MMM d"),
              start: weekStart,
              end: endOfWeek(weekStart, { weekStartsOn: 1 }),
              width: widths,
            });
          }
        );
        break;
      }
      default: {
        eachMonthOfInterval({ start: startDate, end: endDate }).forEach((monthStart) => {
          columns.push({
            key: `m-${format(monthStart, "yyyy-MM")}`,
            label: format(monthStart, "MMM yyyy"),
            start: monthStart,
            end: endOfMonth(monthStart),
            width: widths,
          });
        });
      }
    }
    return columns;
  }

  get timelineStart() {
    return this.startDate;
  }

  get timelineEnd() {
    return this.endDate;
  }

  get laneHeaderWidth() {
    return this.config.laneHeaderWidth;
  }

  get headerHeight() {
    return this.config.headerHeight;
  }

  get columns() {
    return this._columns;
  }

  get timelineWidth() {
    return this._columns.reduce((sum, c) => sum + c.width, 0);
  }

  get totalWidth() {
    return this.timelineWidth + this.config.laneHeaderWidth;
  }

  dateToPixel(date: Date): number {
    const totalWidth = this.timelineWidth;
    const totalDays = Math.max(differenceInDays(this.endDate, this.startDate), 1);
    const dayOffset = differenceInDays(date, this.startDate);
    return Math.max(0, Math.min(totalWidth, (dayOffset / totalDays) * totalWidth));
  }

  pixelToDate(pixel: number): Date {
    const totalWidth = this.timelineWidth;
    const totalDays = Math.max(differenceInDays(this.endDate, this.startDate), 1);
    const ratio = Math.max(0, Math.min(1, pixel / totalWidth));
    const daysToAdd = Math.round(ratio * totalDays);
    const result = new Date(this.startDate);
    result.setDate(result.getDate() + daysToAdd);
    result.setHours(12, 0, 0, 0);
    return result;
  }

  getTaskRect(startDate: Date, endDate: Date): { left: number; width: number } {
    const left = this.dateToPixel(startDate);
    const right = this.dateToPixel(endDate);
    return { left, width: Math.max(right - left, 24) };
  }

  snapToWeek(date: Date): Date {
    return startOfWeek(date, { weekStartsOn: 1 });
  }

  clampDate(date: Date): Date {
    if (date < this.startDate) return new Date(this.startDate);
    if (date > this.endDate) return new Date(this.endDate);
    return date;
  }
}

// Re-export constants for backward compatibility
export const LANE_HEADER_WIDTH = 220;
export const TIMELINE_HEADER_HEIGHT = 56;

export function buildTimelineColumns(start: Date, end: Date, zoom: ZoomLevel) {
  return GanttEngine.buildColumns(start, end, zoom);
}

export function getTimelineWidth(columns: TimelineColumn[]) {
  return columns.reduce((s, c) => s + c.width, 0);
}

export function getTaskPosition(
  startDate: Date,
  endDate: Date,
  columns: TimelineColumn[],
  timelineStart: Date,
  timelineEnd: Date
) {
  const engine = new GanttEngine(timelineStart, timelineEnd, "month");
  return engine.getTaskRect(startDate, endDate);
}

export function pixelToDate(
  pixel: number,
  columns: TimelineColumn[],
  timelineStart: Date,
  timelineEnd: Date
) {
  const engine = new GanttEngine(timelineStart, timelineEnd, "month");
  return engine.pixelToDate(pixel);
}

export function getMilestonePosition(
  date: Date,
  columns: TimelineColumn[],
  timelineStart: Date,
  timelineEnd: Date
) {
  const engine = new GanttEngine(timelineStart, timelineEnd, "month");
  return engine.dateToPixel(date);
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

export function toISODate(date: Date): string {
  return date.toISOString();
}
