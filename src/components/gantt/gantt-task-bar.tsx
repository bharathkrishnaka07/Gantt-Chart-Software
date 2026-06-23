"use client";

import { motion } from "motion/react";
import type { RoadmapTask } from "@/types/roadmap";
import { cn } from "@/lib/utils";

interface GanttTaskBarProps {
  task: RoadmapTask;
  left: number;
  width: number;
  isLocked: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart: (e: React.PointerEvent, mode: "move" | "resize-start" | "resize-end") => void;
}

export function GanttTaskBar({
  task,
  left,
  width,
  isLocked,
  isSelected,
  onSelect,
  onDragStart,
}: GanttTaskBarProps) {
  const statusOpacity = task.status === "done" ? 0.6 : 1;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: statusOpacity, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "task-bar absolute top-2 flex h-10 items-center rounded-lg px-3 text-xs font-medium text-white shadow-md select-none",
        !isLocked && "cursor-grab active:cursor-grabbing",
        isSelected && "ring-2 ring-white ring-offset-1 ring-offset-transparent"
      )}
      style={{
        left,
        width: Math.max(width, 24),
        backgroundColor: task.color,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerDown={(e) => {
        if (isLocked) return;
        if ((e.target as HTMLElement).classList.contains("task-bar-resize-handle")) return;
        onDragStart(e, "move");
      }}
    >
      {!isLocked && (
        <>
          <div
            className="task-bar-resize-handle left"
            onPointerDown={(e) => {
              e.stopPropagation();
              onDragStart(e, "resize-start");
            }}
          />
          <div
            className="task-bar-resize-handle right"
            onPointerDown={(e) => {
              e.stopPropagation();
              onDragStart(e, "resize-end");
            }}
          />
        </>
      )}
      <span className="truncate">{task.title}</span>
      {task.status === "done" && (
        <span className="ml-auto text-[10px] opacity-80">✓</span>
      )}
    </motion.div>
  );
}
