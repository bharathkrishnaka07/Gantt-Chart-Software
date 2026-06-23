"use client";

import { motion } from "motion/react";
import type { TimelineColumn } from "@/types/roadmap";
import { TIMELINE_HEADER_HEIGHT } from "@/lib/gantt/layout";
import { columnReveal } from "@/lib/motion/presets";

interface GanttTimelineHeaderProps {
  columns: TimelineColumn[];
  timelineWidth: number;
}

export function GanttTimelineHeader({ columns, timelineWidth }: GanttTimelineHeaderProps) {
  return (
    <motion.div
      className="flex bg-slate-50/90 border-b border-border/60 overflow-hidden"
      style={{ width: timelineWidth, minWidth: timelineWidth, height: TIMELINE_HEADER_HEIGHT }}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.025, delayChildren: 0.1 } },
      }}
    >
      {columns.map((col, i) => (
        <motion.div
          key={col.key}
          custom={i}
          variants={columnReveal}
          className="flex items-center justify-center border-r border-border/40 text-sm font-medium text-slate-600 shrink-0 px-1 origin-top"
          style={{ width: col.width }}
          whileHover={{ backgroundColor: "rgba(37, 99, 235, 0.06)", color: "#2563eb" }}
        >
          {col.label}
        </motion.div>
      ))}
    </motion.div>
  );
}
