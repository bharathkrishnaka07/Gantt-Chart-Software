"use client";

import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import { Toaster, toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/layout/app-shell";
import { useRoadmapStore } from "@/lib/stores/roadmap-store";
import { setSyncStatusListener } from "@/lib/sync-client";
import { DashboardSkeleton } from "@/components/layout/loading-skeleton";

export function Providers({ children }: { children: React.ReactNode }) {
  const loadFromServer = useRoadmapStore((s) => s.loadFromServer);
  const isLoading = useRoadmapStore((s) => s.isLoading);
  const loadError = useRoadmapStore((s) => s.loadError);
  const setSyncStatus = useRoadmapStore((s) => s.setSyncStatus);

  useEffect(() => {
    loadFromServer();
  }, [loadFromServer]);

  useEffect(() => {
    setSyncStatusListener((status) => {
      setSyncStatus(status);
      if (status === "error") {
        toast.error("Failed to save to database. Retrying…");
      }
    });
    return () => setSyncStatusListener(null);
  }, [setSyncStatus]);

  useEffect(() => {
    if (loadError) {
      toast.error(loadError);
    }
  }, [loadError]);

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={200}>
        <Toaster position="bottom-right" richColors closeButton />
        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <AppShell>{children}</AppShell>
        )}
      </TooltipProvider>
    </MotionConfig>
  );
}
