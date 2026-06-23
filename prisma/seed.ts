import { PrismaClient } from "@prisma/client";
import { createPMCareerRoadmap } from "../src/lib/templates";

const prisma = new PrismaClient();

async function main() {
  console.log("Removing existing pm-career roadmaps…");

  await prisma.roadmap.deleteMany({
    where: { templateKey: "pm-career" },
  });

  const template = createPMCareerRoadmap();

  const roadmap = await prisma.$transaction(async (tx) => {
    const created = await tx.roadmap.create({
      data: {
        title: template.title,
        description: template.description,
        startDate: new Date(template.startDate),
        endDate: new Date(template.endDate),
        isLocked: false,
        isTemplate: false,
        templateKey: "pm-career",
        zoomLevel: template.zoomLevel,
        swimLanes: {
          create: template.swimLanes.map((lane) => ({
            name: lane.name,
            color: lane.color,
            order: lane.order,
            collapsed: lane.collapsed,
          })),
        },
        milestones: {
          create: template.milestones.map((ms) => ({
            title: ms.title,
            date: new Date(ms.date),
            color: ms.color,
            notes: ms.notes,
          })),
        },
      },
      include: {
        swimLanes: { orderBy: { order: "asc" } },
      },
    });

    const laneIdMap = new Map(
      template.swimLanes.map((lane, index) => [lane.id, created.swimLanes[index].id])
    );

    if (template.tasks.length > 0) {
      await tx.task.createMany({
        data: template.tasks.map((task) => ({
          title: task.title,
          description: task.description,
          startDate: new Date(task.startDate),
          endDate: new Date(task.endDate),
          color: task.color,
          tags: task.tags,
          priority: task.priority,
          status: task.status,
          laneId: laneIdMap.get(task.laneId)!,
          roadmapId: created.id,
        })),
      });
    }

    await tx.appState.upsert({
      where: { id: "global" },
      create: {
        id: "global",
        activeRoadmapId: created.id,
        recentActivity: [],
      },
      update: {
        activeRoadmapId: created.id,
      },
    });

    return created;
  });

  console.log(`Seeded roadmap: "${roadmap.title}" (${roadmap.id})`);
  console.log(`  ${template.tasks.length} tasks · ${template.milestones.length} milestones · 5 swim lanes`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
