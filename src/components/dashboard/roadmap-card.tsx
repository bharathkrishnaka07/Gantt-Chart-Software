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
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  const handleDelete = () => {
    deleteRoadmap(roadmap.id);
    setDeleteOpen(false);
  };

  return (
    <>
      <Card
        className={`clay-card-hover h-full relative group ${isActive ? "ring-2 ring-primary/30" : ""}`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/roadmap/${roadmap.id}`}
              className="flex-1 min-w-0"
              onClick={() => setActiveRoadmap(roadmap.id)}
            >
              <CardTitle className="text-base group-hover:text-primary transition-colors truncate">
                {roadmap.title}
                {roadmap.isLocked && <span className="ml-1">🔒</span>}
              </CardTitle>
              <CardDescription className="mt-1">
                {formatDateRange(new Date(roadmap.startDate), new Date(roadmap.endDate))}
              </CardDescription>
              <CardDescription className="mt-1">
                {roadmap.tasks.length} tasks · {roadmap.milestones.length} milestones ·{" "}
                {roadmap.swimLanes.length} lanes
              </CardDescription>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
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
                  <Pencil className="h-4 w-4 mr-2" /> Edit Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => duplicateRoadmapById(roadmap.id)}>
                  <Copy className="h-4 w-4 mr-2" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleLock(roadmap.id)}>
                  {roadmap.isLocked ? (
                    <>
                      <Unlock className="h-4 w-4 mr-2" /> Unlock
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" /> Lock
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-danger focus:text-danger"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
      </Card>

      <RoadmapSettingsDialog
        roadmap={roadmap}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />

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
            <AlertDialogAction
              onClick={() => {
                handleDelete();
                router.push("/");
              }}
              className="bg-danger hover:opacity-90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
