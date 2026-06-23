"use client";

import { motion } from "motion/react";
import { springCinematic } from "@/lib/motion/presets";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "p" | "span";
  delay?: number;
  by?: "word" | "char";
}

export function TextReveal({
  text,
  className,
  as: Tag = "h1",
  delay = 0,
  by = "word",
}: TextRevealProps) {
  const units = by === "word" ? text.split(" ") : text.split("");

  return (
    <Tag className={cn("overflow-hidden", className)}>
      {units.map((unit, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", rotateX: -80, opacity: 0 }}
            animate={{ y: 0, rotateX: 0, opacity: 1 }}
            transition={{
              ...springCinematic,
              delay: delay + i * (by === "word" ? 0.07 : 0.025),
            }}
            style={{ transformOrigin: "bottom center", perspective: 800 }}
          >
            {unit}
            {by === "word" && i < units.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
