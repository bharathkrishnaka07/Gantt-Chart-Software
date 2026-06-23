"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Trash2, Copy, Tag } from "lucide-react";
import { useRoadmapStore } from "@/lib/stores/roadmap-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TipTapEditor } from "@/components/editor/tiptap-editor";
import type { Roadmap } from "@/types/roadmap";

interface TaskDetailPanelProps {
  roadmap: Roadmap;
}

export function TaskDetailPanel({ roadmap }: TaskDetailPanelProps) {
  const { selectedTaskId, setSelectedTaskId, updateTask, deleteTask, duplicateTask } =
    useRoadmapStore();

  const task = roadmap.tasks.find((t) => t.id === selectedTaskId);
  const isLocked = roadmap.isLocked;

  return (
    <AnimatePresence>
      {task && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setSelectedTaskId(null)}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md surface-card rounded-none border-l border-border/60 shadow-2xl overflow-y-auto"
          >
            <div className="sticky top-0 glass-bar border-b border-border/60 p-4 flex items-center justify-between">
              <h2 className="font-semibold text-lg truncate">{task.title}</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedTaskId(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 space-y-4">
              <Tabs defaultValue="overview">
                <TabsList className="w-full">
                  <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                  <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
                  <TabsTrigger value="attachments" className="flex-1">Files</TabsTrigger>
                  <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={task.title}
                      disabled={isLocked}
                      onChange={(e) => updateTask(roadmap.id, task.id, { title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={task.description ?? ""}
                      disabled={isLocked}
                      placeholder="Add a description..."
                      onChange={(e) =>
                        updateTask(roadmap.id, task.id, { description: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={task.startDate.slice(0, 10)}
                        disabled={isLocked}
                        onChange={(e) =>
                          updateTask(roadmap.id, task.id, {
                            startDate: new Date(e.target.value).toISOString(),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={task.endDate.slice(0, 10)}
                        disabled={isLocked}
                        onChange={(e) =>
                          updateTask(roadmap.id, task.id, {
                            endDate: new Date(e.target.value).toISOString(),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <div className="flex gap-2">
                      {(["low", "medium", "high"] as const).map((priority) => (
                        <Button
                          key={priority}
                          variant={task.priority === priority ? "default" : "secondary"}
                          size="sm"
                          disabled={isLocked}
                          onClick={() => updateTask(roadmap.id, task.id, { priority })}
                        >
                          {priority}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Tags (comma separated)</Label>
                    <Input
                      value={task.tags.join(", ")}
                      disabled={isLocked}
                      placeholder="mentorship, certification"
                      onChange={(e) =>
                        updateTask(roadmap.id, task.id, {
                          tags: e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="flex gap-2">
                      {(["todo", "in_progress", "done"] as const).map((status) => (
                        <Button
                          key={status}
                          variant={task.status === status ? "default" : "secondary"}
                          size="sm"
                          disabled={isLocked}
                          onClick={() => updateTask(roadmap.id, task.id, { status })}
                        >
                          {status.replace("_", " ")}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex gap-2">
                      {["#2563EB", "#14B8A6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"].map(
                        (color) => (
                          <button
                            key={color}
                            disabled={isLocked}
                            className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                              task.color === color ? "border-foreground scale-110" : "border-transparent"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => updateTask(roadmap.id, task.id, { color })}
                          />
                        )
                      )}
                    </div>
                  </div>
                  {task.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      {task.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-muted px-2 py-1 rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {!isLocked && (
                    <div className="flex gap-2 pt-4 border-t border-border">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => duplicateTask(roadmap.id, task.id)}
                      >
                        <Copy className="h-4 w-4" /> Duplicate
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          deleteTask(roadmap.id, task.id);
                          setSelectedTaskId(null);
                        }}
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="notes" className="mt-4">
                  <TipTapEditor
                    content={
                      task.notes ??
                      `<p><strong>Meeting with Oliver</strong></p><p>Discussed transition into project management.</p><ul><li>Need to investigate PMI certification pathways.</li><li>Review PM job advertisements before August.</li></ul>`
                    }
                    editable={!isLocked}
                    onChange={(content) => updateTask(roadmap.id, task.id, { notes: content })}
                  />
                </TabsContent>

                <TabsContent value="attachments" className="mt-4">
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-sm">No attachments yet</p>
                    <p className="text-xs mt-1">Drag files here or click to upload</p>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="mt-4 space-y-3">
                  {task.activity.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No activity yet</p>
                  ) : (
                    task.activity.map((entry) => (
                      <div key={entry.id} className="flex gap-3 text-sm">
                        <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                        <div>
                          <p className="font-medium">{entry.action}</p>
                          {entry.details && (
                            <p className="text-muted-foreground">{entry.details}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
