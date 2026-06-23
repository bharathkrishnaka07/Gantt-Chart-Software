"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import type { Roadmap } from "@/types/roadmap";
import { useRoadmapStore } from "@/lib/stores/roadmap-store";
import { GanttChart } from "@/components/gantt/gantt-chart";
import { Button } from "@/components/ui/button";
import { formatDateRange } from "@/lib/utils";

interface PresentationModeProps {
  roadmap: Roadmap;
}

export function PresentationMode({ roadmap }: PresentationModeProps) {
  const { presentationMode, setPresentationMode } = useRoadmapStore();

  useEffect(() => {
    if (!presentationMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPresentationMode(false);
      }
      if (e.key === "ArrowRight") {
        document.querySelector(".gantt-scroll")?.scrollBy({ left: 200, behavior: "smooth" });
      }
      if (e.key === "ArrowLeft") {
        document.querySelector(".gantt-scroll")?.scrollBy({ left: -200, behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [presentationMode, setPresentationMode]);

  if (!presentationMode) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="presentation-mode flex flex-col p-6 md:p-10"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 text-center">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            {roadmap.title}
          </motion.h1>
          <p className="text-muted-foreground mt-2">
            {formatDateRange(new Date(roadmap.startDate), new Date(roadmap.endDate))}
          </p>
        </div>
        <Button
          variant="secondary"
          size="icon"
          className="shrink-0 clay-glass"
          onClick={() => setPresentationMode(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <GanttChart roadmap={roadmap} readOnly />
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        ← → Navigate timeline · Esc to exit
      </p>
    </motion.div>
  );
}
