"use client";

import { motion } from "motion/react";
import type { Milestone as MilestoneType } from "@/types/roadmap";
import { MILESTONE_ROW_HEIGHT } from "@/lib/gantt/layout";
import { springMicro } from "@/lib/motion/presets";

interface GanttMilestoneProps {
  milestone: MilestoneType;
  left: number;
  isLocked: boolean;
  onSelect: () => void;
  onDragStart: (e: React.PointerEvent) => void;
}

export function GanttMilestone({
  milestone,
  left,
  isLocked,
  onSelect,
  onDragStart,
}: GanttMilestoneProps) {
  return (
    <motion.div
      className="absolute flex flex-col items-center group"
      style={{ left: left - 8, top: (MILESTONE_ROW_HEIGHT - 36) / 2, zIndex: 20 }}
      initial={{ opacity: 0, y: -8, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={springMicro}
    >
      <motion.div
        className={`h-3.5 w-3.5 milestone-diamond shadow-md ${!isLocked ? "cursor-grab active:cursor-grabbing" : ""}`}
        style={{ backgroundColor: milestone.color }}
        whileHover={!isLocked ? { scale: 1.2 } : undefined}
        whileTap={!isLocked ? { scale: 0.9 } : undefined}
        transition={springMicro}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerDown={(e) => {
          if (isLocked) return;
          onDragStart(e);
        }}
      />
      <span className="mt-1.5 max-w-[120px] truncate text-[11px] font-semibold text-slate-700 text-center px-1">
        {milestone.title}
      </span>
    </motion.div>
  );
}
