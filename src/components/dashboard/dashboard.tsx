"use client";

import Link from "next/link";
import {
  Plus,
  LayoutTemplate,
  TrendingUp,
  Flag,
  Activity,
  ArrowUpRight,
  Layers,
  CheckCircle2,
  Target,
} from "lucide-react";
import { useRoadmapStore, TEMPLATE_LIST } from "@/lib/stores/roadmap-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RoadmapCard } from "@/components/dashboard/roadmap-card";
import { SyncIndicator } from "@/components/layout/sync-indicator";
import { formatDateRange, formatShortDate } from "@/lib/utils";

const TEMPLATE_COLORS = [
  "border-blue-200 bg-blue-50/50 hover:bg-blue-50",
  "border-teal-200 bg-teal-50/50 hover:bg-teal-50",
  "border-violet-200 bg-violet-50/50 hover:bg-violet-50",
  "border-amber-200 bg-amber-50/50 hover:bg-amber-50",
  "border-rose-200 bg-rose-50/50 hover:bg-rose-50",
];

export function Dashboard() {
  const {
    roadmaps,
    createRoadmap,
    createFromTemplate,
    getDashboardStats,
    syncStatus,
    loadError,
  } = useRoadmapStore();

  const stats = getDashboardStats();
  const { activeRoadmap, progress, upcomingMilestones, recentActivity } = stats;
  const totalTasks = roadmaps.reduce((n, r) => n + r.tasks.length, 0);
  const doneTasks = roadmaps.reduce(
    (n, r) => n + r.tasks.filter((t) => t.status === "done").length,
    0
  );

  return (
    <div className="mesh-bg min-h-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-8">
        {/* Hero */}
        <div className="surface-card p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-[11px] font-medium bg-slate-100 text-slate-700">
                  Career Planning
                </Badge>
                <SyncIndicator status={syncStatus} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Plan your career with clarity
              </h1>
              <p className="text-slate-600 mt-2 max-w-lg text-sm sm:text-base">
                Visual Gantt roadmaps with swim lanes, milestones, and stakeholder-ready
                presentation mode. All changes save to the cloud automatically.
              </p>
              {loadError && (
                <p className="text-danger text-sm mt-3 font-medium">{loadError}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Button size="lg" onClick={() => createRoadmap("New Career Roadmap")}>
                <Plus className="h-4 w-4" />
                New Roadmap
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="bg-white">
                    <LayoutTemplate className="h-4 w-4" />
                    Templates
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Start from a template</DialogTitle>
                  </DialogHeader>
                  <div className="grid sm:grid-cols-2 gap-3 mt-4">
                    {TEMPLATE_LIST.map((template, i) => (
                      <button
                        key={template.key}
                        type="button"
                        onClick={() => createFromTemplate(template.key)}
                        className={`text-left p-4 rounded-xl border transition-colors ${TEMPLATE_COLORS[i % TEMPLATE_COLORS.length]}`}
                      >
                        <p className="font-semibold text-sm text-foreground">{template.name}</p>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          {template.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Roadmaps", value: roadmaps.length, icon: Target },
            { label: "Total Tasks", value: totalTasks, icon: Layers },
            { label: "Completed", value: doneTasks, icon: CheckCircle2 },
            { label: "Progress", value: `${progress}%`, icon: TrendingUp },
          ].map((stat) => (
            <div key={stat.label} className="surface-card p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  {stat.label}
                </p>
                <stat.icon className="h-4 w-4 text-slate-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Active + milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          <div className="lg:col-span-3 surface-card overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-border">
              <h2 className="font-semibold text-foreground">Active Roadmap</h2>
              <p className="text-sm text-slate-600 mt-0.5">Continue where you left off</p>
            </div>
            <div className="p-5 sm:p-6">
              {activeRoadmap ? (
                <Link href={`/roadmap/${activeRoadmap.id}`}>
                  <div className="group rounded-xl border border-border p-5 sm:p-6 bg-slate-50/80 hover:border-primary/30 hover:bg-white transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {activeRoadmap.title}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {formatDateRange(
                            new Date(activeRoadmap.startDate),
                            new Date(activeRoadmap.endDate)
                          )}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          <Badge variant="secondary" className="bg-white text-slate-700">
                            {activeRoadmap.swimLanes.length} lanes
                          </Badge>
                          <Badge variant="secondary" className="bg-white text-slate-700">
                            {activeRoadmap.tasks.length} tasks
                          </Badge>
                          <Badge variant="secondary" className="bg-white text-slate-700">
                            {activeRoadmap.milestones.length} milestones
                          </Badge>
                        </div>
                        <Progress value={progress} className="mt-4 h-1.5" />
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-primary shrink-0 transition-colors" />
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="text-center py-10">
                  <Target className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-600">No active roadmap</p>
                  <Button className="mt-4" size="sm" onClick={() => createRoadmap()}>
                    Create your first roadmap
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 surface-card">
            <div className="p-5 sm:p-6 border-b border-border flex items-center gap-2">
              <Flag className="h-4 w-4 text-accent" />
              <h2 className="font-semibold text-foreground">Upcoming Milestones</h2>
            </div>
            <div className="p-5 sm:p-6 space-y-2">
              {upcomingMilestones.length === 0 ? (
                <p className="text-sm text-slate-600 text-center py-6">No milestones ahead</p>
              ) : (
                upcomingMilestones.map((ms) => (
                  <div
                    key={ms.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="milestone-diamond shrink-0" style={{ backgroundColor: ms.color }} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{ms.title}</p>
                      <p className="text-xs text-slate-600">{formatShortDate(new Date(ms.date))}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Activity */}
        {recentActivity.length > 0 && (
          <div className="surface-card">
            <div className="p-5 sm:p-6 border-b border-border flex items-center gap-2">
              <Activity className="h-4 w-4 text-warning" />
              <h2 className="font-semibold text-foreground">Recent Activity</h2>
            </div>
            <div className="p-5 sm:p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentActivity.slice(0, 6).map((entry) => (
                <div key={entry.id} className="flex gap-3 text-sm p-3 rounded-xl bg-slate-50 border border-border/60">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{entry.action}</p>
                    {entry.details && (
                      <p className="text-xs text-slate-600 truncate">{entry.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All roadmaps */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              All Roadmaps
              {roadmaps.length > 0 && (
                <span className="text-slate-500 font-normal ml-2">({roadmaps.length})</span>
              )}
            </h2>
          </div>
          {roadmaps.length === 0 ? (
            <div className="surface-card p-12 text-center">
              <LayoutTemplate className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="font-medium text-foreground">No roadmaps yet</p>
              <p className="text-sm text-slate-600 mt-1 mb-6">
                Create one from scratch or pick a template to get started
              </p>
              <Button onClick={() => createRoadmap()}>Create Roadmap</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {roadmaps.map((roadmap) => (
                <RoadmapCard
                  key={roadmap.id}
                  roadmap={roadmap}
                  isActive={roadmap.id === activeRoadmap?.id}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
