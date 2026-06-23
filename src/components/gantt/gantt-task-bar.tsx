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
  const isDone = task.status === "done";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scaleX: 0.8 }}
      animate={{ opacity: isDone ? 0.65 : 1, scaleX: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
      className={cn(
        "task-bar absolute top-3 flex h-9 items-center gap-1.5 px-2.5 text-[11px] font-semibold text-white select-none",
        !isLocked && "cursor-grab active:cursor-grabbing",
        isSelected && "ring-2 ring-white/80 ring-offset-1 ring-offset-transparent z-10",
        isDone && "line-through decoration-white/50"
      )}
      style={{
        left,
        width: Math.max(width, 28),
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
            onPointerDown={(e) => { e.stopPropagation(); onDragStart(e, "resize-start"); }}
          />
          <div
            className="task-bar-resize-handle right"
            onPointerDown={(e) => { e.stopPropagation(); onDragStart(e, "resize-end"); }}
          />
        </>
      )}
      {task.priority === "high" && (
        <span className="h-1.5 w-1.5 rounded-full bg-white/80 shrink-0" />
      )}
      <span className="truncate">{task.title}</span>
    </motion.div>
  );
}
