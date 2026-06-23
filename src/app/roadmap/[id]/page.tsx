"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useRoadmapStore } from "@/lib/stores/roadmap-store";
import { GanttChart } from "@/components/gantt/gantt-chart";
import { GanttToolbar } from "@/components/gantt/gantt-toolbar";
import { TaskDetailPanel } from "@/components/roadmap/task-detail-panel";
import { PresentationMode } from "@/components/roadmap/presentation-mode";
import { MobileRoadmapView } from "@/components/roadmap/mobile-roadmap-view";
import { MilestoneDetailPanel } from "@/components/roadmap/milestone-detail-panel";

export default function RoadmapPage() {
  const params = useParams();
  const id = params.id as string;
  const { roadmaps, setActiveRoadmap, mobileTimelineView } = useRoadmapStore();

  const roadmap = roadmaps.find((r) => r.id === id);

  useEffect(() => {
    if (id) setActiveRoadmap(id);
  }, [id, setActiveRoadmap]);

  if (!roadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Roadmap not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[100vw] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <GanttToolbar roadmap={roadmap} />

        {/* Desktop Gantt */}
        <div className={`${mobileTimelineView ? "block" : "hidden md:block"}`}>
          <GanttChart roadmap={roadmap} />
        </div>

        {/* Mobile card view */}
        {!mobileTimelineView && <MobileRoadmapView roadmap={roadmap} />}

        <TaskDetailPanel roadmap={roadmap} />
        <MilestoneDetailPanel roadmap={roadmap} />
        <PresentationMode roadmap={roadmap} />
      </div>
    </div>
  );
}
