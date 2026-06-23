"use client";

import { useEffect } from "react";
import { useRoadmapStore } from "@/lib/stores/roadmap-store";

export function Providers({ children }: { children: React.ReactNode }) {
  const loadFromServer = useRoadmapStore((s) => s.loadFromServer);
  const isLoading = useRoadmapStore((s) => s.isLoading);

  useEffect(() => {
    loadFromServer();
  }, [loadFromServer]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 rounded-xl clay-button mx-auto animate-pulse" />
          <p className="text-sm text-muted-foreground">Loading your roadmaps…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
