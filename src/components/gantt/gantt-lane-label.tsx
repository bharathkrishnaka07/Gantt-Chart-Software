"use client";

import { ChevronDown, ChevronRight, GripVertical, Plus } from "lucide-react";
import type { SwimLane as SwimLaneType } from "@/types/roadmap";
import { LANE_HEADER_WIDTH } from "@/lib/gantt/layout";
import { cn } from "@/lib/utils";
import { SwimLaneMenu } from "./swim-lane-menu";

interface GanttLaneLabelProps {
  roadmapId: string;
  lane: SwimLaneType;
  rowHeight: number;
  isFirst: boolean;
  isLast: boolean;
  isLocked: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onAddTask: () => void;
}

export function GanttLaneLabel({
  roadmapId,
  lane,
  rowHeight,
  isFirst,
  isLast,
  isLocked,
  isCollapsed,
  onToggleCollapse,
  onAddTask,
}: GanttLaneLabelProps) {
  return (
    <div
      className={cn(
        "flex flex-col border-b border-border/50 bg-white px-4 py-3",
        isCollapsed && "justify-center"
      )}
      style={{
        width: LANE_HEADER_WIDTH,
        minHeight: rowHeight,
        height: rowHeight,
      }}
    >
      {!isCollapsed && (
        <div className="flex items-start gap-2.5 flex-1 min-h-0">
          <div
            className="mt-0.5 h-3.5 w-3.5 rounded-full shrink-0 ring-2 ring-white shadow-sm"
            style={{ backgroundColor: lane.color }}
          />
          <p className="text-sm font-semibold leading-relaxed text-foreground whitespace-normal break-words overflow-visible">
            {lane.name}
          </p>
        </div>
      )}

      {isCollapsed && (
        <div className="flex items-center justify-center gap-2">
          <div
            className="h-3.5 w-3.5 rounded-full shrink-0"
            style={{ backgroundColor: lane.color }}
          />
          <span className="text-xs font-semibold text-muted-foreground whitespace-normal break-words text-center leading-snug">
            {lane.name}
          </span>
        </div>
      )}

      <div className="flex items-center gap-0.5 mt-2 shrink-0">
        <GripVertical className="h-4 w-4 text-muted-foreground/30 shrink-0" />
        <button
          type="button"
          onClick={onToggleCollapse}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label={isCollapsed ? "Expand lane" : "Collapse lane"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        <SwimLaneMenu
          roadmapId={roadmapId}
          lane={lane}
          isLocked={isLocked}
          isFirst={isFirst}
          isLast={isLast}
        />
        {!isLocked && (
          <button
            type="button"
            onClick={onAddTask}
            className="rounded-md p-1 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            aria-label="Add task"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export function GanttMilestoneLaneLabel() {
  return (
    <div
      className="flex items-center border-b border-border/50 bg-slate-50 px-4"
      style={{ width: LANE_HEADER_WIDTH, height: "var(--milestone-row-height)" }}
    >
      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        Milestones
      </span>
    </div>
  );
}

export function GanttLaneHeaderCorner() {
  return (
    <div
      className="flex items-end border-b border-r border-border/60 bg-white px-4 pb-3 shrink-0"
      style={{ width: LANE_HEADER_WIDTH, height: "var(--timeline-header-height)" }}
    >
      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        Swim Lanes
      </span>
    </div>
  );
}
