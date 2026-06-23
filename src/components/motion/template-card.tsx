"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { springBouncy, springCinematic } from "@/lib/motion/presets";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  name: string;
  description: string;
  colorClass: string;
  onClick: () => void;
  index: number;
}

export function TemplateCard({
  name,
  description,
  colorClass,
  onClick,
  index,
}: TemplateCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 32, rotateX: -15, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      transition={{ ...springCinematic, delay: index * 0.07 }}
      whileHover={{
        y: -8,
        scale: 1.03,
        rotateX: 4,
        boxShadow: "0 20px 48px rgba(37, 99, 235, 0.18), 0 0 0 1px rgba(37,99,235,0.1)",
      }}
      whileTap={{ scale: 0.97, rotateX: 0 }}
      style={{ transformPerspective: 800 }}
      className={cn(
        "relative text-left p-4 rounded-xl border bg-gradient-to-br overflow-hidden group",
        colorClass
      )}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/30 blur-2xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
      />
      <p className="relative font-semibold text-sm">{name}</p>
      <p className="relative text-xs text-muted-foreground mt-1.5 leading-relaxed">{description}</p>
      <motion.span
        className="absolute bottom-3 right-3 inline-flex items-center gap-1 text-[10px] font-semibold text-primary opacity-0 group-hover:opacity-100"
        initial={false}
        transition={springBouncy}
      >
        Use template
        <ArrowRight className="h-3 w-3" />
      </motion.span>
    </motion.button>
  );
}
