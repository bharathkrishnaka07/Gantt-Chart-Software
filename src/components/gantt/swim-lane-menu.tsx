"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Palette,
} from "lucide-react";
import type { SwimLane as SwimLaneType } from "@/types/roadmap";
import { useRoadmapStore } from "@/lib/stores/roadmap-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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

const LANE_COLORS = ["#2563EB", "#14B8A6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

interface SwimLaneMenuProps {
  roadmapId: string;
  lane: SwimLaneType;
  isLocked: boolean;
  isFirst: boolean;
  isLast: boolean;
}

export function SwimLaneMenu({
  roadmapId,
  lane,
  isLocked,
  isFirst,
  isLast,
}: SwimLaneMenuProps) {
  const { updateSwimLane, deleteSwimLane, moveSwimLane } = useRoadmapStore();
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [name, setName] = useState(lane.name);

  if (isLocked) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => { setName(lane.name); setRenameOpen(true); }}>
            <Pencil className="h-4 w-4 mr-2" /> Rename
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Palette className="h-4 w-4 mr-2" /> Change Color
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {LANE_COLORS.map((color) => (
                <DropdownMenuItem
                  key={color}
                  onClick={() => updateSwimLane(roadmapId, lane.id, { color })}
                >
                  <div className="h-4 w-4 rounded-full mr-2" style={{ backgroundColor: color }} />
                  {color}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          {!isFirst && (
            <DropdownMenuItem onClick={() => moveSwimLane(roadmapId, lane.id, "up")}>
              <ChevronUp className="h-4 w-4 mr-2" /> Move Up
            </DropdownMenuItem>
          )}
          {!isLast && (
            <DropdownMenuItem onClick={() => moveSwimLane(roadmapId, lane.id, "down")}>
              <ChevronDown className="h-4 w-4 mr-2" /> Move Down
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-danger focus:text-danger"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" /> Delete Lane
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={renameOpen} onOpenChange={setRenameOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rename Swim Lane</AlertDialogTitle>
          </AlertDialogHeader>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="my-2"
            autoFocus
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => updateSwimLane(roadmapId, lane.id, { name })}
            >
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{lane.name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              All tasks in this lane will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteSwimLane(roadmapId, lane.id)}
              className="bg-[var(--color-danger)] text-white hover:opacity-90"
            >
              Delete Lane
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
