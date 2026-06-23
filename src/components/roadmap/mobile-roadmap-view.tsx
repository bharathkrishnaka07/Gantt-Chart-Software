"use client";

import { motion } from "motion/react";
import { GripVertical, FileText, Monitor, Trash2, Plus } from "lucide-react";
import type { Roadmap } from "@/types/roadmap";
import { useRoadmapStore } from "@/lib/stores/roadmap-store";
import { Button } from "@/components/ui/button";
import { formatDateRange } from "@/lib/utils";
import { toISODate } from "@/lib/timeline";

interface MobileRoadmapViewProps {
  roadmap: Roadmap;
}

export function MobileRoadmapView({ roadmap }: MobileRoadmapViewProps) {
  const {
    setSelectedTaskId,
    setMobileTimelineView,
    deleteTask,
    addTask,
    addSwimLane,
    deleteSwimLane,
  } = useRoadmapStore();
  const sortedLanes = [...roadmap.swimLanes].sort((a, b) => a.order - b.order);
  const isLocked = roadmap.isLocked;

  return (
    <div className="space-y-4 md:hidden">
      <div className="flex gap-2">
        <Button
          className="flex-1"
          variant="secondary"
          onClick={() => setMobileTimelineView(true)}
        >
          <Monitor className="h-4 w-4" />
          Open Timeline View
        </Button>
        {!isLocked && (
          <Button
            variant="secondary"
            size="icon"
            onClick={() => addSwimLane(roadmap.id, `S${roadmap.swimLanes.length + 1}: New Lane`)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {sortedLanes.map((lane, laneIndex) => {
        const laneTasks = roadmap.tasks.filter((t) => t.laneId === lane.id);

        return (
          <motion.div
            key={lane.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: laneIndex * 0.05 }}
            className="clay-card p-4"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: lane.color }}
                />
                <h3 className="font-semibold text-sm truncate">{lane.name}</h3>
              </div>
              {!isLocked && sortedLanes.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-danger"
                  onClick={() => deleteSwimLane(roadmap.id, lane.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            {laneTasks.length === 0 ? (
              <p className="text-xs text-muted-foreground mb-2">No tasks in this lane</p>
            ) : (
              <div className="space-y-2">
                {laneTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 p-3 rounded-xl bg-muted/50"
                  >
                    <button
                      onClick={() => setSelectedTaskId(task.id)}
                      className="flex-1 flex items-center gap-3 text-left min-w-0"
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                      <div
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: task.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateRange(new Date(task.startDate), new Date(task.endDate))}
                        </p>
                      </div>
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    </button>
                    {!isLocked && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => deleteTask(roadmap.id, task.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!isLocked && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2"
                onClick={() => {
                  const start = new Date(roadmap.startDate);
                  const end = new Date(start);
                  end.setMonth(end.getMonth() + 1);
                  addTask(roadmap.id, {
                    title: "New Task",
                    startDate: toISODate(start),
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
              >
                <Plus className="h-4 w-4" /> Add Task
              </Button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
