"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Monitor } from "lucide-react";
import type { Roadmap } from "@/types/roadmap";
import { useRoadmapStore } from "@/lib/stores/roadmap-store";
import { GanttChart } from "@/components/gantt/gantt-chart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateRange } from "@/lib/utils";

interface PresentationModeProps {
  roadmap: Roadmap;
}

async function enterFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
  } catch {
    /* overlay still works without native fullscreen */
  }
}

async function exitFullscreen() {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  } catch {
    /* ignore */
  }
}

export function PresentationMode({ roadmap }: PresentationModeProps) {
  const { presentationMode, setPresentationMode } = useRoadmapStore();

  useEffect(() => {
    if (!presentationMode) return;

    void enterFullscreen();

    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setPresentationMode(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        void exitFullscreen();
        setPresentationMode(false);
      }
      if (e.key === "ArrowRight") {
        document
          .getElementById("gantt-body-scroll")
          ?.scrollBy({ left: 240, behavior: "smooth" });
      }
      if (e.key === "ArrowLeft") {
        document
          .getElementById("gantt-body-scroll")
          ?.scrollBy({ left: -240, behavior: "smooth" });
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      window.removeEventListener("keydown", onKeyDown);
      void exitFullscreen();
    };
  }, [presentationMode, setPresentationMode]);

  const handleExit = async () => {
    await exitFullscreen();
    setPresentationMode(false);
  };

  return (
    <AnimatePresence>
      {presentationMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="presentation-mode flex flex-col bg-[#f0f2f5]"
        >
          <div className="flex items-center justify-between gap-4 px-6 sm:px-10 py-4 border-b border-border bg-white shrink-0">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-[10px] bg-white">
                  <Monitor className="h-3 w-3 mr-1" />
                  Presentation
                </Badge>
                <span className="text-xs text-slate-600">
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                {roadmap.title}
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                {formatDateRange(new Date(roadmap.startDate), new Date(roadmap.endDate))}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-white shrink-0"
              onClick={() => void handleExit()}
            >
              <X className="h-4 w-4" />
              Exit
            </Button>
          </div>

          <div className="flex-1 min-h-0 flex flex-col px-3 sm:px-6 py-3">
            <GanttChart roadmap={roadmap} readOnly presentationMode />
          </div>

          <p className="text-center text-xs text-slate-500 py-3 shrink-0 bg-white border-t border-border">
            Arrow keys scroll timeline · Esc or Exit to leave fullscreen
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
