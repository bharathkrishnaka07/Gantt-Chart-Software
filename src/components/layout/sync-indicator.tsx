"use client";

import { motion, AnimatePresence } from "motion/react";
import { Cloud, CloudOff, Loader2, Check } from "lucide-react";
import type { SyncStatus } from "@/lib/sync-client";
import { cn } from "@/lib/utils";

interface SyncIndicatorProps {
  status: SyncStatus;
  compact?: boolean;
}

export function SyncIndicator({ status, compact }: SyncIndicatorProps) {
  const config = {
    idle: { icon: Cloud, label: "Saved to cloud", className: "text-muted-foreground" },
    syncing: { icon: Loader2, label: "Saving…", className: "text-primary" },
    saved: { icon: Check, label: "Saved", className: "text-success" },
    error: { icon: CloudOff, label: "Save failed", className: "text-danger" },
  }[status];

  const Icon = config.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        className={cn(
          "flex items-center gap-2 text-xs font-medium",
          config.className,
          compact && "text-[11px]"
        )}
      >
        <Icon className={cn("h-3.5 w-3.5", status === "syncing" && "animate-spin")} />
        {!compact && <span>{config.label}</span>}
        {compact && <span className="truncate">{config.label}</span>}
      </motion.div>
    </AnimatePresence>
  );
}
