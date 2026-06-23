import { PrismaClient } from "@prisma/client";
import { createPMCareerRoadmap } from "../src/lib/templates";

const prisma = new PrismaClient();

async function main() {
  const template = createPMCareerRoadmap();
  template.isTemplate = false;

  const roadmap = await prisma.roadmap.create({
    data: {
      title: template.title,
      description: template.description,
      startDate: new Date(template.startDate),
      endDate: new Date(template.endDate),
      isTemplate: false,
      templateKey: "pm-career",
      zoomLevel: "month",
      swimLanes: {
        create: template.swimLanes.map((lane) => ({
          id: lane.id,
          name: lane.name,
          color: lane.color,
          order: lane.order,
        })),
      },
      milestones: {
        create: template.milestones.map((ms) => ({
          title: ms.title,
          date: new Date(ms.date),
          color: ms.color,
        })),
      },
    },
  });

  for (const task of template.tasks) {
    await prisma.task.create({
      data: {
        title: task.title,
        description: task.description,
        startDate: new Date(task.startDate),
        endDate: new Date(task.endDate),
        color: task.color,
        tags: task.tags,
        laneId: task.laneId,
        roadmapId: roadmap.id,
      },
    });
  }

  console.log("Seeded roadmap:", roadmap.title);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
