"use client";

import { motion } from "motion/react";
import { springCinematic, easeOutExpo } from "@/lib/motion/presets";
import { cn } from "@/lib/utils";

interface AnimatedProgressProps {
  value: number;
  className?: string;
  barClassName?: string;
  delay?: number;
  glow?: boolean;
}

export function AnimatedProgress({
  value,
  className,
  barClassName,
  delay = 0.2,
  glow = true,
}: AnimatedProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("relative h-1 rounded-full bg-muted overflow-hidden", className)}>
      <motion.div
        className={cn(
          "relative h-full rounded-full overflow-hidden",
          barClassName
        )}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ ...springCinematic, delay }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-400 to-accent" />
        {glow && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: delay + 0.5 }}
          />
        )}
      </motion.div>
      {glow && clamped > 0 && (
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary/40 blur-md pointer-events-none"
          initial={{ left: 0, opacity: 0 }}
          animate={{ left: `${clamped}%`, opacity: [0, 1, 0.6] }}
          transition={{ ...springCinematic, delay, left: { ...springCinematic, delay } }}
        />
      )}
    </div>
  );
}
