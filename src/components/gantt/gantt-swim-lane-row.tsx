"use client";

import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronRight, GripVertical, Plus } from "lucide-react";
import type { SwimLane as SwimLaneType, RoadmapTask } from "@/types/roadmap";
import { GanttTaskBar } from "./gantt-task-bar";
import { LANE_HEIGHT } from "@/lib/timeline";
import { cn } from "@/lib/utils";
import { SwimLaneMenu } from "./swim-lane-menu";

interface GanttSwimLaneRowProps {
  roadmapId: string;
  lane: SwimLaneType;
  isFirst: boolean;
  isLast: boolean;
  tasks: RoadmapTask[];
  timelineWidth: number;
  getTaskPosition: (task: RoadmapTask) => { left: number; width: number };
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
  getTaskPosition,
  isLocked,
  selectedTaskId,
  onSelectTask,
  onToggleCollapse,
  onAddTask,
  onDragStart,
  onLaneDragOver,
  isDragTarget,
}: GanttSwimLaneRowProps) {
  const laneTasks = tasks.filter((t) => t.laneId === lane.id);

  return (
    <div
      className={cn(
        "flex border-b border-border/60 transition-colors",
        isDragTarget && "bg-primary/5"
      )}
      style={{ minHeight: lane.collapsed ? 40 : LANE_HEIGHT }}
      onPointerEnter={() => onLaneDragOver(lane.id)}
    >
      {/* Sticky lane label */}
      <div
        className="sticky left-0 z-20 flex shrink-0 items-center gap-2 border-r border-border/60 bg-white/95 backdrop-blur-sm px-3"
        style={{ width: 220 }}
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
            animate={{ height: LANE_HEIGHT, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative flex-1"
            style={{ width: timelineWidth, minWidth: timelineWidth }}
          >
            {laneTasks.map((task) => {
              const pos = getTaskPosition(task);
              return (
                <GanttTaskBar
                  key={task.id}
                  task={task}
                  left={pos.left}
                  width={pos.width}
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
