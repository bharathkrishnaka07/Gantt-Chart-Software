"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { AppSyncPayload } from "@/lib/db/roadmap-service";
import { loadAppState, saveAppState } from "@/lib/db/roadmap-service";

export async function fetchRoadmapState(): Promise<AppSyncPayload> {
  return loadAppState();
}

export async function persistRoadmapState(state: AppSyncPayload) {
  await saveAppState(state);
  revalidatePath("/");
  revalidatePath("/roadmap/[id]", "page");
}

export async function deleteRoadmapAction(id: string) {
  await prisma.roadmap.delete({ where: { id } });
  revalidatePath("/");
}

export async function updateRoadmapMeta(
  id: string,
  data: {
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    isLocked?: boolean;
    zoomLevel?: string;
  }
) {
  await prisma.roadmap.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      isLocked: data.isLocked,
      zoomLevel: data.zoomLevel,
    },
  });
  revalidatePath(`/roadmap/${id}`);
  revalidatePath("/");
}
