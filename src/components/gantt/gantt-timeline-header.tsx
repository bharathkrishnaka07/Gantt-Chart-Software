"use client";

import type { TimelineColumn } from "@/types/roadmap";
import { TIMELINE_HEADER_HEIGHT } from "@/lib/timeline";

interface GanttTimelineHeaderProps {
  columns: TimelineColumn[];
  timelineWidth: number;
}

export function GanttTimelineHeader({ columns, timelineWidth }: GanttTimelineHeaderProps) {
  return (
    <div className="flex border-b border-border/60 bg-white/95 backdrop-blur-sm sticky top-0 z-30">
      <div
        className="sticky left-0 z-40 shrink-0 border-r border-border/60 bg-white/95 backdrop-blur-sm flex items-center px-4"
        style={{ width: 220, height: TIMELINE_HEADER_HEIGHT }}
      >
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Swim Lanes
        </span>
      </div>
      <div
        className="flex"
        style={{ width: timelineWidth, minWidth: timelineWidth, height: TIMELINE_HEADER_HEIGHT }}
      >
        {columns.map((col) => (
          <div
            key={col.key}
            className="flex items-center justify-center border-r border-border/40 text-xs font-medium text-muted-foreground shrink-0"
            style={{ width: col.width }}
          >
            {col.label}
          </div>
        ))}
      </div>
    </div>
  );
}
