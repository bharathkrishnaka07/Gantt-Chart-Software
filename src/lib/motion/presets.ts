import type { Transition, Variants } from "motion/react";

/** Tight, responsive — buttons & chips */
export const springMicro: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 28,
};

/** Default UI motion */
export const springSnappy: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 30,
};

/** Soft surfaces — panels, pages */
export const springSoft: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 28,
};

/** Cinematic overshoot — hero, cards, gantt lanes */
export const springCinematic: Transition = {
  type: "spring",
  stiffness: 180,
  damping: 22,
  mass: 0.9,
};

/** Bouncy delight — milestones, badges */
export const springBouncy: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 18,
};

export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88, filter: "blur(8px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40, filter: "blur(4px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)" },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40, filter: "blur(4px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)" },
};

/** Orchestrated children — dashboard sections */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.02 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springCinematic,
  },
};

/** Gantt lane rows — slide from left with overshoot */
export const laneReveal: Variants = {
  hidden: { opacity: 0, x: -48, scaleX: 0.94 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    scaleX: 1,
    transition: {
      ...springCinematic,
      delay: i * 0.07,
    },
  }),
};

/** Task bars — pop in from scale */
export const taskPop: Variants = {
  hidden: { opacity: 0, scaleX: 0, scaleY: 0.6, originX: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    scaleX: 1,
    scaleY: 1,
    transition: { ...springBouncy, delay },
  }),
};

/** Timeline columns */
export const columnReveal: Variants = {
  hidden: { opacity: 0, scaleY: 0, originY: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scaleY: 1,
    transition: { ...springSoft, delay: i * 0.02 },
  }),
};

export const cardHover3d = {
  rest: { scale: 1, rotateX: 0, rotateY: 0 },
  hover: { scale: 1.02, transition: springMicro },
};

export const pageEnter = {
  initial: { opacity: 0, y: 24, scale: 0.98, filter: "blur(12px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: -16, scale: 1.01, filter: "blur(8px)" },
  transition: springCinematic,
};

export const presentationEnter = {
  initial: { opacity: 0, scale: 0.92, clipPath: "inset(8% 6% 8% 6% round 24px)" },
  animate: { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 0px)" },
  exit: { opacity: 0, scale: 0.96, clipPath: "inset(4% 4% 4% 4% round 16px)" },
  transition: { duration: 0.55, ease: easeOutExpo },
};

export const heroOrbPaths = [
  { x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.15, 0.95, 1], duration: 18 },
  { x: [0, -50, 30, 0], y: [0, 30, -30, 0], scale: [1, 0.9, 1.1, 1], duration: 22 },
  { x: [0, 40, -30, 0], y: [0, 50, -20, 0], scale: [1, 1.2, 0.85, 1], duration: 26 },
];
