export type ZoomLevel = "year" | "quarter" | "month" | "week";

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface TaskLink {
  id: string;
  url: string;
  label: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
  createdAt: string;
}

export interface ActivityEntry {
  id: string;
  action: string;
  timestamp: string;
  details?: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  color: string;
  icon?: string;
  notes?: string;
  tags: string[];
  links: TaskLink[];
  attachments: Attachment[];
  priority: TaskPriority;
  status: TaskStatus;
  laneId: string;
  activity: ActivityEntry[];
}

export interface SwimLane {
  id: string;
  name: string;
  color: string;
  order: number;
  collapsed: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  color: string;
  notes?: string;
}

export interface Roadmap {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  isLocked: boolean;
  isTemplate: boolean;
  templateKey?: string;
  zoomLevel: ZoomLevel;
  swimLanes: SwimLane[];
  tasks: RoadmapTask[];
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapVersion {
  id: string;
  label: string;
  snapshot: Roadmap;
  roadmapId: string;
  createdAt: string;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  upcomingMilestones: Milestone[];
  recentActivity: ActivityEntry[];
}

export type DragMode = "move" | "resize-start" | "resize-end" | null;

export interface GanttDragState {
  taskId: string;
  mode: DragMode;
  startX: number;
  originalStart: string;
  originalEnd: string;
  originalLaneId: string;
}

export interface TimelineColumn {
  key: string;
  label: string;
  start: Date;
  end: Date;
  width: number;
}

export interface TaskPosition {
  left: number;
  width: number;
  top: number;
  height: number;
}
