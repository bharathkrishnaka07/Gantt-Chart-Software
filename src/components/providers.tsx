"use client";

import { useEffect } from "react";
import { useRoadmapStore } from "@/lib/stores/roadmap-store";

export function Providers({ children }: { children: React.ReactNode }) {
  const initialize = useRoadmapStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
