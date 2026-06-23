"use client";

import {
  Lock,
  Unlock,
  Presentation,
  ZoomIn,
  Layers,
  Flag,
  Save,
  ChevronLeft,
  Settings,
  Copy,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import type { Roadmap, ZoomLevel } from "@/types/roadmap";
import { useRoadmapStore } from "@/lib/stores/roadmap-store";
import { Button } from "@/components/ui/button";
import { LockBadge } from "@/components/ui/lock-indicator";
import { SyncIndicator } from "@/components/layout/sync-indicator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { TimelineSettings } from "./timeline-settings";
import { RoadmapSettingsDialog } from "@/components/roadmap/roadmap-settings-dialog";
import { springSnappy } from "@/lib/motion/presets";
import { cn } from "@/lib/utils";

const ZOOM_OPTIONS: { value: ZoomLevel; label: string }[] = [
  { value: "year", label: "Year" },
  { value: "quarter", label: "Quarter" },
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
];

interface GanttToolbarProps {
  roadmap: Roadmap;
}

export function GanttToolbar({ roadmap }: GanttToolbarProps) {
  const router = useRouter();
  const {
    setZoomLevel,
    toggleLock,
    setPresentationMode,
    addSwimLane,
    addMilestone,
    saveVersion,
    duplicateRoadmapById,
    deleteRoadmap,
    updateRoadmap,
    syncStatus,
  } = useRoadmapStore();

  const [unlockDialog, setUnlockDialog] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(roadmap.title);

  const handleLockToggle = () => {
    if (roadmap.isLocked) {
      setUnlockDialog(true);
    } else {
      toggleLock(roadmap.id);
    }
  };

  const handleTitleSave = () => {
    if (title.trim()) {
      updateRoadmap(roadmap.id, { title: title.trim() });
    }
    setEditingTitle(false);
  };

  const handleDelete = () => {
    deleteRoadmap(roadmap.id);
    setDeleteOpen(false);
    router.push("/");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springSnappy}
        className="surface-card p-4 sm:p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Link href="/">
              <Button variant="outline" size="icon" className="shrink-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="min-w-0">
              {editingTitle && !roadmap.isLocked ? (
                <input
                  className="text-xl font-bold tracking-tight bg-transparent border-b-2 border-primary outline-none w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-2 flex-wrap">
                  <h1
                    className={`text-xl font-bold tracking-tight truncate ${!roadmap.isLocked ? "cursor-pointer hover:text-primary" : ""}`}
                    onClick={() => !roadmap.isLocked && setEditingTitle(true)}
                  >
                    {roadmap.title}
                  </h1>
                  {roadmap.isLocked && <LockBadge />}
                </div>
              )}
              <div className="flex items-center gap-3 mt-1">
                <p className="text-sm text-muted-foreground">
                  {new Date(roadmap.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  {" – "}
                  {new Date(roadmap.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </p>
                <SyncIndicator status={syncStatus} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
          {/* Zoom — always available */}
          <div className="flex items-center gap-0.5 rounded-xl border border-border/60 bg-muted/50 p-1 shadow-inner">
            <ZoomIn className="h-3.5 w-3.5 text-muted-foreground ml-2 mr-1 shrink-0" />
            {ZOOM_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                variant={roadmap.zoomLevel === opt.value ? "segmentActive" : "segment"}
                size="sm"
                className={cn(
                  "h-7 min-w-[3.25rem] text-xs rounded-lg",
                  roadmap.zoomLevel === opt.value && "shadow-sm"
                )}
                onClick={() => setZoomLevel(roadmap.id, opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>

          {/* Edit actions — hidden when locked */}
          {!roadmap.isLocked && (
            <>
              <TimelineSettings roadmap={roadmap} />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => addSwimLane(roadmap.id, `S${roadmap.swimLanes.length + 1}: New Lane`)}
              >
                <Layers className="h-4 w-4" />
                Lane
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  addMilestone(roadmap.id, {
                    title: "New Milestone",
                    date: new Date().toISOString(),
                    color: "#14B8A6",
                  })
                }
              >
                <Flag className="h-4 w-4" />
                Milestone
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  saveVersion(roadmap.id, `Snapshot ${new Date().toLocaleDateString()}`)
                }
              >
                <Save className="h-4 w-4" />
                Version
              </Button>
            </>
          )}

          {/* Lock toggle — independent of Present */}
          <Button variant="secondary" size="sm" onClick={handleLockToggle}>
            {roadmap.isLocked ? (
              <>
                <Unlock className="h-4 w-4" /> Unlock
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" /> Lock
              </>
            )}
          </Button>

          {/* Present — always available, no lock required */}
          <Button size="sm" onClick={() => setPresentationMode(true)}>
            <Presentation className="h-4 w-4" />
            Present
          </Button>

          {/* More options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                <Settings className="h-4 w-4 mr-2" /> Roadmap Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => duplicateRoadmapById(roadmap.id)}>
                <Copy className="h-4 w-4 mr-2" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-danger focus:text-danger"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete Roadmap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        </div>
      </motion.div>

      <RoadmapSettingsDialog
        roadmap={roadmap}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />

      <Dialog open={unlockDialog} onOpenChange={setUnlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Roadmap?</DialogTitle>
            <DialogDescription>
              This will enable editing, dragging, and deleting. Are you sure?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => setUnlockDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toggleLock(roadmap.id);
                setUnlockDialog(false);
              }}
            >
              Unlock Roadmap
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{roadmap.title}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the roadmap and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-[var(--color-danger)] text-white hover:opacity-90">
              Delete Forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
