"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Map,
  Plus,
  ChevronRight,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
} from "lucide-react";
import { useRoadmapStore } from "@/lib/stores/roadmap-store";
import { useAppUIStore } from "@/store/use-ui-store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SyncIndicator } from "@/components/layout/sync-indicator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AppShellProps {
  children: React.ReactNode;
}

function SidebarTooltip({
  label,
  collapsed,
  children,
}: {
  label: string;
  collapsed: boolean;
  children: React.ReactNode;
}) {
  if (!collapsed) return <>{children}</>;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { roadmaps, activeRoadmapId, createRoadmap, syncStatus, presentationMode } =
    useRoadmapStore();
  const { sidebarCollapsed, toggleSidebar } = useAppUIStore();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isDashboard = pathname === "/";

  if (presentationMode) {
    return <>{children}</>;
  }

  const sidebarContent = (collapsed: boolean, onNavigate?: () => void) => (
    <>
      <div className={cn("flex items-center", collapsed ? "justify-center p-3" : "justify-between p-5")}>
        <Link
          href="/"
          className={cn("flex items-center group", collapsed ? "justify-center" : "gap-3")}
          onClick={onNavigate}
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="font-semibold text-sm tracking-tight group-hover:text-primary transition-colors">
                Roadmap Planner
              </p>
              <p className="text-[11px] text-muted-foreground">Career planning</p>
            </div>
          )}
        </Link>
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground"
            onClick={toggleSidebar}
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator className="opacity-60" />

      <div className={cn("space-y-1", collapsed ? "p-2" : "p-3")}>
        <SidebarTooltip label="Dashboard" collapsed={collapsed}>
          <Link
            href="/"
            onClick={onNavigate}
            className={cn(
              "flex items-center rounded-xl text-sm font-medium transition-all",
              collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
              isDashboard
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            {!collapsed && "Dashboard"}
          </Link>
        </SidebarTooltip>

        <SidebarTooltip label="New Roadmap" collapsed={collapsed}>
          <Button
            variant="ghost"
            className={cn(
              "text-muted-foreground hover:text-foreground",
              collapsed ? "w-full h-10 p-0 justify-center" : "w-full justify-start gap-3 px-3 h-10"
            )}
            onClick={() => {
              createRoadmap("New Career Roadmap");
              onNavigate?.();
            }}
          >
            <Plus className="h-4 w-4 shrink-0" />
            {!collapsed && "New Roadmap"}
          </Button>
        </SidebarTooltip>
      </div>

      <Separator className="opacity-60 mx-3" />

      {!collapsed && (
        <div className="px-5 pt-4 pb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Your Roadmaps
          </p>
        </div>
      )}

      <ScrollArea className={cn("flex-1", collapsed ? "px-2" : "px-3")}>
        <div className="space-y-0.5 pb-4">
          {roadmaps.length === 0 ? (
            !collapsed && (
              <p className="px-3 py-2 text-xs text-muted-foreground">No roadmaps yet</p>
            )
          ) : (
            roadmaps.map((roadmap) => {
              const isActive = pathname === `/roadmap/${roadmap.id}`;
              const isCurrent = roadmap.id === activeRoadmapId;
              return (
                <SidebarTooltip key={roadmap.id} label={roadmap.title} collapsed={collapsed}>
                  <Link
                    href={`/roadmap/${roadmap.id}`}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center rounded-lg text-sm transition-all group",
                      collapsed ? "justify-center p-2.5" : "gap-2 px-3 py-2",
                      isActive
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <Map className={cn("h-3.5 w-3.5 shrink-0", isActive && "text-primary")} />
                    {!collapsed && (
                      <>
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
                      </>
                    )}
                  </Link>
                </SidebarTooltip>
              );
            })
          )}
        </div>
      </ScrollArea>

      <div className={cn("border-t border-border/60", collapsed ? "p-2" : "p-4")}>
        {!collapsed && <SyncIndicator status={syncStatus} compact />}
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 72 : 256 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className="hidden lg:flex flex-col border-r border-border/60 bg-card/80 backdrop-blur-xl shrink-0 overflow-hidden relative"
      >
        {sidebarContent(sidebarCollapsed)}
        {sidebarCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-1 h-7 w-7 text-muted-foreground"
            onClick={toggleSidebar}
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen className="h-3.5 w-3.5" />
          </Button>
        )}
      </motion.aside>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 flex flex-col border-r border-border/60 bg-white shadow-xl"
            >
              {sidebarContent(false, () => setMobileNavOpen(false))}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 border-b border-border/60 bg-card/80 backdrop-blur-xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden shrink-0 bg-white"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden lg:flex shrink-0 bg-white"
              onClick={toggleSidebar}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
            <span className="lg:hidden font-semibold text-sm truncate">Roadmap Planner</span>
          </div>
          <SyncIndicator status={syncStatus} />
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
