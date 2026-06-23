"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "motion/react";
import { springMicro } from "@/lib/motion/presets";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  intensity?: number;
}

export function TiltCard({
  children,
  className,
  glow = true,
  intensity = 12,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), springMicro);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), springMicro);
  const glareX = useSpring(useTransform(x, [-0.5, 0.5], [15, 85]), springMicro);
  const glareY = useSpring(useTransform(y, [-0.5, 0.5], [15, 85]), springMicro);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(37,99,235,0.25) 0%, rgba(20,184,166,0.12) 35%, transparent 65%)`;

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cn("relative group", className)}
      style={{ perspective: 1200 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.02, z: 20 }}
        transition={springMicro}
        className="relative h-full"
      >
        {glow && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ background: glareBg }}
          />
        )}
        {children}
      </motion.div>
    </motion.div>
  );
}
