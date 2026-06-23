import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const roadmap = await prisma.roadmap.findUnique({
      where: { id },
      include: {
        swimLanes: { orderBy: { order: "asc" } },
        tasks: { include: { taskNotes: true, attachments: true } },
        milestones: true,
        versions: { orderBy: { createdAt: "desc" }, take: 10 },
      },
    });
    if (!roadmap) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(roadmap);
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const roadmap = await prisma.roadmap.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        isLocked: body.isLocked,
        zoomLevel: body.zoomLevel,
      },
    });
    return NextResponse.json(roadmap);
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.roadmap.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
