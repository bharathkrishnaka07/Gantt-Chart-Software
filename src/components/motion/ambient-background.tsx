"use client";

import { motion } from "motion/react";
import { heroOrbPaths } from "@/lib/motion/presets";

const ORBS = [
  { className: "top-[8%] left-[5%] w-72 h-72 bg-primary/20", path: heroOrbPaths[0] },
  { className: "top-[40%] right-[8%] w-96 h-96 bg-accent/15", path: heroOrbPaths[1] },
  { className: "bottom-[10%] left-[30%] w-64 h-64 bg-violet-400/10", path: heroOrbPaths[2] },
];

export function AmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl ${orb.className}`}
          animate={{
            x: orb.path.x,
            y: orb.path.y,
            scale: orb.path.scale,
          }}
          transition={{
            duration: orb.path.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <motion.div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(37,99,235,0.04) 0%, transparent 60%)",
        }}
        animate={{ opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
