"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Plus,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useRoadmapStore } from "@/lib/stores/roadmap-store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SyncIndicator } from "@/components/layout/sync-indicator";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { roadmaps, activeRoadmapId, createRoadmap, syncStatus } = useRoadmapStore();
  const isDashboard = pathname === "/";

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border/60 bg-card/50 backdrop-blur-xl shrink-0">
        <div className="p-5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm tracking-tight group-hover:text-primary transition-colors">
                Roadmap Planner
              </p>
              <p className="text-[11px] text-muted-foreground">Career planning</p>
            </div>
          </Link>
        </div>

        <Separator className="opacity-60" />

        <div className="p-3 space-y-1">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              isDashboard
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 h-10 text-muted-foreground hover:text-foreground"
            onClick={() => createRoadmap("New Career Roadmap")}
          >
            <Plus className="h-4 w-4" />
            New Roadmap
          </Button>
        </div>

        <Separator className="opacity-60 mx-3" />

        <div className="px-5 pt-4 pb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Your Roadmaps
          </p>
        </div>

        <ScrollArea className="flex-1 px-3">
          <div className="space-y-0.5 pb-4">
            {roadmaps.length === 0 ? (
              <p className="px-3 py-2 text-xs text-muted-foreground">No roadmaps yet</p>
            ) : (
              roadmaps.map((roadmap) => {
                const isActive = pathname === `/roadmap/${roadmap.id}`;
                const isCurrent = roadmap.id === activeRoadmapId;
                return (
                  <Link
                    key={roadmap.id}
                    href={`/roadmap/${roadmap.id}`}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all group",
                      isActive
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <Map className={cn("h-3.5 w-3.5 shrink-0", isActive && "text-primary")} />
                    <span className="truncate flex-1">{roadmap.title}</span>
                    {roadmap.isLocked && <span className="text-[10px]">🔒</span>}
                    {isCurrent && !isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    )}
                    <ChevronRight
                      className={cn(
                        "h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all",
                        isActive && "opacity-100 translate-x-0"
                      )}
                    />
                  </Link>
                );
              })
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border/60">
          <SyncIndicator status={syncStatus} compact />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-40 border-b border-border/60 bg-card/80 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm">Roadmap Planner</span>
          </Link>
          <SyncIndicator status={syncStatus} />
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
