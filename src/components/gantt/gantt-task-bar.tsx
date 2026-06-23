"use client";

import { motion } from "motion/react";
import type { RoadmapTask } from "@/types/roadmap";
import { getTaskBackground, getTaskBorderAccent, MIN_TASK_WIDTH } from "@/lib/gantt/collision";
import { cn } from "@/lib/utils";

interface GanttTaskBarProps {
  task: RoadmapTask;
  left: number;
  width: number;
  top: number;
  row?: number;
  laneColor?: string;
  isLocked: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart: (e: React.PointerEvent, mode: "move" | "resize-start" | "resize-end") => void;
}

export function GanttTaskBar({
  task,
  left,
  width,
  top,
  row = 0,
  laneColor,
  isLocked,
  isSelected,
  onSelect,
  onDragStart,
}: GanttTaskBarProps) {
  const isDone = task.status === "done";
  const accent = getTaskBorderAccent(task.color ?? laneColor ?? "#2563EB");
  const background = getTaskBackground(laneColor ?? task.color ?? "#2563EB");

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.8 }}
      animate={{ opacity: isDone ? 0.65 : 1, scaleX: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
      className={cn(
        "task-bar absolute flex h-9 items-center gap-1.5 rounded-lg border border-white/20 px-2.5 text-[11px] font-medium text-slate-700 select-none",
        !isLocked && "cursor-grab active:cursor-grabbing",
        isSelected && "ring-2 ring-primary/30 ring-offset-1 ring-offset-transparent z-10",
        isDone && "line-through decoration-slate-500/50"
      )}
      style={{
        left,
        top,
        width: Math.max(width, MIN_TASK_WIDTH),
        backgroundColor: background,
        zIndex: row + 1,
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
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
        style={{ background: accent }}
      />
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
        <span className="ml-1 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: accent }} />
      )}
      <span className="truncate ml-1">{task.title}</span>
    </motion.div>
  );
}
