"use client";

import * as React from "react";
import { Archive, Calendar, CheckCircle2, CircleDashed, Clock, Inbox } from "lucide-react";
import { LoginView } from "@/components/auth/login-view";
import { AppShell } from "@/components/layout/app-shell";
import { CommandPalette } from "@/components/layout/command-palette";
import { ProjectView } from "@/components/views/project-view";
import { TaskListView, type TaskListActions } from "@/components/views/task-list-view";
import { TrashView } from "@/components/views/trash-view";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { localDateKey, taskSchedule, useTasks } from "@/lib/use-tasks";
import type { Task, TaskStatus } from "@/types/task";

function initialViewFromUrl(): string {
  if (typeof window === "undefined") return "today";
  return new URLSearchParams(window.location.search).get("view") || "today";
}

function addDays(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function TaskDashboard() {
  const { user } = useAuth();
  const taskState = useTasks(user?.name);
  const { tasks, projects } = taskState;
  const [activeView, setActiveViewState] = React.useState(initialViewFromUrl);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false);
  const today = localDateKey();

  const setActiveView = React.useCallback((view: string) => {
    setActiveViewState(view);
    const url = new URL(window.location.href);
    url.searchParams.set("view", view);
    window.history.pushState({}, "", url);
    taskState.collapseTask();
  }, [taskState]);

  React.useEffect(() => {
    const handlePopState = () => setActiveViewState(initialViewFromUrl());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const available = React.useMemo(() => tasks.filter((task) => !task.isDeleted && !task.completed), [tasks]);
  const todayTasks = React.useMemo(() => available.filter((task) => task.dueDate && task.dueDate <= today), [available, today]);
  const upcomingTasks = React.useMemo(() => available.filter((task) => task.dueDate && task.dueDate > today), [available, today]);
  const inboxTasks = React.useMemo(() => available.filter((task) => taskSchedule(task) === "inbox"), [available]);
  const anytimeTasks = React.useMemo(() => available.filter((task) => taskSchedule(task) === "anytime" && !task.dueDate), [available]);
  const somedayTasks = React.useMemo(() => available.filter((task) => taskSchedule(task) === "someday"), [available]);
  const completedTasks = React.useMemo(() => tasks.filter((task) => !task.isDeleted && task.completed), [tasks]);
  const trashTasks = React.useMemo(() => tasks.filter((task) => task.isDeleted), [tasks]);
  const activeProjectId = activeView.startsWith("project:") ? activeView.slice(8) : undefined;
  const activeProject = projects.find((project) => project.id === activeProjectId);
  const projectTasks = activeProject ? tasks.filter((task) => !task.isDeleted && task.projectId === activeProject.id) : [];
  const openProjectTasks = projectTasks.filter((task) => !task.completed);

  const progressTasks = React.useMemo(() => {
    const present = tasks.filter((task) => !task.isDeleted);
    if (activeProjectId) return present.filter((task) => task.projectId === activeProjectId);
    if (activeView === "inbox") return present.filter((task) => taskSchedule(task) === "inbox");
    if (activeView === "today") return present.filter((task) => {
      if (!task.dueDate || task.dueDate > today) return false;
      if (!task.completed) return true;
      return task.completedAt ? localDateKey(new Date(task.completedAt)) === today : false;
    });
    if (activeView === "upcoming") return present.filter((task) => Boolean(task.dueDate && task.dueDate > today));
    if (activeView === "anytime") return present.filter((task) => taskSchedule(task) === "anytime" && !task.dueDate);
    if (activeView === "someday") return present.filter((task) => taskSchedule(task) === "someday");
    return [];
  }, [activeProjectId, activeView, tasks, today]);

  const currentTasks = activeView === "inbox" ? inboxTasks
    : activeView === "today" ? todayTasks
      : activeView === "upcoming" ? upcomingTasks
        : activeView === "anytime" ? anytimeTasks
          : activeView === "someday" ? somedayTasks
            : activeView === "completed" ? completedTasks
              : activeView === "trash" ? trashTasks
                : openProjectTasks;

  const openSearchResult = React.useCallback((task: Task) => {
    let destination: string;
    if (task.isDeleted) destination = "trash";
    else if (task.completed) destination = "completed";
    else if (task.dueDate && task.dueDate <= today) destination = "today";
    else if (task.dueDate && task.dueDate > today) destination = "upcoming";
    else if (task.projectId && projects.some((project) => project.id === task.projectId && !project.archived)) destination = `project:${task.projectId}`;
    else destination = taskSchedule(task);
    setActiveView(destination);
    taskState.selectTask(task);
  }, [projects, setActiveView, taskState, today]);

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k") {
        event.preventDefault();
        setIsCommandPaletteOpen((open) => !open);
        return;
      }
      if (isCommandPaletteOpen) return;
      const tag = document.activeElement?.tagName.toLocaleLowerCase();
      if (tag === "input" || tag === "textarea" || document.activeElement?.getAttribute("contenteditable") === "true") return;
      if (event.key === "Escape" && taskState.selectedTask) {
        event.preventDefault();
        taskState.collapseTask();
      } else if (event.code === "Space" && taskState.selectedTask) {
        event.preventDefault();
        taskState.toggleTask(taskState.selectedTask.id);
      } else if ((event.key === "Delete" || event.key === "Backspace") && taskState.selectedTask) {
        event.preventDefault();
        taskState.deleteTask(taskState.selectedTask.id);
      } else if ((event.key === "ArrowDown" || event.key === "ArrowUp") && currentTasks.length > 0) {
        event.preventDefault();
        const index = currentTasks.findIndex((task) => task.id === taskState.selectedTaskId);
        const delta = event.key === "ArrowDown" ? 1 : -1;
        const next = (index + delta + currentTasks.length) % currentTasks.length;
        taskState.selectTask(currentTasks[next]);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentTasks, isCommandPaletteOpen, taskState]);

  const commonActions: TaskListActions = {
    selectedTaskId: taskState.selectedTaskId,
    projects,
    onSelectTask: taskState.selectTask,
    onCloseExpand: taskState.collapseTask,
    onToggleTask: taskState.toggleTask,
    onDeleteTask: taskState.deleteTask,
    onUpdateTitle: taskState.updateTaskTitle,
    onUpdateNotes: taskState.updateTaskNotes,
    onToggleSubtask: taskState.toggleSubtask,
    onAddSubtask: taskState.addSubtask,
    onDeleteSubtask: taskState.deleteSubtask,
    onAddTag: taskState.addTag,
    onRemoveTag: taskState.removeTag,
    onStatusChange: (id, status) => taskState.updateTaskStatus(id, status as TaskStatus),
    onProjectChange: taskState.moveTaskProject,
    onSectionChange: taskState.updateTaskSection,
    onScheduleChange: taskState.updateTaskSchedule,
    onDueDateChange: taskState.updateTaskDueDate,
    onPriorityChange: taskState.updateTaskPriority,
  };

  if (!taskState.isLoaded) return <div role="status" className="flex min-h-screen items-center justify-center text-sm text-zinc-500">Loading your workspace…</div>;

  const listView = activeView === "inbox"
    ? { title: "Inbox", description: "Capture first. Organize when you are ready.", icon: <Inbox className="h-4 w-4" />, tasks: inboxTasks, emptyTitle: "Inbox is clear", emptyDescription: "New tasks added here stay until you organize them.", placeholder: "Capture what needs your attention?", options: { schedule: "inbox" as const } }
    : activeView === "today"
      ? { title: "Today", description: "Due today and overdue.", icon: <Calendar className="h-4 w-4" />, tasks: todayTasks, emptyTitle: "Nothing due today", emptyDescription: "You can add a task for today or work from Anytime.", placeholder: "Add a task for today...", options: { schedule: "anytime" as const, dueDate: today } }
      : activeView === "upcoming"
        ? { title: "Upcoming", description: "Tasks with a future due date.", icon: <Clock className="h-4 w-4" />, tasks: upcomingTasks, emptyTitle: "Nothing upcoming", emptyDescription: "Choose a due date on any task to plan ahead.", placeholder: "Add an upcoming task...", options: { schedule: "anytime" as const, dueDate: addDays(today, 1) } }
        : activeView === "anytime"
          ? { title: "Anytime", description: "Active tasks without a due date.", icon: <CircleDashed className="h-4 w-4" />, tasks: anytimeTasks, emptyTitle: "No anytime tasks", emptyDescription: "Tasks without a date appear here.", placeholder: "Add a task you can do anytime...", options: { schedule: "anytime" as const } }
          : activeView === "someday"
            ? { title: "Someday", description: "Ideas without a commitment yet.", icon: <Archive className="h-4 w-4" />, tasks: somedayTasks, emptyTitle: "Someday is empty", emptyDescription: "Keep ideas here until they become actionable.", placeholder: "Save an idea for later...", options: { schedule: "someday" as const } }
            : activeView === "completed"
              ? { title: "Completed", description: "A record of finished work.", icon: <CheckCircle2 className="h-4 w-4" />, tasks: completedTasks, emptyTitle: "No completed tasks", emptyDescription: "Completed tasks will be kept here.", placeholder: "", options: {} }
              : null;

  return <>
    <AppShell activeView={activeView} onSelectView={setActiveView} onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} completedCount={progressTasks.filter((task) => task.completed).length} totalCount={progressTasks.length} syncStatus={taskState.syncStatus} onBeforeLogout={taskState.flushNow} counts={taskState.counts} projects={projects} onCreateProject={taskState.createProject}>
      {listView && <TaskListView {...commonActions} title={listView.title} description={listView.description} icon={listView.icon} tasks={listView.tasks} emptyTitle={listView.emptyTitle} emptyDescription={listView.emptyDescription} allowCreate={activeView !== "completed"} createPlaceholder={listView.placeholder} onAddTask={(title) => taskState.createTask(title, listView.options)} />}
      {activeProject && <ProjectView {...commonActions} project={activeProject} tasks={projectTasks} onAddTask={(title, sectionId) => taskState.createTask(title, { schedule: "anytime", projectId: activeProject.id, sectionId })} onUpdateProject={(changes) => taskState.updateProject(activeProject.id, changes)} onArchiveProject={() => { taskState.archiveProject(activeProject.id); if (!activeProject.archived) setActiveView("inbox"); }} onDeleteProject={() => { taskState.deleteProject(activeProject.id); setActiveView("inbox"); }} onAddSection={(name) => taskState.addSection(activeProject.id, name)} onRenameSection={(sectionId, name) => taskState.renameSection(activeProject.id, sectionId, name)} onDeleteSection={(sectionId) => taskState.deleteSection(activeProject.id, sectionId)} />}
      {activeView === "trash" && <TrashView tasks={trashTasks} projects={projects} onRestoreTask={taskState.restoreTask} onPermanentlyDeleteTask={taskState.permanentlyDeleteTask} onEmptyTrash={taskState.emptyTrash} />}
      {!listView && !activeProject && activeView !== "trash" && <TaskListView {...commonActions} title="Not found" icon={<CircleDashed className="h-4 w-4" />} tasks={[]} emptyTitle="This view is unavailable" emptyDescription="Choose a view from the sidebar." allowCreate={false} />}
    </AppShell>

    <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} tasks={tasks} projects={projects} onSelectTask={openSearchResult} />
    {taskState.lastDeletedTaskId && <div role="status" className="fixed bottom-4 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-4 rounded-lg bg-zinc-900 px-4 py-3 text-xs text-white shadow-lg"><span>Task moved to Trash.</span><button type="button" onClick={taskState.undoDelete} className="font-semibold underline underline-offset-2">Undo</button></div>}
    {taskState.syncError && <div role="alert" className="fixed bottom-4 right-4 z-[60] max-w-sm rounded-lg border border-amber-300 bg-white px-4 py-3 text-xs shadow-lg"><p>{taskState.syncError}</p><div className="mt-2 flex gap-3">{taskState.syncStatus === "conflict" ? <><button type="button" onClick={taskState.loadServerCopy} className="font-semibold underline">Use server copy</button><button type="button" onClick={taskState.keepLocalCopy} className="font-semibold underline">Keep this copy</button></> : <button type="button" onClick={taskState.retrySync} className="font-semibold underline">Retry</button>}</div></div>}
  </>;
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div role="status" className="flex min-h-screen items-center justify-center text-sm text-zinc-500">Loading…</div>;
  return isAuthenticated ? <TaskDashboard /> : <LoginView />;
}

export default function HomePage() {
  return <AuthProvider><AppContent /></AuthProvider>;
}
