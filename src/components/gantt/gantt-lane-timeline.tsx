"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { SwimLane as SwimLaneType, RoadmapTask } from "@/types/roadmap";
import { GanttTaskBar } from "./gantt-task-bar";
import { layoutTasksInLane } from "@/lib/gantt/collision";
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
      <div
        className={cn(
          "border-b border-border/50 bg-white/30 transition-colors",
          isDragTarget && "bg-primary/[0.04]"
        )}
        style={{ height: rowHeight, width: timelineWidth, minWidth: timelineWidth }}
        onPointerEnter={() => onLaneDragOver(lane.id)}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative border-b border-border/50 bg-white/30 transition-colors",
        isDragTarget && "bg-primary/[0.04]"
      )}
      style={{ height: rowHeight, width: timelineWidth, minWidth: timelineWidth }}
      onPointerEnter={() => onLaneDragOver(lane.id)}
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-full"
          style={{ height: contentHeight, minHeight: rowHeight }}
        >
          {laneTasks.map((task) => {
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
              />
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
