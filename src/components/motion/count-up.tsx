"use client";

import { useEffect, useState } from "react";
import { animate, motion, useMotionValue } from "motion/react";
import { easeOutExpo } from "@/lib/motion/presets";

interface CountUpProps {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}

export function CountUp({ value, suffix = "", className, duration = 1.4 }: CountUpProps) {
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration,
      ease: easeOutExpo,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, motionVal, duration]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: easeOutExpo }}
    >
      {display}
      {suffix}
    </motion.span>
  );
}
