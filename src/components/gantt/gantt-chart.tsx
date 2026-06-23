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
} from "@/lib/timeline";
import { LANE_HEADER_WIDTH, MILESTONE_ROW_HEIGHT, TIMELINE_HEADER_HEIGHT, getLaneRowHeight, TIMELINE_EDGE_PADDING } from "@/lib/gantt/layout";
import { layoutTasksInLane } from "@/lib/gantt/collision";
import { GanttTimelineHeader } from "./gantt-timeline-header";
import {
  GanttLaneHeaderCorner,
  GanttLaneLabel,
  GanttMilestoneLaneLabel,
} from "./gantt-lane-label";
import { GanttLaneTimeline } from "./gantt-lane-timeline";
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
  const lanePanelRef = useRef<HTMLDivElement>(null);
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const syncingScroll = useRef(false);
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
      const x = e.clientX - rect.left + scrollLeft - TIMELINE_EDGE_PADDING;
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

  const laneRows = useMemo(() => {
    return sortedLanes.map((lane, index) => {
      const displayLane = presentationMode ? { ...lane, collapsed: false } : lane;
      const laneTasks = roadmap.tasks.filter((t) => t.laneId === lane.id);
      const { contentHeight } = layoutTasksInLane(laneTasks, getRect);
      const rowHeight = getLaneRowHeight(displayLane.name, contentHeight, displayLane.collapsed);
      return { lane: displayLane, index, contentHeight, rowHeight };
    });
  }, [sortedLanes, roadmap.tasks, getRect, presentationMode]);

  const syncVerticalScroll = (source: "lane" | "body") => {
    if (syncingScroll.current) return;
    const laneEl = lanePanelRef.current;
    const bodyEl = scrollRef.current;
    if (!laneEl || !bodyEl) return;
    syncingScroll.current = true;
    if (source === "lane") {
      bodyEl.scrollTop = laneEl.scrollTop;
    } else {
      laneEl.scrollTop = bodyEl.scrollTop;
    }
    syncingScroll.current = false;
  };

  const syncHorizontalScroll = () => {
    const bodyEl = scrollRef.current;
    const headerEl = headerScrollRef.current;
    if (!bodyEl || !headerEl) return;
    headerEl.scrollLeft = bodyEl.scrollLeft;
  };

  const todayLeft =
    new Date() >= timelineStart && new Date() <= timelineEnd
      ? getMilestonePosition(new Date(), columns, timelineStart, timelineEnd)
      : null;

  const canvasHeight = presentationMode ? "100%" : "calc(100vh - 168px)";
  const scrollContentWidth = timelineWidth + TIMELINE_EDGE_PADDING * 2;

  // Scroll timeline to "today" when entering presentation
  useEffect(() => {
    if (!presentationMode || !scrollRef.current) return;

    const scrollToToday = () => {
      const el = scrollRef.current;
      if (!el) return;
      if (todayLeft !== null) {
        el.scrollLeft = Math.max(
          0,
          TIMELINE_EDGE_PADDING + todayLeft - el.clientWidth * 0.2
        );
      }
      el.scrollTop = 0;
    };

    requestAnimationFrame(scrollToToday);
    const t = window.setTimeout(scrollToToday, 150);
    return () => window.clearTimeout(t);
  }, [presentationMode, todayLeft, timelineWidth, laneRows.length]);

  const bodyHeight =
    MILESTONE_ROW_HEIGHT + laneRows.reduce((sum, row) => sum + row.rowHeight, 0);

  const addTaskToLane = (laneId: string, color: string) => {
    const mid = new Date(timelineStart);
    mid.setMonth(mid.getMonth() + 1);
    const end = new Date(mid);
    end.setMonth(end.getMonth() + 1);
    addTask(roadmap.id, {
      title: "New Task",
      startDate: toISODate(mid),
      endDate: toISODate(end),
      color,
      laneId,
      tags: [],
      links: [],
      attachments: [],
      priority: "medium",
      status: "todo",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ type: "spring", stiffness: 200, damping: 26, mass: 0.8 }}
      className={`relative surface-card border-border/60 flex flex-col min-h-0 ${
        presentationMode ? "h-full flex-1" : "overflow-hidden"
      }`}
      style={{
        height: canvasHeight,
        ["--timeline-header-height" as string]: `${TIMELINE_HEADER_HEIGHT}px`,
        ["--milestone-row-height" as string]: `${MILESTONE_ROW_HEIGHT}px`,
      }}
    >
      {/* Header row — lane corner stays fixed, dates scroll horizontally */}
      <div className="flex shrink-0 border-b border-border/60 bg-white shadow-sm z-30">
        <GanttLaneHeaderCorner />
        <div ref={headerScrollRef} className="flex-1 overflow-hidden">
          <div
            style={{
              width: scrollContentWidth,
              minWidth: scrollContentWidth,
              paddingLeft: TIMELINE_EDGE_PADDING,
              paddingRight: TIMELINE_EDGE_PADDING,
            }}
          >
            <GanttTimelineHeader columns={columns} timelineWidth={timelineWidth} />
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Lane labels — fixed width, vertical scroll synced with timeline body */}
        <div
          ref={lanePanelRef}
          className="gantt-scroll shrink-0 overflow-y-auto overflow-x-hidden border-r border-border/60 bg-white z-20"
          style={{ width: LANE_HEADER_WIDTH }}
          onScroll={() => syncVerticalScroll("lane")}
        >
          <GanttMilestoneLaneLabel />
          {laneRows.map(({ lane, index, rowHeight }) => (
            <GanttLaneLabel
              key={lane.id}
              roadmapId={roadmap.id}
              lane={lane}
              rowHeight={rowHeight}
              isFirst={index === 0}
              isLast={index === laneRows.length - 1}
              isLocked={isLocked}
              isCollapsed={lane.collapsed}
              laneIndex={index}
              onToggleCollapse={() =>
                updateSwimLane(roadmap.id, lane.id, { collapsed: !lane.collapsed })
              }
              onAddTask={() => addTaskToLane(lane.id, lane.color)}
            />
          ))}
        </div>

        {/* Timeline body — horizontal + vertical scroll */}
        <div
          ref={scrollRef}
          id="gantt-body-scroll"
          className="gantt-scroll flex-1 overflow-auto bg-white/40 min-w-0"
          onScroll={() => {
            syncVerticalScroll("body");
            syncHorizontalScroll();
          }}
        >
          <div
            ref={timelineRef}
            style={{ width: scrollContentWidth, minWidth: scrollContentWidth }}
          >
            <div
              className="relative"
              style={{
                minHeight: bodyHeight,
                paddingLeft: TIMELINE_EDGE_PADDING,
                paddingRight: TIMELINE_EDGE_PADDING,
              }}
            >
              {todayLeft !== null && (
                <div className="today-line" style={{ left: todayLeft, height: bodyHeight }} />
              )}
              <div
                className="absolute top-0 flex pointer-events-none"
                style={{ height: bodyHeight }}
              >
                {columns.map((col) => (
                  <div
                    key={col.key}
                    className="border-r border-dashed border-border/25 h-full shrink-0"
                    style={{ width: col.width }}
                  />
                ))}
              </div>

              <div
                className="relative border-b border-border/40 bg-slate-50/60"
                style={{ height: MILESTONE_ROW_HEIGHT }}
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

              {laneRows.map(({ lane, contentHeight, rowHeight, index }) => (
                <GanttLaneTimeline
                  key={lane.id}
                  lane={lane}
                  tasks={roadmap.tasks}
                  timelineWidth={timelineWidth}
                  rowHeight={rowHeight}
                  contentHeight={contentHeight}
                  getTaskRect={getRect}
                  isLocked={isLocked}
                  selectedTaskId={selectedTaskId}
                  onSelectTask={setSelectedTaskId}
                  onDragStart={handleDragStart}
                  onLaneDragOver={setDragTargetLane}
                  isDragTarget={dragTargetLane === lane.id}
                  presentationMode={presentationMode}
                  laneIndex={index}
                />
              ))}
            </div>
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
    </motion.div>
  );
}
