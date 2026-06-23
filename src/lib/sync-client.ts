"use client";

import type { AppSyncPayload } from "@/lib/db/roadmap-service";

export type SyncStatus = "idle" | "syncing" | "saved" | "error";

let syncTimer: ReturnType<typeof setTimeout> | null = null;
let syncInFlight = false;
let pendingSync = false;
let onStatusChange: ((status: SyncStatus) => void) | null = null;

export function setSyncStatusListener(listener: ((status: SyncStatus) => void) | null) {
  onStatusChange = listener;
}

function setStatus(status: SyncStatus) {
  onStatusChange?.(status);
}

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
    setStatus("syncing");
    const res = await fetch("/api/sync", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
    if (!res.ok) {
      setStatus("error");
      return false;
    }
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2000);
    return true;
  } catch {
    setStatus("error");
    return false;
  }
}

export function scheduleSyncToServer(getState: () => AppSyncPayload, immediate = false) {
  if (syncTimer) clearTimeout(syncTimer);
  const delay = immediate ? 0 : 500;
  syncTimer = setTimeout(async () => {
    if (syncInFlight) {
      pendingSync = true;
      return;
    }
    syncInFlight = true;
    await pushAppState(getState());
    syncInFlight = false;
    if (pendingSync) {
      pendingSync = false;
      scheduleSyncToServer(getState);
    }
  }, delay);
}

export async function forceSyncToServer(getState: () => AppSyncPayload): Promise<boolean> {
  if (syncTimer) clearTimeout(syncTimer);
  return pushAppState(getState());
}
