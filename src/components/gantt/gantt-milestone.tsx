"use client";

import { motion } from "motion/react";
import type { Milestone as MilestoneType } from "@/types/roadmap";

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
      layout
      className="absolute top-0 flex flex-col items-center group"
      style={{ left: left - 7, zIndex: 20 }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className={`milestone-diamond shadow-sm ${!isLocked ? "cursor-grab active:cursor-grabbing" : ""}`}
        style={{ backgroundColor: milestone.color }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerDown={(e) => {
          if (isLocked) return;
          onDragStart(e);
        }}
      />
      <span className="mt-1 text-[10px] font-semibold text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-1.5 py-0.5 rounded-md shadow-sm">
        {milestone.title}
      </span>
    </motion.div>
  );
}
