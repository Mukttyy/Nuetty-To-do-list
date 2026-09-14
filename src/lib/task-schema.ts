import { z } from "zod";

const sectionSchema = z.object({
  id: z.string().min(1).max(200),
  name: z.string().trim().min(1).max(100),
  position: z.number().int().nonnegative(),
}).strict();

export const projectSchema = z.object({
  id: z.string().min(1).max(200),
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(280).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  icon: z.string().max(50).optional(),
  archived: z.boolean(),
  position: z.number().int().nonnegative(),
  sections: z.array(sectionSchema).max(100),
}).strict().superRefine((project, context) => {
  const ids = new Set<string>();
  const names = new Set<string>();
  for (const section of project.sections) {
    const normalizedName = section.name.toLocaleLowerCase();
    if (ids.has(section.id)) {
      context.addIssue({ code: "custom", message: `Duplicate section id: ${section.id}` });
    }
    if (names.has(normalizedName)) {
      context.addIssue({ code: "custom", message: `Duplicate section name: ${section.name}` });
    }
    ids.add(section.id);
    names.add(normalizedName);
  }
});

const subtaskSchema = z.object({
  id: z.string().min(1).max(200),
  title: z.string().trim().min(1).max(500),
  completed: z.boolean(),
});

const activitySchema = z.object({
  id: z.string().min(1).max(200),
  time: z.string().max(100),
  actor: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
});

export const taskSchema = z.object({
  id: z.string().min(1).max(200),
  title: z.string().trim().min(1).max(500),
  completed: z.boolean(),
  status: z.enum(["todo", "in_progress", "done"]),
  schedule: z.enum(["inbox", "anytime", "someday"]).optional(),
  priority: z.enum(["none", "low", "medium", "high"]).optional(),
  projectId: z.string().min(1).max(200).optional(),
  sectionId: z.string().min(1).max(200).optional(),
  createdAt: z.string().datetime({ offset: true }).optional(),
  updatedAt: z.string().datetime({ offset: true }).optional(),
  completedAt: z.string().datetime({ offset: true }).optional(),
  deletedAt: z.string().datetime({ offset: true }).optional(),
  view: z.enum(["inbox", "today", "upcoming", "someday", "unscheduled", "anytime"]).optional(),
  project: z.enum(["none", "personal", "work"]).optional(),
  projectEmoji: z.string().max(20).optional(),
  projectName: z.string().max(100).optional(),
  section: z.string().max(200).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dueBadge: z.string().max(200).optional(),
  dueBadgeVariant: z.enum(["today", "tomorrow", "upcoming", "someday", "overdue"]).optional(),
  assigneeName: z.string().min(1).max(200),
  tags: z.array(z.string().min(1).max(100)).max(50),
  notes: z.string().max(20_000),
  subtasks: z.array(subtaskSchema).max(500),
  activity: z.array(activitySchema).max(1000),
  addedAgo: z.string().max(100).optional(),
  categoryIconType: z.enum(["phone", "calendar", "doc", "palette", "utensil", "dog", "book"]).optional(),
  showFolderIcon: z.boolean().optional(),
  category: z.string().max(200).optional(),
  isDeleted: z.boolean().optional(),
}).strict().superRefine((task, context) => {
  if (task.completed !== (task.status === "done")) {
    context.addIssue({
      code: "custom",
      path: ["status"],
      message: "Completion and status are inconsistent.",
    });
  }

  for (const collection of [task.subtasks, task.activity]) {
    const ids = new Set<string>();
    for (const item of collection) {
      if (ids.has(item.id)) {
        context.addIssue({ code: "custom", message: `Duplicate nested id: ${item.id}` });
      }
      ids.add(item.id);
    }
  }
});

export const taskListSchema = z.array(taskSchema).max(500).superRefine((tasks, context) => {
  const ids = new Set<string>();
  for (const task of tasks) {
    if (ids.has(task.id)) {
      context.addIssue({ code: "custom", message: `Duplicate task id: ${task.id}` });
    }
    ids.add(task.id);
  }
});

export const taskCollectionSchema = z.object({
  tasks: taskListSchema,
  projects: z.array(projectSchema).max(100).default([]).superRefine((projects, context) => {
    const ids = new Set<string>();
    const names = new Set<string>();
    for (const project of projects) {
      const normalizedName = project.name.toLocaleLowerCase();
      if (ids.has(project.id)) {
        context.addIssue({ code: "custom", message: `Duplicate project id: ${project.id}` });
      }
      if (names.has(normalizedName)) {
        context.addIssue({ code: "custom", message: `Duplicate project name: ${project.name}` });
      }
      ids.add(project.id);
      names.add(normalizedName);
    }
  }),
  revision: z.number().int().nonnegative(),
}).strict().superRefine((workspace, context) => {
  const projectIds = new Set(workspace.projects.map((project) => project.id));
  const sectionOwners = new Map<string, string>();
  for (const project of workspace.projects) {
    for (const section of project.sections) {
      if (sectionOwners.has(section.id)) {
        context.addIssue({ code: "custom", path: ["projects"], message: `Section id is not unique: ${section.id}` });
      }
      sectionOwners.set(section.id, project.id);
    }
  }
  for (const [index, task] of workspace.tasks.entries()) {
    if (task.projectId && !projectIds.has(task.projectId)) {
      context.addIssue({ code: "custom", path: ["tasks", index, "projectId"], message: "Project does not exist." });
    }
    if (task.sectionId && sectionOwners.get(task.sectionId) !== task.projectId) {
      context.addIssue({ code: "custom", path: ["tasks", index, "sectionId"], message: "Section does not belong to the selected project." });
    }
  }
});

export const taskMutationSchema = taskCollectionSchema;

export const taskSaveResponseSchema = z.object({
  ok: z.literal(true),
  revision: z.number().int().nonnegative(),
}).strict();

export const taskConflictResponseSchema = z.object({
  error: z.string(),
  revision: z.number().int().nonnegative(),
}).strict();
