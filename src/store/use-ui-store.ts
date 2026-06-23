import { create } from "zustand";
import type { SyncStatus } from "@/lib/sync-client";

/** Ephemeral UI state only — no roadmap data persisted here */
interface GanttUIStore {
  draggingTaskId: string | null;
  resizingTaskId: string | null;
  activeTaskId: string | null;
  activeMilestoneId: string | null;
  hoveredLaneId: string | null;
  setDraggingTaskId: (id: string | null) => void;
  setResizingTaskId: (id: string | null) => void;
  setActiveTaskId: (id: string | null) => void;
  setActiveMilestoneId: (id: string | null) => void;
  setHoveredLaneId: (id: string | null) => void;
  clearDrag: () => void;
}

export const useGanttUIStore = create<GanttUIStore>((set) => ({
  draggingTaskId: null,
  resizingTaskId: null,
  activeTaskId: null,
  activeMilestoneId: null,
  hoveredLaneId: null,
  setDraggingTaskId: (id) => set({ draggingTaskId: id }),
  setResizingTaskId: (id) => set({ resizingTaskId: id }),
  setActiveTaskId: (id) =>
    set(id ? { activeTaskId: id, activeMilestoneId: null } : { activeTaskId: null }),
  setActiveMilestoneId: (id) =>
    set(id ? { activeMilestoneId: id, activeTaskId: null } : { activeMilestoneId: null }),
  setHoveredLaneId: (id) => set({ hoveredLaneId: id }),
  clearDrag: () => set({ draggingTaskId: null, resizingTaskId: null }),
}));

interface AppUIStore {
  zoom: "week" | "month" | "quarter" | "year";
  sidebarCollapsed: boolean;
  presentationMode: boolean;
  mobileTimelineView: boolean;
  commandOpen: boolean;
  syncStatus: SyncStatus;
  setZoom: (z: AppUIStore["zoom"]) => void;
  toggleSidebar: () => void;
  setPresentationMode: (v: boolean) => void;
  setMobileTimelineView: (v: boolean) => void;
  setCommandOpen: (v: boolean) => void;
  setSyncStatus: (s: SyncStatus) => void;
}

export const useAppUIStore = create<AppUIStore>((set) => ({
  zoom: "month",
  sidebarCollapsed: false,
  presentationMode: false,
  mobileTimelineView: false,
  commandOpen: false,
  syncStatus: "idle",
  setZoom: (zoom) => set({ zoom }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setPresentationMode: (v) => set({ presentationMode: v }),
  setMobileTimelineView: (v) => set({ mobileTimelineView: v }),
  setCommandOpen: (v) => set({ commandOpen: v }),
  setSyncStatus: (syncStatus) => set({ syncStatus }),
}));
