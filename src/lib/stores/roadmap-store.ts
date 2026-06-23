import { create } from "zustand";
import type {
  Milestone,
  Roadmap,
  RoadmapTask,
  RoadmapVersion,
  SwimLane,
  ZoomLevel,
  ActivityEntry,
} from "@/types/roadmap";
import { generateId } from "@/lib/utils";
import {
  createPMCareerRoadmap,
  duplicateRoadmap,
  createBlankRoadmap,
  TEMPLATES,
} from "@/lib/templates";
import { fetchAppState, scheduleSyncToServer, forceSyncToServer, type SyncStatus } from "@/lib/sync-client";

interface RoadmapStore {
  roadmaps: Roadmap[];
  activeRoadmapId: string | null;
  versions: RoadmapVersion[];
  presentationMode: boolean;
  mobileTimelineView: boolean;
  selectedTaskId: string | null;
  selectedMilestoneId: string | null;
  recentActivity: ActivityEntry[];
  isLoading: boolean;
  isHydrated: boolean;
  syncStatus: SyncStatus;
  loadError: string | null;

  loadFromServer: () => Promise<void>;
  setSyncStatus: (status: SyncStatus) => void;
  getActiveRoadmap: () => Roadmap | null;
  setActiveRoadmap: (id: string) => void;
  createRoadmap: (title?: string) => Roadmap;
  createFromTemplate: (templateKey: string) => Roadmap;
  duplicateRoadmapById: (id: string) => Roadmap;
  updateRoadmap: (id: string, updates: Partial<Roadmap>) => void;
  deleteRoadmap: (id: string) => void;
  toggleLock: (id: string) => void;

  addSwimLane: (roadmapId: string, name: string) => void;
  updateSwimLane: (roadmapId: string, laneId: string, updates: Partial<SwimLane>) => void;
  deleteSwimLane: (roadmapId: string, laneId: string) => void;
  reorderSwimLanes: (roadmapId: string, laneIds: string[]) => void;
  moveSwimLane: (roadmapId: string, laneId: string, direction: "up" | "down") => void;

  addTask: (roadmapId: string, task: Omit<RoadmapTask, "id" | "activity">) => void;
  updateTask: (roadmapId: string, taskId: string, updates: Partial<RoadmapTask>) => void;
  deleteTask: (roadmapId: string, taskId: string) => void;
  duplicateTask: (roadmapId: string, taskId: string) => void;
  moveTask: (roadmapId: string, taskId: string, laneId: string, startDate: string, endDate: string) => void;

  addMilestone: (roadmapId: string, milestone: Omit<Milestone, "id">) => void;
  updateMilestone: (roadmapId: string, milestoneId: string, updates: Partial<Milestone>) => void;
  deleteMilestone: (roadmapId: string, milestoneId: string) => void;

  setZoomLevel: (roadmapId: string, zoom: ZoomLevel) => void;
  setTimelineRange: (roadmapId: string, startDate: string, endDate: string) => void;

  saveVersion: (roadmapId: string, label: string) => void;
  restoreVersion: (versionId: string) => void;

  setPresentationMode: (enabled: boolean) => void;
  setMobileTimelineView: (enabled: boolean) => void;
  setSelectedTaskId: (taskId: string | null) => void;
  setSelectedMilestoneId: (milestoneId: string | null) => void;
  getVersionsForRoadmap: (roadmapId: string) => RoadmapVersion[];

  getDashboardStats: () => {
    activeRoadmap: Roadmap | null;
    progress: number;
    upcomingMilestones: Milestone[];
    recentActivity: ActivityEntry[];
  };
}

function logActivity(
  get: () => RoadmapStore,
  set: (partial: Partial<RoadmapStore>) => void,
  action: string,
  details?: string
) {
  const entry: ActivityEntry = {
    id: generateId(),
    action,
    timestamp: new Date().toISOString(),
    details,
  };
  set({ recentActivity: [entry, ...get().recentActivity].slice(0, 20) });
  triggerSync(get);
}

function touchRoadmap(roadmaps: Roadmap[], id: string): Roadmap[] {
  return roadmaps.map((r) =>
    r.id === id ? { ...r, updatedAt: new Date().toISOString() } : r
  );
}

function getSyncPayload(state: RoadmapStore) {
  return {
    roadmaps: state.roadmaps,
    activeRoadmapId: state.activeRoadmapId,
    versions: state.versions,
    recentActivity: state.recentActivity,
  };
}

function triggerSync(get: () => RoadmapStore, immediate = false) {
  if (!get().isHydrated) return;
  scheduleSyncToServer(() => getSyncPayload(get()), immediate);
}

export const useRoadmapStore = create<RoadmapStore>()((set, get) => ({
  roadmaps: [],
  activeRoadmapId: null,
  versions: [],
  presentationMode: false,
  mobileTimelineView: false,
  selectedTaskId: null,
  selectedMilestoneId: null,
  recentActivity: [],
  isLoading: true,
  isHydrated: false,
  syncStatus: "idle" as SyncStatus,
  loadError: null,

  setSyncStatus: (status) => set({ syncStatus: status }),

  loadFromServer: async () => {
    set({ isLoading: true, loadError: null });
    const data = await fetchAppState();

    if (data && data.roadmaps.length > 0) {
      set({
        roadmaps: data.roadmaps,
        activeRoadmapId: data.activeRoadmapId,
        versions: data.versions,
        recentActivity: data.recentActivity,
        isLoading: false,
        isHydrated: true,
        syncStatus: "saved",
      });
      return;
    }

    if (data && data.roadmaps.length === 0) {
      const defaultRoadmap = createPMCareerRoadmap();
      defaultRoadmap.isTemplate = false;
      const initial = {
        roadmaps: [defaultRoadmap],
        activeRoadmapId: defaultRoadmap.id,
        recentActivity: [
          {
            id: generateId(),
            action: "Created roadmap",
            timestamp: new Date().toISOString(),
            details: defaultRoadmap.title,
          },
        ] as ActivityEntry[],
      };
      set({ ...initial, isLoading: false, isHydrated: true, syncStatus: "syncing" });
      const ok = await forceSyncToServer(() => ({
        ...getSyncPayload(get()),
        ...initial,
      }));
      if (!ok) {
        set({ loadError: "Could not save to database. Check DATABASE_URL is configured." });
      }
      return;
    }

    set({
      loadError: "Could not connect to database. Check DATABASE_URL on Vercel.",
      isLoading: false,
      isHydrated: true,
    });
  },

  getActiveRoadmap: () => {
    const { roadmaps, activeRoadmapId } = get();
    return roadmaps.find((r) => r.id === activeRoadmapId) ?? roadmaps[0] ?? null;
  },

  setActiveRoadmap: (id) => {
    set({ activeRoadmapId: id });
    triggerSync(get);
  },

  createRoadmap: (title) => {
    const roadmap = createBlankRoadmap(title);
    set((s) => ({
      roadmaps: [...s.roadmaps, roadmap],
      activeRoadmapId: roadmap.id,
    }));
    logActivity(get, set, "Created roadmap", roadmap.title);
    triggerSync(get);
    return roadmap;
  },

  createFromTemplate: (templateKey) => {
    const factory = TEMPLATES[templateKey];
    if (!factory) throw new Error(`Unknown template: ${templateKey}`);
    const roadmap = duplicateRoadmap(factory(), false);
    set((s) => ({
      roadmaps: [...s.roadmaps, roadmap],
      activeRoadmapId: roadmap.id,
    }));
    logActivity(get, set, "Created from template", roadmap.title);
    triggerSync(get);
    return roadmap;
  },

  duplicateRoadmapById: (id) => {
    const original = get().roadmaps.find((r) => r.id === id);
    if (!original) throw new Error("Roadmap not found");
    const copy = duplicateRoadmap(original);
    set((s) => ({
      roadmaps: [...s.roadmaps, copy],
      activeRoadmapId: copy.id,
    }));
    logActivity(get, set, "Duplicated roadmap", copy.title);
    triggerSync(get);
    return copy;
  },

  updateRoadmap: (id, updates) => {
    set((s) => ({
      roadmaps: touchRoadmap(
        s.roadmaps.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        id
      ),
    }));
    triggerSync(get);
  },

  deleteRoadmap: (id) => {
    set((s) => {
      const filtered = s.roadmaps.filter((r) => r.id !== id);
      return {
        roadmaps: filtered,
        activeRoadmapId:
          s.activeRoadmapId === id ? filtered[0]?.id ?? null : s.activeRoadmapId,
        versions: s.versions.filter((v) => v.roadmapId !== id),
      };
    });
    logActivity(get, set, "Deleted roadmap");
    triggerSync(get, true);
  },

  toggleLock: (id) => {
    const roadmap = get().roadmaps.find((r) => r.id === id);
    if (!roadmap) return;
    set((s) => ({
      roadmaps: touchRoadmap(
        s.roadmaps.map((r) =>
          r.id === id ? { ...r, isLocked: !r.isLocked } : r
        ),
        id
      ),
    }));
    logActivity(
      get,
      set,
      roadmap.isLocked ? "Unlocked roadmap" : "Locked roadmap",
      roadmap.title
    );
    triggerSync(get);
  },

  addSwimLane: (roadmapId, name) => {
    const lane: SwimLane = {
      id: generateId(),
      name,
      color: "#2563EB",
      order: get().roadmaps.find((r) => r.id === roadmapId)?.swimLanes.length ?? 0,
      collapsed: false,
    };
    set((s) => ({
      roadmaps: touchRoadmap(
        s.roadmaps.map((r) =>
          r.id === roadmapId ? { ...r, swimLanes: [...r.swimLanes, lane] } : r
        ),
        roadmapId
      ),
    }));
    logActivity(get, set, "Added swim lane", name);
    triggerSync(get);
  },

  updateSwimLane: (roadmapId, laneId, updates) => {
    set((s) => ({
      roadmaps: touchRoadmap(
        s.roadmaps.map((r) =>
          r.id === roadmapId
            ? {
                ...r,
                swimLanes: r.swimLanes.map((l) =>
                  l.id === laneId ? { ...l, ...updates } : l
                ),
              }
            : r
        ),
        roadmapId
      ),
    }));
    triggerSync(get);
  },

  deleteSwimLane: (roadmapId, laneId) => {
    set((s) => ({
      roadmaps: touchRoadmap(
        s.roadmaps.map((r) =>
          r.id === roadmapId
            ? {
                ...r,
                swimLanes: r.swimLanes.filter((l) => l.id !== laneId),
                tasks: r.tasks.filter((t) => t.laneId !== laneId),
              }
            : r
        ),
        roadmapId
      ),
    }));
    triggerSync(get);
  },

  reorderSwimLanes: (roadmapId, laneIds) => {
    set((s) => ({
      roadmaps: touchRoadmap(
        s.roadmaps.map((r) => {
          if (r.id !== roadmapId) return r;
          const ordered = laneIds
            .map((id, i) => {
              const lane = r.swimLanes.find((l) => l.id === id);
              return lane ? { ...lane, order: i } : null;
            })
            .filter(Boolean) as SwimLane[];
          return { ...r, swimLanes: ordered };
        }),
        roadmapId
      ),
    }));
    triggerSync(get);
  },

  moveSwimLane: (roadmapId, laneId, direction) => {
    const roadmap = get().roadmaps.find((r) => r.id === roadmapId);
    if (!roadmap) return;
    const sorted = [...roadmap.swimLanes].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((l) => l.id === laneId);
    if (index === -1) return;
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;
    const ids = sorted.map((l) => l.id);
    [ids[index], ids[swapIndex]] = [ids[swapIndex], ids[index]];
    get().reorderSwimLanes(roadmapId, ids);
    logActivity(get, set, "Reordered swim lane");
  },

  addTask: (roadmapId, taskData) => {
    const task: RoadmapTask = {
      ...taskData,
      id: generateId(),
      activity: [
        {
          id: generateId(),
          action: "Task created",
          timestamp: new Date().toISOString(),
        },
      ],
    };
    set((s) => ({
      roadmaps: touchRoadmap(
        s.roadmaps.map((r) =>
          r.id === roadmapId ? { ...r, tasks: [...r.tasks, task] } : r
        ),
        roadmapId
      ),
    }));
    logActivity(get, set, "Added task", task.title);
    triggerSync(get);
  },

  updateTask: (roadmapId, taskId, updates) => {
    set((s) => ({
      roadmaps: touchRoadmap(
        s.roadmaps.map((r) =>
          r.id === roadmapId
            ? {
                ...r,
                tasks: r.tasks.map((t) =>
                  t.id === taskId
                    ? {
                        ...t,
                        ...updates,
                        activity: [
                          {
                            id: generateId(),
                            action: "Task updated",
                            timestamp: new Date().toISOString(),
                            details: updates.title ?? t.title,
                          },
                          ...t.activity,
                        ].slice(0, 50),
                      }
                    : t
                ),
              }
            : r
        ),
        roadmapId
      ),
    }));
    triggerSync(get);
  },

  deleteTask: (roadmapId, taskId) => {
    set((s) => ({
      roadmaps: touchRoadmap(
        s.roadmaps.map((r) =>
          r.id === roadmapId
            ? { ...r, tasks: r.tasks.filter((t) => t.id !== taskId) }
            : r
        ),
        roadmapId
      ),
      selectedTaskId: s.selectedTaskId === taskId ? null : s.selectedTaskId,
    }));
    triggerSync(get);
  },

  duplicateTask: (roadmapId, taskId) => {
    const roadmap = get().roadmaps.find((r) => r.id === roadmapId);
    const original = roadmap?.tasks.find((t) => t.id === taskId);
    if (!original || !roadmap) return;
    const copy: RoadmapTask = {
      ...original,
      id: generateId(),
      title: `${original.title} (Copy)`,
      activity: [],
    };
    set((s) => ({
      roadmaps: touchRoadmap(
        s.roadmaps.map((r) =>
          r.id === roadmapId ? { ...r, tasks: [...r.tasks, copy] } : r
        ),
        roadmapId
      ),
    }));
    logActivity(get, set, "Duplicated task", copy.title);
    triggerSync(get);
  },

  moveTask: (roadmapId, taskId, laneId, startDate, endDate) => {
    get().updateTask(roadmapId, taskId, { laneId, startDate, endDate });
  },

  addMilestone: (roadmapId, milestoneData) => {
    const ms: Milestone = { ...milestoneData, id: generateId() };
    set((s) => ({
      roadmaps: touchRoadmap(
        s.roadmaps.map((r) =>
          r.id === roadmapId ? { ...r, milestones: [...r.milestones, ms] } : r
        ),
        roadmapId
      ),
    }));
    logActivity(get, set, "Added milestone", ms.title);
    triggerSync(get);
  },

  updateMilestone: (roadmapId, milestoneId, updates) => {
    set((s) => ({
      roadmaps: touchRoadmap(
        s.roadmaps.map((r) =>
          r.id === roadmapId
            ? {
                ...r,
                milestones: r.milestones.map((m) =>
                  m.id === milestoneId ? { ...m, ...updates } : m
                ),
              }
            : r
        ),
        roadmapId
      ),
    }));
    triggerSync(get);
  },

  deleteMilestone: (roadmapId, milestoneId) => {
    set((s) => ({
      roadmaps: touchRoadmap(
        s.roadmaps.map((r) =>
          r.id === roadmapId
            ? { ...r, milestones: r.milestones.filter((m) => m.id !== milestoneId) }
            : r
        ),
        roadmapId
      ),
    }));
    triggerSync(get);
  },

  setZoomLevel: (roadmapId, zoom) => {
    get().updateRoadmap(roadmapId, { zoomLevel: zoom });
  },

  setTimelineRange: (roadmapId, startDate, endDate) => {
    get().updateRoadmap(roadmapId, { startDate, endDate });
  },

  saveVersion: (roadmapId, label) => {
    const roadmap = get().roadmaps.find((r) => r.id === roadmapId);
    if (!roadmap) return;
    const version: RoadmapVersion = {
      id: generateId(),
      label,
      snapshot: JSON.parse(JSON.stringify(roadmap)),
      roadmapId,
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ versions: [version, ...s.versions].slice(0, 20) }));
    logActivity(get, set, "Saved version", label);
    triggerSync(get);
  },

  restoreVersion: (versionId) => {
    const version = get().versions.find((v) => v.id === versionId);
    if (!version) return;
    set((s) => ({
      roadmaps: s.roadmaps.map((r) =>
        r.id === version.roadmapId
          ? { ...version.snapshot, updatedAt: new Date().toISOString() }
          : r
      ),
    }));
    logActivity(get, set, "Restored version", version.label);
    triggerSync(get);
  },

  setPresentationMode: (enabled) => set({ presentationMode: enabled }),
  setMobileTimelineView: (enabled) => set({ mobileTimelineView: enabled }),
  setSelectedTaskId: (taskId) =>
    set(taskId ? { selectedTaskId: taskId, selectedMilestoneId: null } : { selectedTaskId: null }),
  setSelectedMilestoneId: (milestoneId) =>
    set(
      milestoneId
        ? { selectedMilestoneId: milestoneId, selectedTaskId: null }
        : { selectedMilestoneId: null }
    ),

  getVersionsForRoadmap: (roadmapId) =>
    get().versions.filter((v) => v.roadmapId === roadmapId),

  getDashboardStats: () => {
    const activeRoadmap = get().getActiveRoadmap();
    if (!activeRoadmap) {
      return {
        activeRoadmap: null,
        progress: 0,
        upcomingMilestones: [],
        recentActivity: get().recentActivity,
      };
    }
    const total = activeRoadmap.tasks.length;
    const completed = activeRoadmap.tasks.filter((t) => t.status === "done").length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    const now = new Date();
    const upcomingMilestones = [...activeRoadmap.milestones]
      .filter((m) => new Date(m.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
    return {
      activeRoadmap,
      progress,
      upcomingMilestones,
      recentActivity: get().recentActivity,
    };
  },
}));

export const TEMPLATE_LIST = [
  { key: "pm-career", name: "Project Management Career Roadmap", description: "Whiteboard-inspired PM transition plan" },
  { key: "software-engineering", name: "Software Engineering Roadmap", description: "Path to senior engineer" },
  { key: "data-science", name: "Data Science Roadmap", description: "ML and analytics career path" },
  { key: "product-management", name: "Product Management Roadmap", description: "Become a product manager" },
  { key: "graduate-career", name: "Graduate Career Planning", description: "First steps after graduation" },
];
