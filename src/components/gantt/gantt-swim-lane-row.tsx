"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronRight, GripVertical, Plus } from "lucide-react";
import type { SwimLane as SwimLaneType, RoadmapTask } from "@/types/roadmap";
import { GanttTaskBar } from "./gantt-task-bar";
import { layoutTasksInLane } from "@/lib/gantt/collision";
import { cn } from "@/lib/utils";
import { SwimLaneMenu } from "./swim-lane-menu";

interface GanttSwimLaneRowProps {
  roadmapId: string;
  lane: SwimLaneType;
  isFirst: boolean;
  isLast: boolean;
  tasks: RoadmapTask[];
  timelineWidth: number;
  getTaskRect: (start: Date, end: Date) => { left: number; width: number };
  isLocked: boolean;
  selectedTaskId: string | null;
  onSelectTask: (id: string) => void;
  onToggleCollapse: () => void;
  onAddTask: () => void;
  onDragStart: (
    taskId: string,
    e: React.PointerEvent,
    mode: "move" | "resize-start" | "resize-end"
  ) => void;
  onLaneDragOver: (laneId: string) => void;
  isDragTarget: boolean;
}

export function GanttSwimLaneRow({
  roadmapId,
  lane,
  isFirst,
  isLast,
  tasks,
  timelineWidth,
  getTaskRect,
  isLocked,
  selectedTaskId,
  onSelectTask,
  onToggleCollapse,
  onAddTask,
  onDragStart,
  onLaneDragOver,
  isDragTarget,
}: GanttSwimLaneRowProps) {
  const laneTasks = useMemo(
    () => tasks.filter((t) => t.laneId === lane.id),
    [tasks, lane.id]
  );

  const { layouts, contentHeight } = useMemo(
    () => layoutTasksInLane(laneTasks, getTaskRect),
    [laneTasks, getTaskRect]
  );

  return (
    <div
      className={cn(
        "lane-row flex border-b border-border/40 transition-colors",
        isDragTarget && "bg-primary/[0.04]"
      )}
      style={{ minHeight: lane.collapsed ? 40 : contentHeight }}
      onPointerEnter={() => onLaneDragOver(lane.id)}
    >
      {/* Sticky lane label */}
      <div
        className="sticky left-0 z-20 flex shrink-0 items-start gap-1.5 border-r border-border/40 bg-white/95 backdrop-blur-md px-2.5 py-3 self-stretch"
        style={{ width: 220, minHeight: lane.collapsed ? 40 : contentHeight }}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0" />
        <div
          className="h-3 w-3 rounded-full shrink-0"
          style={{ backgroundColor: lane.color }}
        />
        <button
          onClick={onToggleCollapse}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {lane.collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        <span className="text-xs font-semibold truncate flex-1">{lane.name}</span>
        <SwimLaneMenu
          roadmapId={roadmapId}
          lane={lane}
          isLocked={isLocked}
          isFirst={isFirst}
          isLast={isLast}
        />
        {!isLocked && (
          <button
            onClick={onAddTask}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Timeline area */}
      <AnimatePresence>
        {!lane.collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: contentHeight, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative flex-1"
            style={{ width: timelineWidth, minWidth: timelineWidth, height: contentHeight }}
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
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
