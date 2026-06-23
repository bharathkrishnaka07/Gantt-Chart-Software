"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import type { Roadmap, RoadmapTask, DragMode } from "@/types/roadmap";
import { useRoadmapStore } from "@/lib/stores/roadmap-store";
import {
  buildTimelineColumns,
  getTimelineWidth,
  getTaskPosition,
  getMilestonePosition,
  pixelToDate,
  snapToDay,
  clampDate,
  toISODate,
  TIMELINE_HEADER_HEIGHT,
} from "@/lib/timeline";
import { layoutTasksInLane } from "@/lib/gantt/collision";
import { GanttTimelineHeader } from "./gantt-timeline-header";
import { GanttSwimLaneRow } from "./gantt-swim-lane-row";
import { GanttMilestone } from "./gantt-milestone";

interface GanttChartProps {
  roadmap: Roadmap;
  readOnly?: boolean;
  presentationMode?: boolean;
}

interface DragState {
  taskId: string;
  mode: DragMode;
  startX: number;
  originalStart: Date;
  originalEnd: Date;
  originalLaneId: string;
  currentLaneId: string;
}

export function GanttChart({
  roadmap,
  readOnly = false,
  presentationMode = false,
}: GanttChartProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [milestoneDrag, setMilestoneDrag] = useState<{ id: string; startX: number; originalDate: Date } | null>(null);
  const [dragTargetLane, setDragTargetLane] = useState<string | null>(null);

  const {
    moveTask,
    updateMilestone,
    setSelectedTaskId,
    setSelectedMilestoneId,
    selectedTaskId,
    addTask,
    updateSwimLane,
  } = useRoadmapStore();

  const timelineStart = useMemo(() => new Date(roadmap.startDate), [roadmap.startDate]);
  const timelineEnd = useMemo(() => new Date(roadmap.endDate), [roadmap.endDate]);
  const columns = useMemo(
    () => buildTimelineColumns(timelineStart, timelineEnd, roadmap.zoomLevel),
    [timelineStart, timelineEnd, roadmap.zoomLevel]
  );
  const timelineWidth = getTimelineWidth(columns);
  const isLocked = roadmap.isLocked || readOnly;
  const showLockBadge = roadmap.isLocked && !readOnly;

  const getRect = useCallback(
    (start: Date, end: Date) =>
      getTaskPosition(start, end, columns, timelineStart, timelineEnd),
    [columns, timelineStart, timelineEnd]
  );

  const handleDragStart = (
    taskId: string,
    e: React.PointerEvent,
    mode: "move" | "resize-start" | "resize-end"
  ) => {
    if (isLocked) return;
    const task = roadmap.tasks.find((t) => t.id === taskId);
    if (!task) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragState({
      taskId,
      mode,
      startX: e.clientX,
      originalStart: new Date(task.startDate),
      originalEnd: new Date(task.endDate),
      originalLaneId: task.laneId,
      currentLaneId: task.laneId,
    });
  };

  useEffect(() => {
    if (!dragState) return;

    const handleMove = (e: PointerEvent) => {
      const deltaX = e.clientX - dragState.startX;
      const totalWidth = timelineWidth;
      const totalDays = Math.max(
        (timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24),
        1
      );
      const daysDelta = Math.round((deltaX / totalWidth) * totalDays);

      let newStart = new Date(dragState.originalStart);
      let newEnd = new Date(dragState.originalEnd);

      if (dragState.mode === "move") {
        newStart.setDate(newStart.getDate() + daysDelta);
        newEnd.setDate(newEnd.getDate() + daysDelta);
      } else if (dragState.mode === "resize-start") {
        newStart.setDate(newStart.getDate() + daysDelta);
        if (newStart >= newEnd) newStart = new Date(newEnd.getTime() - 86400000);
      } else if (dragState.mode === "resize-end") {
        newEnd.setDate(newEnd.getDate() + daysDelta);
        if (newEnd <= newStart) newEnd = new Date(newStart.getTime() + 86400000);
      }

      newStart = clampDate(snapToDay(newStart), timelineStart, timelineEnd);
      newEnd = clampDate(snapToDay(newEnd), timelineStart, timelineEnd);

      moveTask(
        roadmap.id,
        dragState.taskId,
        dragTargetLane ?? dragState.currentLaneId,
        toISODate(newStart),
        toISODate(newEnd)
      );
    };

    const handleUp = () => setDragState(null);

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [dragState, dragTargetLane, moveTask, roadmap.id, timelineEnd, timelineStart, timelineWidth]);

  useEffect(() => {
    if (!milestoneDrag) return;

    const handleMove = (e: PointerEvent) => {
      const scrollLeft = scrollRef.current?.scrollLeft ?? 0;
      const rect = timelineRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left + scrollLeft - 220;
      const date = pixelToDate(x, columns, timelineStart, timelineEnd);
      updateMilestone(roadmap.id, milestoneDrag.id, {
        date: toISODate(clampDate(snapToDay(date), timelineStart, timelineEnd)),
      });
    };

    const handleUp = () => setMilestoneDrag(null);

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [milestoneDrag, columns, timelineStart, timelineEnd, updateMilestone, roadmap.id]);

  const sortedLanes = [...roadmap.swimLanes].sort((a, b) => a.order - b.order);
  const totalHeight =
    sortedLanes.reduce((h, lane) => {
      if (lane.collapsed) return h + 40;
      const laneTasks = roadmap.tasks.filter((t) => t.laneId === lane.id);
      return h + layoutTasksInLane(laneTasks, getRect).contentHeight;
    }, 0) +
    TIMELINE_HEADER_HEIGHT +
    52;

  const todayLeft =
    new Date() >= timelineStart && new Date() <= timelineEnd
      ? getMilestonePosition(new Date(), columns, timelineStart, timelineEnd)
      : null;

  return (
    <div className="relative surface-card overflow-hidden">
      <div
        ref={scrollRef}
        className="gantt-scroll overflow-auto"
        style={{
          maxHeight: presentationMode
            ? "calc(100vh - 140px)"
            : "calc(100vh - 200px)",
          height: presentationMode ? "calc(100vh - 140px)" : undefined,
        }}
      >
        <div ref={timelineRef} style={{ minWidth: 220 + timelineWidth }}>
          <GanttTimelineHeader columns={columns} timelineWidth={timelineWidth} />

          {/* Grid lines */}
          <div className="relative" style={{ height: totalHeight - TIMELINE_HEADER_HEIGHT }}>
            {todayLeft !== null && (
              <div
                className="today-line"
                style={{ left: 220 + todayLeft, height: "100%" }}
              />
            )}
            <div
              className="absolute top-0 flex pointer-events-none"
              style={{ left: 220, width: timelineWidth, height: "100%" }}
            >
              {columns.map((col) => (
                <div
                  key={col.key}
                  className="border-r border-dashed border-border/30 h-full shrink-0"
                  style={{ width: col.width }}
                />
              ))}
            </div>

            {/* Milestones row */}
            <div
              className="relative border-b border-border/40 bg-gradient-to-r from-muted/20 to-muted/40"
              style={{ height: 52, marginLeft: 220, width: timelineWidth }}
            >
              {roadmap.milestones.map((ms) => {
                const left = getMilestonePosition(
                  new Date(ms.date),
                  columns,
                  timelineStart,
                  timelineEnd
                );
                return (
                  <GanttMilestone
                    key={ms.id}
                    milestone={ms}
                    left={left}
                    isLocked={isLocked}
                    onSelect={() => setSelectedMilestoneId(ms.id)}
                    onDragStart={(e) => {
                      if (isLocked) return;
                      setMilestoneDrag({
                        id: ms.id,
                        startX: e.clientX,
                        originalDate: new Date(ms.date),
                      });
                    }}
                  />
                );
              })}
            </div>

            {/* Swim lanes */}
            {sortedLanes.map((lane, index) => (
              <GanttSwimLaneRow
                key={lane.id}
                roadmapId={roadmap.id}
                lane={lane}
                isFirst={index === 0}
                isLast={index === sortedLanes.length - 1}
                tasks={roadmap.tasks}
                timelineWidth={timelineWidth}
                getTaskRect={getRect}
                isLocked={isLocked}
                selectedTaskId={selectedTaskId}
                onSelectTask={setSelectedTaskId}
                onToggleCollapse={() =>
                  updateSwimLane(roadmap.id, lane.id, { collapsed: !lane.collapsed })
                }
                onAddTask={() => {
                  const mid = new Date(timelineStart);
                  mid.setMonth(mid.getMonth() + 1);
                  const end = new Date(mid);
                  end.setMonth(end.getMonth() + 1);
                  addTask(roadmap.id, {
                    title: "New Task",
                    startDate: toISODate(mid),
                    endDate: toISODate(end),
                    color: lane.color,
                    laneId: lane.id,
                    tags: [],
                    links: [],
                    attachments: [],
                    priority: "medium",
                    status: "todo",
                  });
                }}
                onDragStart={handleDragStart}
                onLaneDragOver={setDragTargetLane}
                isDragTarget={dragTargetLane === lane.id}
              />
            ))}
          </div>
        </div>
      </div>

      {showLockBadge && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 right-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-2 text-sm font-medium flex items-center gap-2 shadow-lg"
        >
          🔒 Roadmap Locked
        </motion.div>
      )}
    </div>
  );
}
