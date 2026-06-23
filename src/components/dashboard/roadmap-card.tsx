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
import { Badge } from "@/components/ui/badge";
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
import { AnimatedProgress } from "@/components/motion/animated-progress";
import { TiltCard } from "@/components/motion/tilt-card";
import { GlowBorder } from "@/components/motion/glow-border";
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

  return (
    <>
      <TiltCard intensity={14} className="h-full">
        <GlowBorder
          className="h-full opacity-40 group-hover:opacity-100 transition-opacity duration-500"
          innerClassName={cn(
            "surface-card h-full group",
            isActive && "ring-2 ring-primary/25"
          )}
        >
          <div className="p-5 h-full">
          <div className="flex items-start justify-between gap-2 mb-3">
            <Link
              href={`/roadmap/${roadmap.id}`}
              className="flex-1 min-w-0"
              onClick={() => setActiveRoadmap(roadmap.id)}
            >
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                  {roadmap.title}
                </h3>
                {roadmap.isLocked && (
                  <Badge variant="secondary" className="text-[10px] shrink-0">🔒</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDateRange(new Date(roadmap.startDate), new Date(roadmap.endDate))}
              </p>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-60 group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
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

          <div className="flex flex-wrap gap-1.5 mb-3">
            <Badge variant="outline" className="text-[10px] font-normal">
              {roadmap.swimLanes.length} lanes
            </Badge>
            <Badge variant="outline" className="text-[10px] font-normal">
              {roadmap.tasks.length} tasks
            </Badge>
            <Badge variant="outline" className="text-[10px] font-normal">
              {progress}% done
            </Badge>
          </div>

          <AnimatedProgress value={progress} className="h-1.5" delay={0.3} />
          </div>
        </GlowBorder>
      </TiltCard>

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
