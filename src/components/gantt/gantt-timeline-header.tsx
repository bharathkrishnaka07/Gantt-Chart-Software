"use client";

import type { TimelineColumn } from "@/types/roadmap";
import { LANE_HEADER_WIDTH, TIMELINE_HEADER_HEIGHT } from "@/lib/gantt/layout";

interface GanttTimelineHeaderProps {
  columns: TimelineColumn[];
  timelineWidth: number;
}

export function GanttTimelineHeader({ columns, timelineWidth }: GanttTimelineHeaderProps) {
  return (
    <div className="flex border-b border-border/60 bg-white sticky top-0 z-30 shadow-sm">
      <div
        className="sticky left-0 z-40 shrink-0 border-r border-border/60 bg-white flex items-end px-4 pb-3"
        style={{ width: LANE_HEADER_WIDTH, height: TIMELINE_HEADER_HEIGHT }}
      >
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
          Swim Lanes
        </span>
      </div>
      <div
        className="flex bg-slate-50/80"
        style={{ width: timelineWidth, minWidth: timelineWidth, height: TIMELINE_HEADER_HEIGHT }}
      >
        {columns.map((col) => (
          <div
            key={col.key}
            className="flex items-center justify-center border-r border-border/40 text-sm font-medium text-slate-600 shrink-0 px-1"
            style={{ width: col.width }}
          >
            {col.label}
          </div>
        ))}
      </div>
    </div>
  );
}
