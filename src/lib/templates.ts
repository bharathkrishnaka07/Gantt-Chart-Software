import type { Roadmap, RoadmapTask, SwimLane, Milestone } from "@/types/roadmap";
import { generateId } from "@/lib/utils";

const JUNE_2026 = new Date(2026, 5, 1).toISOString();
const MARCH_2027 = new Date(2027, 2, 31).toISOString();

/** Month is 0-indexed (0 = January). Returns first/last day of month. */
function monthStart(year: number, month: number): Date {
  return new Date(year, month, 1);
}

function monthEnd(year: number, month: number): Date {
  return new Date(year, month + 1, 0);
}

function midMonth(year: number, month: number): Date {
  return new Date(year, month, 15);
}

function lane(id: string, name: string, order: number, color: string): SwimLane {
  return { id, name, color, order, collapsed: false };
}

function task(
  title: string,
  laneId: string,
  start: Date,
  end: Date,
  opts: Partial<RoadmapTask> = {}
): RoadmapTask {
  return {
    id: generateId(),
    title,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    color: opts.color ?? "#2563EB",
    tags: opts.tags ?? [],
    links: opts.links ?? [],
    attachments: opts.attachments ?? [],
    priority: opts.priority ?? "medium",
    status: opts.status ?? "todo",
    laneId,
    activity: opts.activity ?? [],
    description: opts.description,
    icon: opts.icon,
    notes: opts.notes,
  };
}

function milestone(title: string, date: Date, color = "#14B8A6"): Milestone {
  return {
    id: generateId(),
    title,
    date: date.toISOString(),
    color,
  };
}

export function createPMCareerRoadmap(): Roadmap {
  const s1 = lane("s1", "S1: Career Clarity", 0, "#6366F1");
  const s2 = lane("s2", "S2: Professional Development", 1, "#2563EB");
  const s3 = lane("s3", "S3: Employability", 2, "#14B8A6");
  const s4 = lane("s4", "S4: Networking", 3, "#F59E0B");
  const s5 = lane("s5", "S5: Personal & Future", 4, "#10B981");

  const now = new Date().toISOString();

  return {
    id: generateId(),
    title: "Project Management Career Roadmap",
    description:
      "Whiteboard roadmap — Jun 2026 to Mar 2027. S1 Career Clarity through S5 Personal & Future.",
    startDate: JUNE_2026,
    endDate: MARCH_2027,
    isLocked: false,
    isTemplate: true,
    templateKey: "pm-career",
    zoomLevel: "month",
    swimLanes: [s1, s2, s3, s4, s5],
    tasks: [
      // ── S1: Career Clarity ──
      task("Matt – PM, Oliver", s1.id, monthStart(2026, 5), monthEnd(2026, 5), {
        color: "#6366F1",
        description: "Mentor conversations with Matt (PM) and Oliver",
        tags: ["mentorship", "career-clarity"],
        priority: "high",
      }),

      // ── S2: Professional Development ──
      task("PMI", s2.id, monthStart(2026, 5), midMonth(2026, 6), {
        color: "#2563EB",
        tags: ["certification", "pmi"],
      }),
      task("Job Adverts", s2.id, monthStart(2026, 5), midMonth(2026, 6), {
        color: "#2563EB",
        description: "Review PM job advertisements",
        tags: ["research", "jobs"],
      }),
      task("Apply", s2.id, monthStart(2026, 5), monthEnd(2026, 6), {
        color: "#EF4444",
        description: "Active job applications",
        tags: ["applications"],
        priority: "high",
      }),
      task("Targeted Work", s2.id, midMonth(2026, 7), monthEnd(2027, 2), {
        color: "#2563EB",
        description: "Targeted work? — ongoing professional development through graduation",
        tags: ["continuous"],
      }),

      // ── S3: Employability ──
      task("Polish / Review PM Profiles · LinkedIn", s3.id, monthStart(2026, 5), midMonth(2026, 6), {
        color: "#14B8A6",
        tags: ["linkedin", "profiles"],
      }),
      task("Resume", s3.id, midMonth(2026, 6), monthEnd(2026, 7), {
        color: "#14B8A6",
        tags: ["resume"],
      }),
      task("Interviewing", s3.id, monthStart(2026, 8), monthEnd(2026, 10), {
        color: "#14B8A6",
        tags: ["interviews"],
      }),

      // ── S4: Networking ──
      task("PMI Group", s4.id, monthStart(2026, 5), monthEnd(2026, 6), {
        color: "#F59E0B",
        tags: ["pmi", "networking"],
      }),
      task("Research – PMI WA", s4.id, monthStart(2026, 5), monthEnd(2026, 6), {
        color: "#F59E0B",
        tags: ["research", "pmi-wa"],
      }),
      task("LinkedIn", s4.id, monthStart(2026, 7), monthEnd(2026, 7), {
        color: "#F59E0B",
        tags: ["linkedin"],
      }),
      task("Online Brand", s4.id, monthStart(2026, 8), monthEnd(2026, 8), {
        color: "#F59E0B",
        tags: ["brand"],
      }),

      // ── S5: Personal & Future ──
      task("Visa Graduate", s5.id, monthStart(2026, 10), monthEnd(2027, 1), {
        color: "#10B981",
        tags: ["visa", "graduate"],
      }),
      task("3-Year Roadmap", s5.id, monthStart(2026, 10), monthEnd(2027, 1), {
        color: "#10B981",
        description: "Long-term 3-year career roadmap planning",
        tags: ["planning"],
      }),
    ],
    milestones: [
      milestone("Clarity Checkpoint *", monthEnd(2026, 6), "#6366F1"),
      milestone("Clarity Checkpoint *", monthEnd(2026, 7), "#6366F1"),
      milestone("Major Milestone **", midMonth(2026, 10), "#6366F1"),
      milestone("Grad", midMonth(2026, 11), "#2563EB"),
    ],
    createdAt: now,
    updatedAt: now,
  };
}

export function createSoftwareEngineeringRoadmap(): Roadmap {
  const lanes = [
    lane("se1", "S1: Core Skills", 0, "#2563EB"),
    lane("se2", "S2: Projects", 1, "#14B8A6"),
    lane("se3", "S3: Open Source", 2, "#10B981"),
    lane("se4", "S4: Networking", 3, "#F59E0B"),
    lane("se5", "S5: Career Growth", 4, "#8B5CF6"),
  ];
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: "Software Engineering Roadmap",
    description: "Path to senior software engineer",
    startDate: JUNE_2026,
    endDate: MARCH_2027,
    isLocked: false,
    isTemplate: true,
    templateKey: "software-engineering",
    zoomLevel: "month",
    swimLanes: lanes,
    tasks: [
      task("System Design Study", lanes[0].id, new Date(2026, 5, 1), new Date(2026, 8, 30), { color: "#2563EB" }),
      task("Portfolio Project", lanes[1].id, new Date(2026, 6, 1), new Date(2026, 10, 30), { color: "#14B8A6" }),
      task("Contribute to OSS", lanes[2].id, new Date(2026, 7, 1), new Date(2027, 2, 31), { color: "#10B981" }),
      task("Tech Meetups", lanes[3].id, new Date(2026, 5, 1), new Date(2027, 2, 31), { color: "#F59E0B" }),
      task("Leadership Training", lanes[4].id, new Date(2026, 9, 1), new Date(2027, 2, 31), { color: "#8B5CF6" }),
    ],
    milestones: [
      milestone("First OSS PR Merged", new Date(2026, 8, 1)),
      milestone("Senior Role Interview", new Date(2027, 0, 1)),
    ],
    createdAt: now,
    updatedAt: now,
  };
}

export function createDataScienceRoadmap(): Roadmap {
  const lanes = [
    lane("ds1", "S1: Foundations", 0, "#2563EB"),
    lane("ds2", "S2: ML Projects", 1, "#14B8A6"),
    lane("ds3", "S3: Portfolio", 2, "#10B981"),
    lane("ds4", "S4: Community", 3, "#F59E0B"),
    lane("ds5", "S5: Specialization", 4, "#8B5CF6"),
  ];
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: "Data Science Roadmap",
    description: "Build data science career foundations",
    startDate: JUNE_2026,
    endDate: MARCH_2027,
    isLocked: false,
    isTemplate: true,
    templateKey: "data-science",
    zoomLevel: "month",
    swimLanes: lanes,
    tasks: [
      task("Statistics Refresher", lanes[0].id, new Date(2026, 5, 1), new Date(2026, 7, 31), { color: "#2563EB" }),
      task("Kaggle Competitions", lanes[1].id, new Date(2026, 7, 1), new Date(2027, 2, 31), { color: "#14B8A6" }),
      task("Build ML Portfolio", lanes[2].id, new Date(2026, 8, 1), new Date(2027, 1, 28), { color: "#10B981" }),
      task("Join DS Community", lanes[3].id, new Date(2026, 5, 15), new Date(2026, 8, 30), { color: "#F59E0B" }),
      task("Deep Learning Specialization", lanes[4].id, new Date(2026, 9, 1), new Date(2027, 2, 31), { color: "#8B5CF6" }),
    ],
    milestones: [milestone("First Kaggle Medal", new Date(2026, 10, 1))],
    createdAt: now,
    updatedAt: now,
  };
}

export function createProductManagementRoadmap(): Roadmap {
  const lanes = [
    lane("pm1", "S1: Product Skills", 0, "#2563EB"),
    lane("pm2", "S2: User Research", 1, "#14B8A6"),
    lane("pm3", "S3: Strategy", 2, "#10B981"),
    lane("pm4", "S4: Stakeholders", 3, "#F59E0B"),
    lane("pm5", "S5: Launch", 4, "#8B5CF6"),
  ];
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: "Product Management Roadmap",
    description: "Transition into product management",
    startDate: JUNE_2026,
    endDate: MARCH_2027,
    isLocked: false,
    isTemplate: true,
    templateKey: "product-management",
    zoomLevel: "month",
    swimLanes: lanes,
    tasks: [
      task("PM Fundamentals Course", lanes[0].id, new Date(2026, 5, 1), new Date(2026, 7, 31), { color: "#2563EB" }),
      task("User Interview Practice", lanes[1].id, new Date(2026, 7, 1), new Date(2026, 9, 30), { color: "#14B8A6" }),
      task("Product Strategy Framework", lanes[2].id, new Date(2026, 8, 1), new Date(2026, 11, 31), { color: "#10B981" }),
      task("Stakeholder Mapping", lanes[3].id, new Date(2026, 6, 1), new Date(2026, 8, 30), { color: "#F59E0B" }),
      task("Launch Side Project", lanes[4].id, new Date(2026, 10, 1), new Date(2027, 2, 31), { color: "#8B5CF6" }),
    ],
    milestones: [milestone("First Product Launch", new Date(2027, 1, 15))],
    createdAt: now,
    updatedAt: now,
  };
}

export function createGraduateCareerRoadmap(): Roadmap {
  const lanes = [
    lane("g1", "S1: Career Exploration", 0, "#2563EB"),
    lane("g2", "S2: Skills Building", 1, "#14B8A6"),
    lane("g3", "S3: Applications", 2, "#10B981"),
    lane("g4", "S4: Networking", 3, "#F59E0B"),
    lane("g5", "S5: Life Planning", 4, "#8B5CF6"),
  ];
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: "Graduate Career Planning",
    description: "Plan your first career steps after graduation",
    startDate: JUNE_2026,
    endDate: MARCH_2027,
    isLocked: false,
    isTemplate: true,
    templateKey: "graduate-career",
    zoomLevel: "month",
    swimLanes: lanes,
    tasks: [
      task("Career Assessment", lanes[0].id, new Date(2026, 5, 1), new Date(2026, 7, 31), { color: "#2563EB" }),
      task("Skill Development Plan", lanes[1].id, new Date(2026, 6, 1), new Date(2026, 10, 30), { color: "#14B8A6" }),
      task("Graduate Job Applications", lanes[2].id, new Date(2026, 8, 1), new Date(2027, 2, 31), { color: "#10B981" }),
      task("Alumni Networking", lanes[3].id, new Date(2026, 5, 15), new Date(2026, 9, 30), { color: "#F59E0B" }),
      task("Visa & Relocation Planning", lanes[4].id, new Date(2026, 10, 1), new Date(2027, 2, 31), { color: "#8B5CF6" }),
    ],
    milestones: [
      milestone("Graduation", new Date(2026, 11, 15)),
      milestone("First Job Offer", new Date(2027, 1, 1)),
    ],
    createdAt: now,
    updatedAt: now,
  };
}

export const TEMPLATES: Record<string, () => Roadmap> = {
  "pm-career": createPMCareerRoadmap,
  "software-engineering": createSoftwareEngineeringRoadmap,
  "data-science": createDataScienceRoadmap,
  "product-management": createProductManagementRoadmap,
  "graduate-career": createGraduateCareerRoadmap,
};

export function duplicateRoadmap(roadmap: Roadmap, asTemplate = false): Roadmap {
  const laneIdMap = new Map<string, string>();
  const now = new Date().toISOString();

  const swimLanes = roadmap.swimLanes.map((l) => {
    const newId = generateId();
    laneIdMap.set(l.id, newId);
    return { ...l, id: newId };
  });

  return {
    ...roadmap,
    id: generateId(),
    title: asTemplate ? roadmap.title : `${roadmap.title} (Copy)`,
    isTemplate: asTemplate,
    isLocked: false,
    swimLanes,
    tasks: roadmap.tasks.map((t) => ({
      ...t,
      id: generateId(),
      laneId: laneIdMap.get(t.laneId) ?? t.laneId,
      activity: [],
    })),
    milestones: roadmap.milestones.map((m) => ({ ...m, id: generateId() })),
    createdAt: now,
    updatedAt: now,
  };
}

export function createBlankRoadmap(title = "Untitled Roadmap"): Roadmap {
  const now = new Date().toISOString();
  const s1 = lane(generateId(), "S1: New Lane", 0, "#2563EB");
  return {
    id: generateId(),
    title,
    startDate: JUNE_2026,
    endDate: MARCH_2027,
    isLocked: false,
    isTemplate: false,
    zoomLevel: "month",
    swimLanes: [s1],
    tasks: [],
    milestones: [],
    createdAt: now,
    updatedAt: now,
  };
}
