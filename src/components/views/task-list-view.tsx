"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { InlineTaskCreator } from "@/components/ui/inline-task-creator";
import { TaskRow } from "@/components/ui/task-row";
import { ViewHeader } from "@/components/ui/view-header";
import { localDateKey, taskSchedule } from "@/lib/use-tasks";
import type { Project, Task, TaskPriority, TaskSchedule } from "@/types/task";

export interface TaskListActions {
  selectedTaskId: string | null;
  projects: Project[];
  onSelectTask: (task: Task) => void;
  onCloseExpand: () => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string, completed: boolean) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  onAddTag: (taskId: string, tag: string) => void;
  onRemoveTag: (taskId: string, tag: string) => void;
  onStatusChange: (taskId: string, status: string) => void;
  onProjectChange: (taskId: string, projectId?: string) => void;
  onSectionChange: (taskId: string, sectionId?: string) => void;
  onScheduleChange: (taskId: string, schedule: TaskSchedule) => void;
  onDueDateChange: (taskId: string, dueDate?: string) => void;
  onPriorityChange: (taskId: string, priority: TaskPriority) => void;
}

interface TaskListViewProps extends TaskListActions {
  title: string;
  description?: string;
  icon: React.ReactNode;
  tasks: Task[];
  emptyTitle: string;
  emptyDescription: string;
  allowCreate?: boolean;
  createPlaceholder?: string;
  onAddTask?: (title: string) => void;
  bare?: boolean;
}

function formatDueDate(value: string): string {
  const today = localDateKey();
  if (value === today) return "Today";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en", { day: "numeric", month: "short" }).format(date);
}

export function TaskListView({
  title, description, icon, tasks, emptyTitle, emptyDescription, allowCreate = true,
  createPlaceholder = "Add a task...", onAddTask, bare = false, ...actions
}: TaskListViewProps) {
  const [sort, setSort] = React.useState<"manual" | "date" | "alphabetical" | "priority">("manual");
  const visibleTasks = React.useMemo(() => {
    const result = [...tasks];
    if (sort === "date") return result.sort((a, b) => (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999"));
    if (sort === "alphabetical") return result.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "priority") {
      const rank: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2, none: 3 };
      return result.sort((a, b) => rank[a.priority ?? "none"] - rank[b.priority ?? "none"]);
    }
    return result;
  }, [sort, tasks]);

  return (
    <div className={bare ? "w-full space-y-1" : "mx-auto w-full max-w-[800px] space-y-5 px-4 pb-16 pt-5 sm:px-6 sm:pt-7"}>
      {!bare && <div className="space-y-2">
        <ViewHeader
          title={title}
          count={tasks.length}
          icon={icon}
          description={description}
          actions={tasks.length > 1 ? (
            <label className="flex items-center gap-2 text-xs text-zinc-500">
              <span>Sort</span>
              <select aria-label={`Sort ${title}`} value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-xs text-zinc-700 outline-none focus:ring-2 focus:ring-zinc-300">
                <option value="manual">Added order</option>
                <option value="date">Due date</option>
                <option value="priority">Priority</option>
                <option value="alphabetical">A–Z</option>
              </select>
            </label>
          ) : undefined}
        />
        {allowCreate && onAddTask && <InlineTaskCreator placeholder={createPlaceholder} onAdd={onAddTask} />}
      </div>}

      <div className="space-y-1">
        {visibleTasks.map((task) => {
          const overdue = Boolean(task.dueDate && task.dueDate < localDateKey() && !task.completed);
          return (
            <TaskRow
              key={task.id}
              id={task.id}
              title={task.title}
              completed={task.completed}
              selected={actions.selectedTaskId === task.id}
              isExpanded={actions.selectedTaskId === task.id}
              onSelect={() => actions.onSelectTask(task)}
              onToggleExpand={() => actions.selectedTaskId === task.id ? actions.onCloseExpand() : actions.onSelectTask(task)}
              onCloseExpand={actions.onCloseExpand}
              onCompletedChange={() => actions.onToggleTask(task.id)}
              dateBadge={task.dueDate ? <Badge variant={overdue ? "overdue" : task.dueDate > localDateKey() ? "upcoming" : "today"}>{overdue ? `Overdue · ${formatDueDate(task.dueDate)}` : formatDueDate(task.dueDate)}</Badge> : taskSchedule(task) === "someday" ? <Badge>Someday</Badge> : undefined}
              dueDate={task.dueDate}
              notes={task.notes}
              subtasks={task.subtasks}
              tags={task.tags}
              status={task.status}
              schedule={taskSchedule(task)}
              priority={task.priority ?? "none"}
              projectId={task.projectId}
              sectionId={task.sectionId}
              projects={actions.projects}
              onUpdateTitle={(value) => actions.onUpdateTitle(task.id, value)}
              onUpdateNotes={(value) => actions.onUpdateNotes(task.id, value)}
              onToggleSubtask={(subtaskId, completed) => actions.onToggleSubtask(task.id, subtaskId, completed)}
              onAddSubtask={(value) => actions.onAddSubtask(task.id, value)}
              onDeleteSubtask={(subtaskId) => actions.onDeleteSubtask(task.id, subtaskId)}
              onAddTag={(tag) => actions.onAddTag(task.id, tag)}
              onRemoveTag={(tag) => actions.onRemoveTag(task.id, tag)}
              onStatusChange={(status) => actions.onStatusChange(task.id, status)}
              onProjectChange={(projectId) => actions.onProjectChange(task.id, projectId)}
              onSectionIdChange={(sectionId) => actions.onSectionChange(task.id, sectionId)}
              onScheduleModeChange={(schedule) => actions.onScheduleChange(task.id, schedule)}
              onDueDateChange={(dueDate) => actions.onDueDateChange(task.id, dueDate)}
              onPriorityChange={(priority) => actions.onPriorityChange(task.id, priority)}
              onActionClick={() => actions.onDeleteTask(task.id)}
            />
          );
        })}
        {tasks.length === 0 && !bare && <EmptyState title={emptyTitle} description={emptyDescription} icon={icon} />}
      </div>
    </div>
  );
}
