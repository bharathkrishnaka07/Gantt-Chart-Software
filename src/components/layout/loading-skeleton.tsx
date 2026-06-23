"use client";

import { motion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import { staggerContainer, staggerItem } from "@/lib/motion/presets";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block w-64 border-r border-border/60 p-5 space-y-4">
        <Skeleton className="h-9 w-full rounded-xl" />
        <Skeleton className="h-8 w-full rounded-lg" />
        <Skeleton className="h-8 w-full rounded-lg" />
        <div className="space-y-2 pt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded-lg" />
          ))}
        </div>
      </div>
      <motion.div
        className="flex-1 p-8 space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={staggerItem}>
          <Skeleton className="h-32 w-full rounded-2xl" />
        </motion.div>
        <motion.div variants={staggerItem} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </motion.div>
        <motion.div variants={staggerItem} className="grid grid-cols-3 gap-4">
          <Skeleton className="h-48 col-span-2 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </motion.div>
        <motion.div variants={staggerItem} className="grid grid-cols-2 gap-4">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </motion.div>
      </motion.div>
    </div>
  );
}
