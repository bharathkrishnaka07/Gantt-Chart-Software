"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import type { SwimLane as SwimLaneType, RoadmapTask } from "@/types/roadmap";
import { GanttTaskBar } from "./gantt-task-bar";
import { layoutTasksInLane } from "@/lib/gantt/collision";
import { laneReveal } from "@/lib/motion/presets";
import { cn } from "@/lib/utils";

interface GanttLaneTimelineProps {
  lane: SwimLaneType;
  tasks: RoadmapTask[];
  timelineWidth: number;
  rowHeight: number;
  contentHeight: number;
  getTaskRect: (start: Date, end: Date) => { left: number; width: number };
  isLocked: boolean;
  selectedTaskId: string | null;
  onSelectTask: (id: string) => void;
  onDragStart: (
    taskId: string,
    e: React.PointerEvent,
    mode: "move" | "resize-start" | "resize-end"
  ) => void;
  onLaneDragOver: (laneId: string) => void;
  isDragTarget: boolean;
  presentationMode?: boolean;
  laneIndex?: number;
}

export function GanttLaneTimeline({
  lane,
  tasks,
  timelineWidth,
  rowHeight,
  contentHeight,
  getTaskRect,
  isLocked,
  selectedTaskId,
  onSelectTask,
  onDragStart,
  onLaneDragOver,
  isDragTarget,
  presentationMode = false,
  laneIndex = 0,
}: GanttLaneTimelineProps) {
  const laneTasks = useMemo(
    () => tasks.filter((t) => t.laneId === lane.id),
    [tasks, lane.id]
  );

  const { layouts } = useMemo(
    () => layoutTasksInLane(laneTasks, getTaskRect),
    [laneTasks, getTaskRect]
  );

  if (lane.collapsed) {
    return (
      <motion.div
        custom={laneIndex}
        variants={laneReveal}
        initial="hidden"
        animate="visible"
        className={cn(
          "border-b border-border/50 bg-white/30 transition-colors origin-left",
          isDragTarget && "bg-primary/[0.04]"
        )}
        style={{ height: rowHeight, width: timelineWidth, minWidth: timelineWidth }}
        onPointerEnter={() => onLaneDragOver(lane.id)}
      />
    );
  }

  return (
    <motion.div
      custom={laneIndex}
      variants={laneReveal}
      initial="hidden"
      animate="visible"
      className={cn(
        "relative border-b border-border/50 bg-white/30 transition-colors origin-left overflow-hidden",
        isDragTarget && "bg-primary/[0.06]"
      )}
      style={{ height: rowHeight, width: timelineWidth, minWidth: timelineWidth }}
      onPointerEnter={() => onLaneDragOver(lane.id)}
    >
      <div
        className="relative h-full"
        style={{ height: contentHeight, minHeight: rowHeight }}
      >
        {laneTasks.map((task, taskIndex) => {
          const layout = layouts.get(task.id)!;
          return (
            <GanttTaskBar
              key={task.id}
              task={task}
              left={layout.left}
              width={layout.width}
              top={layout.top}
              row={layout.row}
              laneColor={lane.color}
              isLocked={isLocked}
              isSelected={selectedTaskId === task.id}
              onSelect={() => onSelectTask(task.id)}
              onDragStart={(e, mode) => onDragStart(task.id, e, mode)}
              presentationMode={presentationMode}
              enterDelay={laneIndex * 0.07 + taskIndex * 0.05 + 0.15}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
