"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronRight, GripVertical, Plus } from "lucide-react";
import type { SwimLane as SwimLaneType, RoadmapTask } from "@/types/roadmap";
import { GanttTaskBar } from "./gantt-task-bar";
import { layoutTasksInLane } from "@/lib/gantt/collision";
import { LANE_HEADER_WIDTH } from "@/lib/gantt/layout";
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
        "lane-row flex border-b border-border/50 transition-colors bg-white/40",
        isDragTarget && "bg-primary/[0.04]"
      )}
      style={{ minHeight: lane.collapsed ? 48 : contentHeight }}
      onPointerEnter={() => onLaneDragOver(lane.id)}
    >
      {/* Sticky lane label — wide enough for full names */}
      <div
        className="sticky left-0 z-20 flex shrink-0 flex-col justify-between gap-2 border-r border-border/50 bg-white px-3 py-3 self-stretch"
        style={{ width: LANE_HEADER_WIDTH, minHeight: lane.collapsed ? 48 : contentHeight }}
      >
        <div className="flex items-start gap-2 min-w-0">
          <div
            className="mt-1 h-3.5 w-3.5 rounded-full shrink-0 ring-2 ring-white shadow-sm"
            style={{ backgroundColor: lane.color }}
          />
          <p className="text-sm font-semibold leading-snug text-foreground break-words">
            {lane.name}
          </p>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          <GripVertical className="h-4 w-4 text-muted-foreground/35 shrink-0" />
          <button
            onClick={onToggleCollapse}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label={lane.collapsed ? "Expand lane" : "Collapse lane"}
          >
            {lane.collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
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
              className="rounded-md p-1 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              aria-label="Add task"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
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
