"use client";

import { useState } from "react";
import { CalendarRange } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";

interface TimelineSettingsProps {
  roadmap: Roadmap;
}

export function TimelineSettings({ roadmap }: TimelineSettingsProps) {
  const { setTimelineRange } = useRoadmapStore();
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState(roadmap.startDate.slice(0, 10));
  const [end, setEnd] = useState(roadmap.endDate.slice(0, 10));

  const handleSave = () => {
    setTimelineRange(
      roadmap.id,
      new Date(start).toISOString(),
      new Date(end).toISOString()
    );
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" disabled={roadmap.isLocked}>
          <CalendarRange className="h-4 w-4" />
          Timeline
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Timeline Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
          <Button onClick={handleSave} className="w-full">
            Apply Timeline Range
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
