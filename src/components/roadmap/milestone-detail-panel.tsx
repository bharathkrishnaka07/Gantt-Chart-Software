"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Trash2, Calendar } from "lucide-react";
import { useRoadmapStore } from "@/lib/stores/roadmap-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatShortDate } from "@/lib/utils";
import type { Roadmap } from "@/types/roadmap";

interface MilestoneDetailPanelProps {
  roadmap: Roadmap;
}

export function MilestoneDetailPanel({ roadmap }: MilestoneDetailPanelProps) {
  const {
    selectedMilestoneId,
    setSelectedMilestoneId,
    updateMilestone,
    deleteMilestone,
  } = useRoadmapStore();

  const milestone = roadmap.milestones.find((m) => m.id === selectedMilestoneId);
  const isLocked = roadmap.isLocked;

  return (
    <AnimatePresence>
      {milestone && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setSelectedMilestoneId(null)}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white rounded-none border-l border-border shadow-2xl overflow-y-auto"
          >
            <div className="sticky top-0 glass-bar border-b border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="milestone-diamond shrink-0"
                  style={{ backgroundColor: milestone.color }}
                />
                <h2 className="font-semibold">Milestone</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedMilestoneId(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={milestone.title}
                  disabled={isLocked}
                  onChange={(e) =>
                    updateMilestone(roadmap.id, milestone.id, { title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={milestone.date.slice(0, 10)}
                  disabled={isLocked}
                  onChange={(e) =>
                    updateMilestone(roadmap.id, milestone.id, {
                      date: new Date(e.target.value).toISOString(),
                    })
                  }
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatShortDate(new Date(milestone.date))}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Input
                  value={milestone.notes ?? ""}
                  disabled={isLocked}
                  placeholder="Add milestone notes..."
                  onChange={(e) =>
                    updateMilestone(roadmap.id, milestone.id, { notes: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {["#14B8A6", "#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"].map(
                    (color) => (
                      <button
                        key={color}
                        disabled={isLocked}
                        className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                          milestone.color === color ? "border-foreground scale-110" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() =>
                          updateMilestone(roadmap.id, milestone.id, { color })
                        }
                      />
                    )
                  )}
                </div>
              </div>

              {!isLocked && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => {
                    deleteMilestone(roadmap.id, milestone.id);
                    setSelectedMilestoneId(null);
                  }}
                >
                  <Trash2 className="h-4 w-4" /> Delete Milestone
                </Button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
