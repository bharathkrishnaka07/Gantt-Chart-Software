"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  Lock,
  Unlock,
  ExternalLink,
} from "lucide-react";
import type { Roadmap } from "@/types/roadmap";
import { useRoadmapStore } from "@/lib/stores/roadmap-store";
import { Button } from "@/components/ui/button";
import { LockBadge } from "@/components/ui/lock-indicator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { RoadmapSettingsDialog } from "@/components/roadmap/roadmap-settings-dialog";
import { formatDateRange } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface RoadmapCardProps {
  roadmap: Roadmap;
  isActive?: boolean;
}

export function RoadmapCard({ roadmap, isActive }: RoadmapCardProps) {
  const router = useRouter();
  const { setActiveRoadmap, duplicateRoadmapById, deleteRoadmap, toggleLock } =
    useRoadmapStore();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const doneCount = roadmap.tasks.filter((t) => t.status === "done").length;
  const progress = roadmap.tasks.length
    ? Math.round((doneCount / roadmap.tasks.length) * 100)
    : 0;
  const accent = roadmap.swimLanes[0]?.color ?? "#2563eb";

  return (
    <>
      <div
        className={cn(
          "h-full rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md",
          isActive && "ring-2 ring-primary/25 border-primary/30"
        )}
      >
        <div
          className="h-1 rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, ${accent}, ${accent}88)` }}
        />
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-3">
            <Link
              href={`/roadmap/${roadmap.id}`}
              className="flex-1 min-w-0 group/link"
              onClick={() => setActiveRoadmap(roadmap.id)}
            >
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm text-foreground truncate group-hover/link:text-primary transition-colors">
                  {roadmap.title}
                </h3>
                {roadmap.isLocked && <LockBadge showLabel={false} />}
              </div>
              <p className="text-xs text-slate-600">
                {formatDateRange(new Date(roadmap.startDate), new Date(roadmap.endDate))}
              </p>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreHorizontal className="h-4 w-4 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/roadmap/${roadmap.id}`} onClick={() => setActiveRoadmap(roadmap.id)}>
                    <ExternalLink className="h-4 w-4 mr-2" /> Open
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                  <Pencil className="h-4 w-4 mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => duplicateRoadmapById(roadmap.id)}>
                  <Copy className="h-4 w-4 mr-2" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleLock(roadmap.id)}>
                  {roadmap.isLocked ? (
                    <><Unlock className="h-4 w-4 mr-2" /> Unlock</>
                  ) : (
                    <><Lock className="h-4 w-4 mr-2" /> Lock</>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-danger focus:text-danger" onClick={() => setDeleteOpen(true)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            <Badge variant="secondary" className="text-[10px] font-normal bg-slate-100 text-slate-700">
              {roadmap.swimLanes.length} lanes
            </Badge>
            <Badge variant="secondary" className="text-[10px] font-normal bg-slate-100 text-slate-700">
              {roadmap.tasks.length} tasks
            </Badge>
            <Badge variant="secondary" className="text-[10px] font-normal bg-slate-100 text-slate-700">
              {progress}% done
            </Badge>
          </div>

          <Progress value={progress} className="h-1.5" />
        </div>
      </div>

      <RoadmapSettingsDialog roadmap={roadmap} open={settingsOpen} onOpenChange={setSettingsOpen} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{roadmap.title}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the roadmap from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { deleteRoadmap(roadmap.id); router.push("/"); }}
              className="bg-[var(--color-danger)] text-white hover:opacity-90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
