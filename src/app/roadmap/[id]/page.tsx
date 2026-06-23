"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRoadmapStore } from "@/lib/stores/roadmap-store";
import { GanttChart } from "@/components/gantt/gantt-chart";
import { GanttToolbar } from "@/components/gantt/gantt-toolbar";
import { TaskDetailPanel } from "@/components/roadmap/task-detail-panel";
import { PresentationMode } from "@/components/roadmap/presentation-mode";
import { MobileRoadmapView } from "@/components/roadmap/mobile-roadmap-view";
import { MilestoneDetailPanel } from "@/components/roadmap/milestone-detail-panel";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RoadmapPage() {
  const params = useParams();
  const id = params.id as string;
  const { roadmaps, setActiveRoadmap, mobileTimelineView } = useRoadmapStore();
  const [mounted, setMounted] = useState(false);

  const roadmap = roadmaps.find((r) => r.id === id);

  useEffect(() => {
    setMounted(true);
    if (id) setActiveRoadmap(id);
  }, [id, setActiveRoadmap]);

  if (!mounted) return null;

  if (!roadmap) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-slate-600">Roadmap not found</p>
        <Button asChild>
          <Link href="/">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mesh-bg min-h-full flex flex-col">
      <div className="flex-1 w-full mx-auto px-2 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-3 min-h-0">
        <GanttToolbar roadmap={roadmap} />

        <div className={`flex-1 min-h-0 ${mobileTimelineView ? "block" : "hidden md:block"}`}>
          <GanttChart roadmap={roadmap} />
        </div>

        {!mobileTimelineView && <MobileRoadmapView roadmap={roadmap} />}

        <TaskDetailPanel roadmap={roadmap} />
        <MilestoneDetailPanel roadmap={roadmap} />
        <PresentationMode roadmap={roadmap} />
      </div>
    </div>
  );
}
