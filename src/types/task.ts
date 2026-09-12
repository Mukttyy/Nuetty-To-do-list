export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskSchedule = "inbox" | "anytime" | "someday";
export type TaskPriority = "none" | "low" | "medium" | "high";
/** Compatibility aliases for the legacy view components while the UI is migrated. */
export type TaskView = TaskSchedule | "today" | "upcoming" | "unscheduled";
export type TaskProject = "none" | "personal" | "work";

export interface Section {
  id: string;
  name: string;
  position: number;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  icon?: string;
  archived: boolean;
  position: number;
  sections: Section[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface ActivityEntry {
  id: string;
  time: string;
  actor: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  status: TaskStatus;
  schedule?: TaskSchedule;
  priority?: TaskPriority;
  projectId?: string;
  sectionId?: string;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
  deletedAt?: string;
  /** Legacy fields retained only while existing demo data is migrated. */
  view?: "inbox" | "today" | "upcoming" | "someday" | "unscheduled" | "anytime";
  project?: "none" | "personal" | "work";
  projectEmoji?: string;
  projectName?: string;
  section?: string;
  dueDate?: string;
  dueBadge?: string;
  dueBadgeVariant?: "today" | "tomorrow" | "upcoming" | "someday" | "overdue";
  assigneeName: string;
  tags: string[];
  notes: string;
  subtasks: Subtask[];
  activity: ActivityEntry[];
  addedAgo?: string;
  categoryIconType?: "phone" | "calendar" | "doc" | "palette" | "utensil" | "dog" | "book";
  showFolderIcon?: boolean;
  category?: string;
  isDeleted?: boolean;
}
