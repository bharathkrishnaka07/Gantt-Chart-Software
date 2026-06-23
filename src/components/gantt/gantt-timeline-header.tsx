"use client";

import type { TimelineColumn } from "@/types/roadmap";
import { TIMELINE_HEADER_HEIGHT } from "@/lib/gantt/layout";

interface GanttTimelineHeaderProps {
  columns: TimelineColumn[];
  timelineWidth: number;
}

export function GanttTimelineHeader({ columns, timelineWidth }: GanttTimelineHeaderProps) {
  return (
    <div
      className="flex bg-slate-50 border-b border-border"
      style={{ width: timelineWidth, minWidth: timelineWidth, height: TIMELINE_HEADER_HEIGHT }}
    >
      {columns.map((col) => (
        <div
          key={col.key}
          className="flex items-center justify-center border-r border-border/40 text-sm font-medium text-slate-700 shrink-0 px-1"
          style={{ width: col.width }}
        >
          {col.label}
        </div>
      ))}
    </div>
  );
}
