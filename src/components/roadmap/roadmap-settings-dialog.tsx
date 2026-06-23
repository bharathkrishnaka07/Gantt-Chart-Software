"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, History, Copy } from "lucide-react";
import type { Roadmap } from "@/types/roadmap";
import { useRoadmapStore } from "@/lib/stores/roadmap-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
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

interface RoadmapSettingsDialogProps {
  roadmap: Roadmap;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoadmapSettingsDialog({
  roadmap,
  open,
  onOpenChange,
}: RoadmapSettingsDialogProps) {
  const router = useRouter();
  const {
    updateRoadmap,
    deleteRoadmap,
    duplicateRoadmapById,
    restoreVersion,
    getVersionsForRoadmap,
  } = useRoadmapStore();

  const [title, setTitle] = useState(roadmap.title);
  const [description, setDescription] = useState(roadmap.description ?? "");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [restoreId, setRestoreId] = useState<string | null>(null);

  const versions = getVersionsForRoadmap(roadmap.id);

  const handleSave = () => {
    updateRoadmap(roadmap.id, { title, description: description || undefined });
    onOpenChange(false);
  };

  const handleDelete = () => {
    deleteRoadmap(roadmap.id);
    setDeleteOpen(false);
    onOpenChange(false);
    router.push("/");
  };

  const handleRestore = () => {
    if (restoreId) {
      restoreVersion(restoreId);
      setRestoreId(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Roadmap Settings</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={roadmap.isLocked}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description..."
                disabled={roadmap.isLocked}
              />
            </div>

            {!roadmap.isLocked && (
              <Button onClick={handleSave} className="w-full">
                Save Changes
              </Button>
            )}

            {roadmap.isLocked && (
              <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                🔒 Unlock this roadmap to edit title and description.
              </p>
            )}

            <div className="border-t border-border pt-4 space-y-2">
              <Label className="flex items-center gap-2">
                <History className="h-4 w-4" /> Version History
              </Label>
              {versions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No saved versions yet</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {versions.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50 text-sm"
                    >
                      <div>
                        <p className="font-medium">{v.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(v.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!roadmap.isLocked && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setRestoreId(v.id)}
                        >
                          Restore
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-border pt-4 flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  duplicateRoadmapById(roadmap.id);
                  onOpenChange(false);
                }}
              >
                <Copy className="h-4 w-4" /> Duplicate
              </Button>
              {!roadmap.isLocked && (
                <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
                  <Trash2 className="h-4 w-4" /> Delete Roadmap
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{roadmap.title}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the roadmap, all tasks, milestones, and saved versions. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-[var(--color-danger)] text-white hover:opacity-90"
            >
              Delete Forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!restoreId} onOpenChange={() => setRestoreId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore this version?</AlertDialogTitle>
            <AlertDialogDescription>
              Current changes will be replaced with the selected snapshot.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestore}>Restore Version</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
