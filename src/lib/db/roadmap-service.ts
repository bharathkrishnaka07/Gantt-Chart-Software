import { prisma } from "@/lib/prisma";
import type { ActivityEntry, Roadmap, RoadmapVersion } from "@/types/roadmap";
import { mapActivityFromDb, mapRoadmapFromDb, mapVersionFromDb } from "./mappers";

export interface AppSyncPayload {
  roadmaps: Roadmap[];
  activeRoadmapId: string | null;
  versions: RoadmapVersion[];
  recentActivity: ActivityEntry[];
}

export async function loadAppState(): Promise<AppSyncPayload> {
  const [roadmaps, appState, versions] = await Promise.all([
    prisma.roadmap.findMany({
      include: {
        swimLanes: { orderBy: { order: "asc" } },
        tasks: true,
        milestones: true,
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.appState.findUnique({ where: { id: "global" } }),
    prisma.roadmapVersion.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return {
    roadmaps: roadmaps.map(mapRoadmapFromDb),
    activeRoadmapId: appState?.activeRoadmapId ?? roadmaps[0]?.id ?? null,
    versions: versions.map(mapVersionFromDb),
    recentActivity: mapActivityFromDb(appState?.recentActivity),
  };
}

async function upsertRoadmap(roadmap: Roadmap) {
  await prisma.roadmap.upsert({
    where: { id: roadmap.id },
    create: {
      id: roadmap.id,
      title: roadmap.title,
      description: roadmap.description,
      startDate: new Date(roadmap.startDate),
      endDate: new Date(roadmap.endDate),
      isLocked: roadmap.isLocked,
      isTemplate: roadmap.isTemplate,
      templateKey: roadmap.templateKey,
      zoomLevel: roadmap.zoomLevel,
      createdAt: new Date(roadmap.createdAt),
      updatedAt: new Date(roadmap.updatedAt),
    },
    update: {
      title: roadmap.title,
      description: roadmap.description,
      startDate: new Date(roadmap.startDate),
      endDate: new Date(roadmap.endDate),
      isLocked: roadmap.isLocked,
      isTemplate: roadmap.isTemplate,
      templateKey: roadmap.templateKey,
      zoomLevel: roadmap.zoomLevel,
      updatedAt: new Date(roadmap.updatedAt),
    },
  });

  const laneIds = roadmap.swimLanes.map((l) => l.id);
  await prisma.swimLane.deleteMany({
    where: { roadmapId: roadmap.id, id: { notIn: laneIds.length ? laneIds : ["__none__"] } },
  });

  for (const lane of roadmap.swimLanes) {
    await prisma.swimLane.upsert({
      where: { id: lane.id },
      create: {
        id: lane.id,
        name: lane.name,
        color: lane.color,
        order: lane.order,
        collapsed: lane.collapsed,
        roadmapId: roadmap.id,
      },
      update: {
        name: lane.name,
        color: lane.color,
        order: lane.order,
        collapsed: lane.collapsed,
      },
    });
  }

  const taskIds = roadmap.tasks.map((t) => t.id);
  await prisma.task.deleteMany({
    where: { roadmapId: roadmap.id, id: { notIn: taskIds.length ? taskIds : ["__none__"] } },
  });

  for (const task of roadmap.tasks) {
    await prisma.task.upsert({
      where: { id: task.id },
      create: {
        id: task.id,
        title: task.title,
        description: task.description,
        startDate: new Date(task.startDate),
        endDate: new Date(task.endDate),
        color: task.color,
        icon: task.icon,
        notes: task.notes,
        tags: task.tags,
        links: JSON.parse(JSON.stringify(task.links)),
        priority: task.priority,
        status: task.status,
        laneId: task.laneId,
        roadmapId: roadmap.id,
      },
      update: {
        title: task.title,
        description: task.description,
        startDate: new Date(task.startDate),
        endDate: new Date(task.endDate),
        color: task.color,
        icon: task.icon,
        notes: task.notes,
        tags: task.tags,
        links: JSON.parse(JSON.stringify(task.links)),
        priority: task.priority,
        status: task.status,
        laneId: task.laneId,
      },
    });
  }

  const milestoneIds = roadmap.milestones.map((m) => m.id);
  await prisma.milestone.deleteMany({
    where: {
      roadmapId: roadmap.id,
      id: { notIn: milestoneIds.length ? milestoneIds : ["__none__"] },
    },
  });

  for (const ms of roadmap.milestones) {
    await prisma.milestone.upsert({
      where: { id: ms.id },
      create: {
        id: ms.id,
        title: ms.title,
        date: new Date(ms.date),
        color: ms.color,
        notes: ms.notes,
        roadmapId: roadmap.id,
      },
      update: {
        title: ms.title,
        date: new Date(ms.date),
        color: ms.color,
        notes: ms.notes,
      },
    });
  }
}

export async function saveAppState(payload: AppSyncPayload) {
  const incomingIds = payload.roadmaps.map((r) => r.id);
  await prisma.roadmap.deleteMany({
    where: { id: { notIn: incomingIds.length ? incomingIds : ["__none__"] } },
  });

  for (const roadmap of payload.roadmaps) {
    await upsertRoadmap(roadmap);
  }

  const versionIds = payload.versions.map((v) => v.id);
  await prisma.roadmapVersion.deleteMany({
    where: { id: { notIn: versionIds.length ? versionIds : ["__none__"] } },
  });

  for (const version of payload.versions) {
    await prisma.roadmapVersion.upsert({
      where: { id: version.id },
      create: {
        id: version.id,
        label: version.label,
        snapshot: JSON.parse(JSON.stringify(version.snapshot)),
        roadmapId: version.roadmapId,
        createdAt: new Date(version.createdAt),
      },
      update: {
        label: version.label,
        snapshot: JSON.parse(JSON.stringify(version.snapshot)),
      },
    });
  }

  await prisma.appState.upsert({
    where: { id: "global" },
    create: {
      id: "global",
      activeRoadmapId: payload.activeRoadmapId,
      recentActivity: JSON.parse(JSON.stringify(payload.recentActivity)),
    },
    update: {
      activeRoadmapId: payload.activeRoadmapId,
      recentActivity: JSON.parse(JSON.stringify(payload.recentActivity)),
    },
  });
}

export async function deleteRoadmapFromDb(id: string) {
  await prisma.roadmap.delete({ where: { id } });
}
