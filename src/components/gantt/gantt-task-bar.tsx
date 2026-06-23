"use client";

import { motion } from "motion/react";
import type { RoadmapTask } from "@/types/roadmap";
import {
  getTaskBackground,
  getTaskBorderAccent,
  MIN_TASK_WIDTH,
  TASK_ROW_HEIGHT,
} from "@/lib/gantt/collision";
import { estimateTaskLabelWidth } from "@/lib/gantt/layout";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  presentationMode?: boolean;
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
  presentationMode = false,
}: GanttTaskBarProps) {
  const isDone = task.status === "done";
  const accent = getTaskBorderAccent(task.color ?? laneColor ?? "#2563EB");
  const background = getTaskBackground(laneColor ?? task.color ?? "#2563EB");
  const barWidth = presentationMode
    ? Math.max(width, MIN_TASK_WIDTH, estimateTaskLabelWidth(task.title))
    : Math.max(width, MIN_TASK_WIDTH);

  const bar = (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.92 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
      className={cn(
        "task-bar absolute flex items-center gap-2 rounded-xl border border-white/30 px-3 text-sm font-medium select-none",
        !isLocked && "cursor-grab active:cursor-grabbing",
        isSelected && "ring-2 ring-primary/40 ring-offset-1 ring-offset-transparent z-10",
        isDone
          ? "text-slate-500 line-through decoration-slate-400/70"
          : "text-slate-800"
      )}
      style={{
        left,
        top,
        width: barWidth,
        height: TASK_ROW_HEIGHT,
        backgroundColor: isDone ? "rgba(241, 245, 249, 0.95)" : background,
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
        className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
        style={{ background: isDone ? "#94a3b8" : accent }}
      />
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
      {task.priority === "high" && !isDone && (
        <span className="ml-1 h-2 w-2 rounded-full shrink-0" style={{ background: accent }} />
      )}
      <span
        className={cn(
          "ml-1 pr-1",
          presentationMode ? "whitespace-nowrap" : "truncate"
        )}
      >
        {task.title}
      </span>
    </motion.div>
  );

  if (presentationMode) return bar;

  return (
    <Tooltip delayDuration={400}>
      <TooltipTrigger asChild>{bar}</TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-sm">
        {task.title}
      </TooltipContent>
    </Tooltip>
  );
}
