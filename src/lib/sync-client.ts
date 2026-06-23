"use client";

import type { AppSyncPayload } from "@/lib/db/roadmap-service";

let syncTimer: ReturnType<typeof setTimeout> | null = null;
let syncInFlight = false;
let pendingSync = false;

export async function fetchAppState(): Promise<AppSyncPayload | null> {
  try {
    const res = await fetch("/api/sync", { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function pushAppState(state: AppSyncPayload): Promise<boolean> {
  try {
    const res = await fetch("/api/sync", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function scheduleSyncToServer(getState: () => AppSyncPayload) {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(async () => {
    if (syncInFlight) {
      pendingSync = true;
      return;
    }
    syncInFlight = true;
    const ok = await pushAppState(getState());
    syncInFlight = false;
    if (!ok) {
      console.warn("Failed to sync roadmap data to server");
    }
    if (pendingSync) {
      pendingSync = false;
      scheduleSyncToServer(getState);
    }
  }, 600);
}
