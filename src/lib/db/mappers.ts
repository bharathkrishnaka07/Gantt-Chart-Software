import type {
  ActivityEntry,
  Milestone,
  Roadmap,
  RoadmapTask,
  RoadmapVersion,
  SwimLane,
  TaskLink,
  TaskPriority,
  TaskStatus,
  ZoomLevel,
} from "@/types/roadmap";

type DbRoadmap = {
  id: string;
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  isLocked: boolean;
  isTemplate: boolean;
  templateKey: string | null;
  zoomLevel: string;
  createdAt: Date;
  updatedAt: Date;
  swimLanes: Array<{
    id: string;
    name: string;
    color: string;
    order: number;
    collapsed: boolean;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    description: string | null;
    startDate: Date;
    endDate: Date;
    color: string;
    icon: string | null;
    notes: string | null;
    tags: string[];
    links: unknown;
    priority: string;
    status: string;
    laneId: string;
  }>;
  milestones: Array<{
    id: string;
    title: string;
    date: Date;
    color: string;
    notes: string | null;
  }>;
};

export function mapRoadmapFromDb(db: DbRoadmap): Roadmap {
  return {
    id: db.id,
    title: db.title,
    description: db.description ?? undefined,
    startDate: db.startDate.toISOString(),
    endDate: db.endDate.toISOString(),
    isLocked: db.isLocked,
    isTemplate: db.isTemplate,
    templateKey: db.templateKey ?? undefined,
    zoomLevel: db.zoomLevel as ZoomLevel,
    swimLanes: [...db.swimLanes]
      .sort((a, b) => a.order - b.order)
      .map(
        (lane): SwimLane => ({
          id: lane.id,
          name: lane.name,
          color: lane.color,
          order: lane.order,
          collapsed: lane.collapsed,
        })
      ),
    tasks: db.tasks.map(
      (task): RoadmapTask => ({
        id: task.id,
        title: task.title,
        description: task.description ?? undefined,
        startDate: task.startDate.toISOString(),
        endDate: task.endDate.toISOString(),
        color: task.color,
        icon: task.icon ?? undefined,
        notes: task.notes ?? undefined,
        tags: task.tags,
        links: (task.links as TaskLink[]) ?? [],
        attachments: [],
        priority: task.priority as TaskPriority,
        status: task.status as TaskStatus,
        laneId: task.laneId,
        activity: [],
      })
    ),
    milestones: db.milestones.map(
      (ms): Milestone => ({
        id: ms.id,
        title: ms.title,
        date: ms.date.toISOString(),
        color: ms.color,
        notes: ms.notes ?? undefined,
      })
    ),
    createdAt: db.createdAt.toISOString(),
    updatedAt: db.updatedAt.toISOString(),
  };
}

export function mapVersionFromDb(v: {
  id: string;
  label: string;
  snapshot: unknown;
  roadmapId: string;
  createdAt: Date;
}): RoadmapVersion {
  return {
    id: v.id,
    label: v.label,
    snapshot: v.snapshot as Roadmap,
    roadmapId: v.roadmapId,
    createdAt: v.createdAt.toISOString(),
  };
}

export function mapActivityFromDb(data: unknown): ActivityEntry[] {
  if (!Array.isArray(data)) return [];
  return data as ActivityEntry[];
}
