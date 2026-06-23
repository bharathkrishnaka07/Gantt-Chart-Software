"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  Plus,
  Copy,
  LayoutTemplate,
  TrendingUp,
  Flag,
  Activity,
  ArrowRight,
  Map,
} from "lucide-react";
import { useRoadmapStore, TEMPLATE_LIST } from "@/lib/stores/roadmap-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

export function Dashboard() {
  const {
    roadmaps,
    createRoadmap,
    createFromTemplate,
    duplicateRoadmapById,
    getDashboardStats,
  } = useRoadmapStore();

  const stats = getDashboardStats();
  const { activeRoadmap, progress, upcomingMilestones, recentActivity } = stats;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/60 clay-glass sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl clay-button flex items-center justify-center">
              <Map className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Career Roadmap Planner</h1>
              <p className="text-xs text-muted-foreground">Visual career planning platform</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3"
        >
          <Button onClick={() => createRoadmap("New Career Roadmap")}>
            <Plus className="h-4 w-4" /> Create Roadmap
          </Button>
          {activeRoadmap && (
            <Button variant="secondary" onClick={() => duplicateRoadmapById(activeRoadmap.id)}>
              <Copy className="h-4 w-4" /> Duplicate
            </Button>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <LayoutTemplate className="h-4 w-4" /> Import Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Choose a Template</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 mt-4 max-h-[60vh] overflow-y-auto">
                {TEMPLATE_LIST.map((template) => (
                  <button
                    key={template.key}
                    onClick={() => createFromTemplate(template.key)}
                    className="text-left p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors clay-card-hover"
                  >
                    <p className="font-semibold text-sm">{template.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Roadmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="clay-card-hover overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-primary" />
                  Active Roadmap
                </CardTitle>
                <CardDescription>Your current career planning roadmap</CardDescription>
              </CardHeader>
              <CardContent>
                {activeRoadmap ? (
                  <Link href={`/roadmap/${activeRoadmap.id}`}>
                    <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/60 hover:border-primary/30 transition-all group cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                            {activeRoadmap.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatDateRange(
                              new Date(activeRoadmap.startDate),
                              new Date(activeRoadmap.endDate)
                            )}
                          </p>
                          <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                            <span>{activeRoadmap.swimLanes.length} lanes</span>
                            <span>{activeRoadmap.tasks.length} tasks</span>
                            <span>{activeRoadmap.milestones.length} milestones</span>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                ) : (
                  <p className="text-muted-foreground text-sm">No active roadmap</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="clay-card-hover h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">{progress}%</div>
                <p className="text-sm text-muted-foreground mt-1">Tasks completed</p>
                <Progress value={progress} className="mt-4" />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming Milestones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="clay-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-accent" />
                  Upcoming Milestones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingMilestones.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No upcoming milestones</p>
                ) : (
                  upcomingMilestones.map((ms) => (
                    <div key={ms.id} className="flex items-center gap-3">
                      <div
                        className="milestone-diamond shrink-0"
                        style={{ backgroundColor: ms.color }}
                      />
                      <div>
                        <p className="text-sm font-medium">{ms.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatShortDate(new Date(ms.date))}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="clay-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-warning" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                ) : (
                  recentActivity.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex gap-3 text-sm">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div>
                        <p className="font-medium">{entry.action}</p>
                        {entry.details && (
                          <p className="text-xs text-muted-foreground">{entry.details}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* All Roadmaps */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold mb-4">
            All Roadmaps {roadmaps.length > 0 && `(${roadmaps.length})`}
          </h2>
          {roadmaps.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No roadmaps yet. Create one or import a template to get started.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {roadmaps.map((roadmap) => (
                <RoadmapCard
                  key={roadmap.id}
                  roadmap={roadmap}
                  isActive={roadmap.id === activeRoadmap?.id}
                />
              ))}
            </div>
          )}
        </motion.section>
      </main>
    </div>
  );
}
