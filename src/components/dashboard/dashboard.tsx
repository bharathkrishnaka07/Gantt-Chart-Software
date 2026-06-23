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
  Sparkles,
} from "lucide-react";
import { useRoadmapStore, TEMPLATE_LIST } from "@/lib/stores/roadmap-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RoadmapCard } from "@/components/dashboard/roadmap-card";
import { TemplateCard } from "@/components/motion/template-card";
import { AnimatedProgress } from "@/components/motion/animated-progress";
import { AmbientBackground } from "@/components/motion/ambient-background";
import { GlowBorder } from "@/components/motion/glow-border";
import { TextReveal } from "@/components/motion/text-reveal";
import { CountUp } from "@/components/motion/count-up";
import { TiltCard } from "@/components/motion/tilt-card";
import {
  staggerContainer,
  staggerItem,
  springBouncy,
  springCinematic,
  springSnappy,
} from "@/lib/motion/presets";
import { SyncIndicator } from "@/components/layout/sync-indicator";
import { formatDateRange, formatShortDate } from "@/lib/utils";

const TEMPLATE_COLORS = [
  "from-blue-500/10 to-blue-600/5 border-blue-200/60",
  "from-teal-500/10 to-teal-600/5 border-teal-200/60",
  "from-violet-500/10 to-violet-600/5 border-violet-200/60",
  "from-amber-500/10 to-amber-600/5 border-amber-200/60",
  "from-rose-500/10 to-rose-600/5 border-rose-200/60",
];

const STAT_CONFIG = [
  { label: "Roadmaps", key: "roadmaps" as const, icon: Target },
  { label: "Total Tasks", key: "tasks" as const, icon: Layers },
  { label: "Completed", key: "done" as const, icon: CheckCircle2 },
  { label: "Progress", key: "progress" as const, icon: TrendingUp },
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

  const statValues = {
    roadmaps: roadmaps.length,
    tasks: totalTasks,
    done: doneTasks,
    progress,
  };

  return (
    <div className="mesh-bg min-h-full relative overflow-hidden">
      <AmbientBackground />
      <motion.div
        className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Hero — cinematic reveal */}
        <motion.div variants={staggerItem}>
          <GlowBorder innerClassName="stat-glow overflow-hidden">
            <div className="relative p-6 sm:p-8">
              <motion.div
                className="absolute top-4 right-4 opacity-20"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-24 w-24 text-primary" />
              </motion.div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative">
                <div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...springCinematic, delay: 0.1 }}
                    className="flex items-center gap-2 mb-3"
                  >
                    <Badge variant="secondary" className="text-[11px] font-medium">
                      Career Planning
                    </Badge>
                    <SyncIndicator status={syncStatus} />
                  </motion.div>

                  <TextReveal
                    text="Plan your career with clarity"
                    className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight"
                    delay={0.15}
                  />

                  <motion.p
                    initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ ...springCinematic, delay: 0.55 }}
                    className="text-muted-foreground mt-3 max-w-lg text-sm sm:text-base"
                  >
                    Visual Gantt roadmaps with swim lanes, milestones, and stakeholder-ready
                    presentation mode. All changes save to the cloud automatically.
                  </motion.p>

                  {loadError && (
                    <p className="text-danger text-sm mt-3 font-medium">{loadError}</p>
                  )}
                </div>

                <motion.div
                  className="flex flex-wrap gap-2 shrink-0"
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ ...springBouncy, delay: 0.45 }}
                >
                  <Button
                    size="lg"
                    className="shadow-lg shadow-primary/30"
                    onClick={() => createRoadmap("New Career Roadmap")}
                  >
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
                          <TemplateCard
                            key={template.key}
                            name={template.name}
                            description={template.description}
                            colorClass={TEMPLATE_COLORS[i % TEMPLATE_COLORS.length]}
                            onClick={() => createFromTemplate(template.key)}
                            index={i}
                          />
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              </div>
            </div>
          </GlowBorder>
        </motion.div>

        {/* Stats — count-up + icon spin */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
          variants={staggerContainer}
        >
          {STAT_CONFIG.map((stat) => {
            const val = statValues[stat.key];
            return (
              <motion.div key={stat.label} variants={staggerItem}>
                <TiltCard intensity={8} className="h-full">
                  <div className="surface-card p-4 sm:p-5 h-full overflow-hidden relative">
                    <motion.div
                      className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/5 blur-2xl"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                    <div className="flex items-center justify-between mb-2 relative">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {stat.label}
                      </p>
                      <motion.div
                        whileHover={{ rotate: [0, -12, 12, 0], scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                      >
                        <stat.icon className="h-4 w-4 text-primary/60" />
                      </motion.div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight relative">
                      {stat.key === "progress" ? (
                        <CountUp value={val} suffix="%" />
                      ) : (
                        <CountUp value={val} />
                      )}
                    </p>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Active + milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          <motion.div variants={staggerItem} className="lg:col-span-3">
            <GlowBorder innerClassName="overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-border/60">
                <TextReveal text="Active Roadmap" as="h2" className="font-semibold text-lg" delay={0} />
                <p className="text-sm text-muted-foreground mt-1">Continue where you left off</p>
              </div>
              <div className="p-5 sm:p-6">
                {activeRoadmap ? (
                  <Link href={`/roadmap/${activeRoadmap.id}`}>
                    <TiltCard intensity={10}>
                      <motion.div
                        className="group rounded-xl border border-border/60 p-5 sm:p-6 bg-gradient-to-br from-primary/[0.06] to-accent/[0.06]"
                        whileHover={{
                          boxShadow: "0 24px 56px rgba(37, 99, 235, 0.14)",
                          borderColor: "rgba(37, 99, 235, 0.25)",
                        }}
                        transition={springSnappy}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                              {activeRoadmap.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
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
                            <AnimatedProgress value={progress} className="mt-4 h-2" />
                          </div>
                          <motion.div
                            animate={{ x: [0, 4, 0], y: [0, -4, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <ArrowUpRight className="h-6 w-6 text-primary shrink-0" />
                          </motion.div>
                        </div>
                      </motion.div>
                    </TiltCard>
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
            </GlowBorder>
          </motion.div>

          <motion.div variants={staggerItem} className="lg:col-span-2 surface-card overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-border/60 flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Flag className="h-4 w-4 text-accent" />
              </motion.div>
              <h2 className="font-semibold">Upcoming Milestones</h2>
            </div>
            <div className="p-5 sm:p-6 space-y-2">
              {upcomingMilestones.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No milestones ahead</p>
              ) : (
                upcomingMilestones.map((ms, i) => (
                  <motion.div
                    key={ms.id}
                    initial={{ opacity: 0, x: -32, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ ...springBouncy, delay: 0.3 + i * 0.08 }}
                    whileHover={{ x: 6, backgroundColor: "rgba(241, 245, 249, 0.8)" }}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-default"
                  >
                    <motion.div
                      className="milestone-diamond shrink-0"
                      style={{ backgroundColor: ms.color }}
                      whileHover={{ scale: 1.3, rotate: 90 }}
                      transition={springBouncy}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{ms.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatShortDate(new Date(ms.date))}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Activity */}
        {recentActivity.length > 0 && (
          <motion.div variants={staggerItem} className="surface-card overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-border/60 flex items-center gap-2">
              <Activity className="h-4 w-4 text-warning" />
              <h2 className="font-semibold">Recent Activity</h2>
            </div>
            <div className="p-5 sm:p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentActivity.slice(0, 6).map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springCinematic, delay: i * 0.06 }}
                  whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(15,23,42,0.06)" }}
                  className="flex gap-3 text-sm p-3 rounded-xl bg-muted/40"
                >
                  <motion.div
                    className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{entry.action}</p>
                    {entry.details && (
                      <p className="text-xs text-muted-foreground truncate">{entry.details}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All roadmaps */}
        <motion.section variants={staggerItem}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              All Roadmaps
              {roadmaps.length > 0 && (
                <span className="text-muted-foreground font-normal ml-2">({roadmaps.length})</span>
              )}
            </h2>
          </div>
          {roadmaps.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={springCinematic}
              className="surface-card p-12 text-center"
            >
              <LayoutTemplate className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="font-medium">No roadmaps yet</p>
              <p className="text-sm text-muted-foreground mt-1 mb-6">
                Create one from scratch or pick a template to get started
              </p>
              <Button onClick={() => createRoadmap()}>Create Roadmap</Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {roadmaps.map((roadmap, i) => (
                <motion.div
                  key={roadmap.id}
                  initial={{ opacity: 0, y: 40, rotateX: -12 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ ...springCinematic, delay: i * 0.08 }}
                  style={{ transformPerspective: 1000 }}
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
      </motion.div>
    </div>
  );
}
