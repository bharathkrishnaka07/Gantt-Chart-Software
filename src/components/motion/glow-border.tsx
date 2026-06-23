"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlowBorderProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}

/** Animated conic-gradient border — premium hero/card wrapper */
export function GlowBorder({ children, className, innerClassName }: GlowBorderProps) {
  return (
    <div className={cn("relative rounded-[1.35rem] p-[1.5px] overflow-hidden", className)}>
      <motion.div
        className="absolute inset-[-100%] opacity-70"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0%, #2563eb 15%, #14b8a6 35%, transparent 50%, #2563eb 65%, #14b8a6 85%, transparent 100%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <div
        className={cn(
          "relative rounded-[1.25rem] bg-white/90 backdrop-blur-xl h-full",
          innerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
