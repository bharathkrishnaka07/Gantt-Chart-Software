"use client";

import { motion } from "motion/react";
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
import { formatDateRange, formatShortDate } from "@/lib/utils";
import { SyncIndicator } from "@/components/layout/sync-indicator";

const TEMPLATE_COLORS = [
  "from-blue-500/10 to-blue-600/5 border-blue-200/60",
  "from-teal-500/10 to-teal-600/5 border-teal-200/60",
  "from-violet-500/10 to-violet-600/5 border-violet-200/60",
  "from-amber-500/10 to-amber-600/5 border-amber-200/60",
  "from-rose-500/10 to-rose-600/5 border-rose-200/60",
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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface-card p-6 sm:p-8 stat-glow"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-[11px] font-medium">
                  Career Planning
                </Badge>
                <SyncIndicator status={syncStatus} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Plan your career with clarity
              </h1>
              <p className="text-muted-foreground mt-2 max-w-lg text-sm sm:text-base">
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
                  <Button size="lg" variant="outline">
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
                        onClick={() => createFromTemplate(template.key)}
                        className={`text-left p-4 rounded-xl border bg-gradient-to-br ${TEMPLATE_COLORS[i % TEMPLATE_COLORS.length]} hover:shadow-md transition-all`}
                      >
                        <p className="font-semibold text-sm">{template.name}</p>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                          {template.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Roadmaps", value: roadmaps.length, icon: Target },
            { label: "Total Tasks", value: totalTasks, icon: Layers },
            { label: "Completed", value: doneTasks, icon: CheckCircle2 },
            { label: "Progress", value: `${progress}%`, icon: TrendingUp },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="surface-card p-4 sm:p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {stat.label}
                </p>
                <stat.icon className="h-4 w-4 text-muted-foreground/60" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold tracking-tight">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Active + milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 surface-card overflow-hidden"
          >
            <div className="p-5 sm:p-6 border-b border-border/60">
              <h2 className="font-semibold">Active Roadmap</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Continue where you left off</p>
            </div>
            <div className="p-5 sm:p-6">
              {activeRoadmap ? (
                <Link href={`/roadmap/${activeRoadmap.id}`}>
                  <div className="group rounded-xl border border-border/60 p-5 sm:p-6 bg-gradient-to-br from-primary/[0.04] to-accent/[0.04] hover:border-primary/30 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                            {activeRoadmap.title}
                          </h3>
                          {activeRoadmap.isLocked && (
                            <Badge variant="secondary" className="text-[10px]">Locked</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDateRange(
                            new Date(activeRoadmap.startDate),
                            new Date(activeRoadmap.endDate)
                          )}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-4">
                          <Badge variant="outline">{activeRoadmap.swimLanes.length} lanes</Badge>
                          <Badge variant="outline">{activeRoadmap.tasks.length} tasks</Badge>
                          <Badge variant="outline">{activeRoadmap.milestones.length} milestones</Badge>
                        </div>
                        <Progress value={progress} className="mt-4 h-1.5" />
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="text-center py-10">
                  <Target className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No active roadmap</p>
                  <Button className="mt-4" size="sm" onClick={() => createRoadmap()}>
                    Create your first roadmap
                  </Button>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 surface-card"
          >
            <div className="p-5 sm:p-6 border-b border-border/60 flex items-center gap-2">
              <Flag className="h-4 w-4 text-accent" />
              <h2 className="font-semibold">Upcoming Milestones</h2>
            </div>
            <div className="p-5 sm:p-6 space-y-3">
              {upcomingMilestones.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No milestones ahead</p>
              ) : (
                upcomingMilestones.map((ms, i) => (
                  <motion.div
                    key={ms.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="milestone-diamond shrink-0" style={{ backgroundColor: ms.color }} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{ms.title}</p>
                      <p className="text-xs text-muted-foreground">{formatShortDate(new Date(ms.date))}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Activity */}
        {recentActivity.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="surface-card"
          >
            <div className="p-5 sm:p-6 border-b border-border/60 flex items-center gap-2">
              <Activity className="h-4 w-4 text-warning" />
              <h2 className="font-semibold">Recent Activity</h2>
            </div>
            <div className="p-5 sm:p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentActivity.slice(0, 6).map((entry) => (
                <div key={entry.id} className="flex gap-3 text-sm p-3 rounded-xl bg-muted/40">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{entry.action}</p>
                    {entry.details && (
                      <p className="text-xs text-muted-foreground truncate">{entry.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All roadmaps */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              All Roadmaps
              {roadmaps.length > 0 && (
                <span className="text-muted-foreground font-normal ml-2">({roadmaps.length})</span>
              )}
            </h2>
          </div>
          {roadmaps.length === 0 ? (
            <div className="surface-card p-12 text-center">
              <LayoutTemplate className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="font-medium">No roadmaps yet</p>
              <p className="text-sm text-muted-foreground mt-1 mb-6">
                Create one from scratch or pick a template to get started
              </p>
              <div className="flex justify-center gap-2">
                <Button onClick={() => createRoadmap()}>Create Roadmap</Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {roadmaps.map((roadmap, i) => (
                <motion.div
                  key={roadmap.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <RoadmapCard
                    roadmap={roadmap}
                    isActive={roadmap.id === activeRoadmap?.id}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
