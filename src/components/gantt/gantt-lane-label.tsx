"use client";

import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { motion } from "motion/react";
import type { SwimLane as SwimLaneType } from "@/types/roadmap";
import { LANE_HEADER_WIDTH } from "@/lib/gantt/layout";
import { laneReveal } from "@/lib/motion/presets";
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
  laneIndex?: number;
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
  laneIndex = 0,
}: GanttLaneLabelProps) {
  return (
    <motion.div
      custom={laneIndex}
      variants={laneReveal}
      initial="hidden"
      animate="visible"
      className="flex items-center border-b border-border/50 bg-white group/lane origin-left"
      style={{
        width: LANE_HEADER_WIDTH,
        minHeight: rowHeight,
        height: rowHeight,
      }}
    >
      <div className="flex w-full items-center gap-2 px-3 py-2 min-h-[52px]">
        <div
          className="h-3 w-3 rounded-full shrink-0 ring-2 ring-white shadow-sm"
          style={{ backgroundColor: lane.color }}
        />

        <p
          className={cn(
            "flex-1 min-w-0 text-sm font-semibold leading-snug text-foreground",
            isCollapsed ? "truncate" : "line-clamp-2"
          )}
          title={lane.name}
        >
          {lane.name}
        </p>

        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label={isCollapsed ? "Expand lane" : "Collapse lane"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
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
              className="rounded-md p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              aria-label="Add task"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
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
