"use client";

import * as React from "react";
import { playCompleteSound } from "@/lib/sound";
import { useTaskSync } from "@/lib/use-task-sync";
import type { ActivityEntry, Project, Subtask, Task, TaskPriority, TaskSchedule, TaskStatus } from "@/types/task";

export type { TaskSyncStatus } from "@/lib/use-task-sync";

function createEntityId(prefix: "task" | "sub" | "act" | "project" | "section"): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatCurrentTime(): string {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date());
}

function activity(actor: string, description: string): ActivityEntry {
  return { id: createEntityId("act"), time: formatCurrentTime(), actor, description };
}

export function taskSchedule(task: Task): TaskSchedule {
  if (task.schedule) return task.schedule;
  if (task.view === "inbox") return "inbox";
  if (task.view === "someday") return "someday";
  return "anytime";
}

export function useTasks(actorName = "Current user") {
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null);
  const [lastDeletedTaskId, setLastDeletedTaskId] = React.useState<string | null>(null);
  const sync = useTaskSync(actorName);
  const { tasks, projects, mutateTasks, mutateProjects } = sync;

  const selectedTask = React.useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId]
  );

  const counts = React.useMemo(() => {
    const today = localDateKey();
    const available = tasks.filter((task) => !task.isDeleted && !task.completed);
    return {
      inbox: available.filter((task) => taskSchedule(task) === "inbox").length,
      today: available.filter((task) => task.dueDate && task.dueDate <= today).length,
      upcoming: available.filter((task) => task.dueDate && task.dueDate > today).length,
      anytime: available.filter((task) => taskSchedule(task) === "anytime" && !task.dueDate).length,
      someday: available.filter((task) => taskSchedule(task) === "someday").length,
      completed: tasks.filter((task) => !task.isDeleted && task.completed).length,
      trash: tasks.filter((task) => task.isDeleted).length,
      projects: Object.fromEntries(projects.map((project) => [project.id, available.filter((task) => task.projectId === project.id).length])),
    };
  }, [projects, tasks]);

  const updateTask = React.useCallback((id: string, updater: (task: Task) => Task) => {
    mutateTasks((current) => current.map((task) => task.id === id ? { ...updater(task), updatedAt: new Date().toISOString() } : task));
  }, [mutateTasks]);

  const toggleTask = React.useCallback((id: string) => {
    const currentTask = tasks.find((task) => task.id === id);
    if (!currentTask) return;
    if (!currentTask.completed) playCompleteSound();
    updateTask(id, (task) => {
      const completed = !task.completed;
      return {
        ...task,
        completed,
        status: completed ? "done" : "todo",
        completedAt: completed ? new Date().toISOString() : undefined,
        activity: [activity(actorName, completed ? "marked as 'Done'." : "reopened task."), ...task.activity],
      };
    });
  }, [actorName, tasks, updateTask]);

  const updateTaskStatus = React.useCallback((id: string, status: TaskStatus) => {
    updateTask(id, (task) => {
      if (task.status === status) return task;
      if (status === "done" && !task.completed) playCompleteSound();
      const labels: Record<TaskStatus, string> = { todo: "To Do", in_progress: "In Progress", done: "Done" };
      return {
        ...task,
        status,
        completed: status === "done",
        completedAt: status === "done" ? new Date().toISOString() : undefined,
        activity: [activity(actorName, `updated status to "${labels[status]}".`), ...task.activity],
      };
    });
  }, [actorName, updateTask]);

  const updateTaskTitle = React.useCallback((id: string, title: string) => {
    const cleanTitle = title.trim();
    if (cleanTitle) updateTask(id, (task) => ({ ...task, title: cleanTitle }));
  }, [updateTask]);
  const updateTaskNotes = React.useCallback((id: string, notes: string) => {
    updateTask(id, (task) => ({ ...task, notes }));
  }, [updateTask]);
  const updateTaskSchedule = React.useCallback((id: string, schedule: TaskSchedule) => {
    updateTask(id, (task) => ({
      ...task,
      schedule,
      dueDate: schedule === "inbox" || schedule === "someday" ? undefined : task.dueDate,
      activity: [activity(actorName, `moved task to "${schedule === "anytime" ? "Anytime" : schedule[0].toUpperCase() + schedule.slice(1)}".`), ...task.activity],
    }));
  }, [actorName, updateTask]);
  const updateTaskDueDate = React.useCallback((id: string, dueDate?: string) => {
    updateTask(id, (task) => ({
      ...task,
      dueDate: dueDate || undefined,
      schedule: dueDate ? "anytime" : taskSchedule(task),
      activity: [activity(actorName, dueDate ? `scheduled task for ${dueDate}.` : "cleared due date."), ...task.activity],
    }));
  }, [actorName, updateTask]);
  const updateTaskPriority = React.useCallback((id: string, priority: TaskPriority) => {
    updateTask(id, (task) => ({ ...task, priority }));
  }, [updateTask]);
  const updateTaskSection = React.useCallback((id: string, sectionId?: string) => {
    updateTask(id, (task) => ({ ...task, sectionId: sectionId || undefined }));
  }, [updateTask]);
  const moveTaskProject = React.useCallback((id: string, projectId?: string) => {
    const projectName = projects.find((project) => project.id === projectId)?.name ?? "No project";
    updateTask(id, (task) => ({
      ...task,
      projectId: projectId || undefined,
      sectionId: undefined,
      schedule: projectId && taskSchedule(task) === "inbox" ? "anytime" : taskSchedule(task),
      activity: [activity(actorName, `moved task to "${projectName}".`), ...task.activity],
    }));
  }, [actorName, projects, updateTask]);

  const toggleSubtask = React.useCallback((taskId: string, subtaskId: string, completed: boolean) => {
    if (completed) playCompleteSound();
    updateTask(taskId, (task) => ({
      ...task,
      subtasks: task.subtasks.map((item) => item.id === subtaskId ? { ...item, completed } : item),
    }));
  }, [updateTask]);
  const addSubtask = React.useCallback((taskId: string, title: string) => {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    updateTask(taskId, (task) => ({
      ...task,
      subtasks: [...task.subtasks, { id: createEntityId("sub"), title: cleanTitle, completed: false } satisfies Subtask],
    }));
  }, [updateTask]);
  const deleteSubtask = React.useCallback((taskId: string, subtaskId: string) => {
    updateTask(taskId, (task) => ({ ...task, subtasks: task.subtasks.filter((item) => item.id !== subtaskId) }));
  }, [updateTask]);
  const addTag = React.useCallback((taskId: string, tag: string) => {
    const cleanTag = tag.trim().replace(/^#/, "");
    if (!cleanTag) return;
    updateTask(taskId, (task) => task.tags.some((item) => item.toLocaleLowerCase() === cleanTag.toLocaleLowerCase())
      ? task
      : { ...task, tags: [...task.tags, cleanTag] });
  }, [updateTask]);
  const removeTag = React.useCallback((taskId: string, tag: string) => {
    updateTask(taskId, (task) => ({ ...task, tags: task.tags.filter((item) => item !== tag) }));
  }, [updateTask]);

  const createTask = React.useCallback((title: string, options?: Partial<Task>) => {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    const now = new Date().toISOString();
    const task: Task = {
      id: createEntityId("task"),
      title: cleanTitle,
      completed: false,
      status: "todo",
      schedule: options?.schedule ?? "inbox",
      priority: options?.priority ?? "none",
      projectId: options?.projectId,
      sectionId: options?.sectionId,
      dueDate: options?.dueDate,
      assigneeName: actorName,
      tags: options?.tags ?? [],
      notes: options?.notes ?? "",
      subtasks: [],
      activity: [activity(actorName, "created task.")],
      createdAt: now,
      updatedAt: now,
      isDeleted: false,
    };
    mutateTasks((current) => [task, ...current]);
    setSelectedTaskId(task.id);
  }, [actorName, mutateTasks]);

  const deleteTask = React.useCallback((id: string) => {
    updateTask(id, (task) => ({ ...task, isDeleted: true, deletedAt: new Date().toISOString() }));
    setLastDeletedTaskId(id);
    if (selectedTaskId === id) setSelectedTaskId(null);
  }, [selectedTaskId, updateTask]);
  const restoreTask = React.useCallback((id: string) => {
    updateTask(id, (task) => ({ ...task, isDeleted: false, deletedAt: undefined }));
    if (lastDeletedTaskId === id) setLastDeletedTaskId(null);
  }, [lastDeletedTaskId, updateTask]);
  const undoDelete = React.useCallback(() => {
    if (lastDeletedTaskId) restoreTask(lastDeletedTaskId);
  }, [lastDeletedTaskId, restoreTask]);
  const permanentlyDeleteTask = React.useCallback((id: string) => {
    mutateTasks((current) => current.filter((task) => task.id !== id));
    if (lastDeletedTaskId === id) setLastDeletedTaskId(null);
  }, [lastDeletedTaskId, mutateTasks]);
  const emptyTrash = React.useCallback(() => {
    mutateTasks((current) => current.filter((task) => !task.isDeleted));
    setLastDeletedTaskId(null);
  }, [mutateTasks]);

  const createProject = React.useCallback((name: string) => {
    const cleanName = name.trim();
    if (!cleanName || projects.some((project) => project.name.toLocaleLowerCase() === cleanName.toLocaleLowerCase())) return;
    mutateProjects((current) => [...current, {
      id: createEntityId("project"), name: cleanName, color: "#52525B", icon: "folder", archived: false,
      position: current.length, sections: [],
    }]);
  }, [mutateProjects, projects]);
  const updateProject = React.useCallback((id: string, changes: Pick<Project, "name" | "description" | "color" | "icon">) => {
    const cleanName = changes.name.trim();
    if (!cleanName || projects.some((project) => project.id !== id && project.name.toLocaleLowerCase() === cleanName.toLocaleLowerCase())) return;
    mutateProjects((current) => current.map((project) => project.id === id ? {
      ...project,
      name: cleanName,
      description: changes.description?.trim() || undefined,
      color: changes.color,
      icon: changes.icon,
    } : project));
  }, [mutateProjects, projects]);
  const archiveProject = React.useCallback((id: string) => {
    mutateProjects((current) => current.map((project) => project.id === id ? { ...project, archived: !project.archived } : project));
  }, [mutateProjects]);
  const deleteProject = React.useCallback((id: string) => {
    mutateTasks((current) => current.map((task) => task.projectId === id
      ? { ...task, projectId: undefined, sectionId: undefined, schedule: "inbox" as const, dueDate: undefined }
      : task));
    mutateProjects((current) => current.filter((project) => project.id !== id));
  }, [mutateProjects, mutateTasks]);
  const addSection = React.useCallback((projectId: string, name: string) => {
    const cleanName = name.trim();
    if (!cleanName) return;
    mutateProjects((current) => current.map((project) => {
      if (project.id !== projectId || project.sections.some((section) => section.name.toLocaleLowerCase() === cleanName.toLocaleLowerCase())) return project;
      return { ...project, sections: [...project.sections, { id: createEntityId("section"), name: cleanName, position: project.sections.length }] };
    }));
  }, [mutateProjects]);
  const renameSection = React.useCallback((projectId: string, sectionId: string, name: string) => {
    const cleanName = name.trim();
    if (!cleanName) return;
    mutateProjects((current) => current.map((project) => project.id === projectId
      ? { ...project, sections: project.sections.map((section) => section.id === sectionId ? { ...section, name: cleanName } : section) }
      : project));
  }, [mutateProjects]);
  const deleteSection = React.useCallback((projectId: string, sectionId: string) => {
    mutateTasks((current) => current.map((task) => task.sectionId === sectionId ? { ...task, sectionId: undefined } : task));
    mutateProjects((current) => current.map((project) => project.id === projectId
      ? { ...project, sections: project.sections.filter((section) => section.id !== sectionId) }
      : project));
  }, [mutateProjects, mutateTasks]);

  return {
    ...sync, tasks, projects, selectedTask, selectedTaskId, lastDeletedTaskId, counts,
    selectTask: (task: Task | null) => setSelectedTaskId(task?.id ?? null),
    collapseTask: () => setSelectedTaskId(null), toggleTask, updateTaskTitle, updateTaskStatus,
    updateTaskNotes, updateTaskSchedule, updateTaskDueDate, updateTaskPriority, updateTaskSection,
    toggleSubtask, addSubtask, deleteSubtask, addTag, removeTag, createTask, deleteTask,
    restoreTask, undoDelete, permanentlyDeleteTask, emptyTrash, moveTaskProject, createProject,
    updateProject, archiveProject, deleteProject, addSection, renameSection, deleteSection,
  };
}
