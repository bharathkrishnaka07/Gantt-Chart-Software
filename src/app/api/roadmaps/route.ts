import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const roadmaps = await prisma.roadmap.findMany({
      include: {
        swimLanes: { orderBy: { order: "asc" } },
        tasks: true,
        milestones: true,
      },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(roadmaps);
  } catch {
    return NextResponse.json(
      { error: "Database unavailable. Using client-side storage." },
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const roadmap = await prisma.roadmap.create({
      data: {
        title: body.title,
        description: body.description,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        swimLanes: {
          create: body.swimLanes?.map((lane: { name: string; color: string; order: number }, i: number) => ({
            name: lane.name,
            color: lane.color,
            order: lane.order ?? i,
          })),
        },
      },
      include: { swimLanes: true, tasks: true, milestones: true },
    });
    return NextResponse.json(roadmap, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
