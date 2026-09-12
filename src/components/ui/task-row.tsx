"use client";

import * as React from "react";
import { CheckSquare, Plus, Trash2, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Project, TaskPriority, TaskProject, TaskSchedule, TaskView } from "@/types/task";

export interface SubtaskItemData { id: string; title: string; completed: boolean }

export interface TaskRowProps {
  id?: string;
  title: string;
  completed?: boolean;
  selected?: boolean;
  isExpanded?: boolean;
  dateBadge?: React.ReactNode;
  dueDate?: string;
  hideCollapsedDueDate?: boolean;
  notes?: string;
  subtasks?: SubtaskItemData[];
  tags?: string[];
  status?: string;
  schedule?: TaskSchedule;
  priority?: TaskPriority;
  projectId?: string;
  sectionId?: string;
  projects?: Project[];
  className?: string;
  onCompletedChange?: (completed: boolean) => void;
  onSelect?: () => void;
  onToggleExpand?: () => void;
  onCloseExpand?: () => void;
  onUpdateTitle?: (title: string) => void;
  onUpdateNotes?: (notes: string) => void;
  onToggleSubtask?: (subtaskId: string, completed: boolean) => void;
  onAddSubtask?: (title: string) => void;
  onDeleteSubtask?: (subtaskId: string) => void;
  onAddTag?: (tag: string) => void;
  onRemoveTag?: (tag: string) => void;
  onStatusChange?: (status: string) => void;
  onProjectChange?: (projectId?: string) => void;
  onSectionIdChange?: (sectionId?: string) => void;
  onScheduleModeChange?: (schedule: TaskSchedule) => void;
  onDueDateChange?: (dueDate?: string) => void;
  onPriorityChange?: (priority: TaskPriority) => void;
  onActionClick?: (event: React.MouseEvent) => void;
  /** Legacy component compatibility. */
  projectName?: string;
  project?: TaskProject;
  section?: string;
  view?: TaskView;
  onMoveProject?: (project: TaskProject) => void;
  onSectionChange?: (section?: string) => void;
  onScheduleChange?: (view: TaskView) => void;
}

const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];
const scheduleOptions: Array<{ value: TaskSchedule; label: string }> = [
  { value: "inbox", label: "Inbox" },
  { value: "anytime", label: "Anytime" },
  { value: "someday", label: "Someday" },
];
const priorityOptions: Array<{ value: TaskPriority; label: string }> = [
  { value: "none", label: "No priority" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const TaskRow = React.forwardRef<HTMLDivElement, TaskRowProps>(function TaskRow(
  {
    id, title, completed = false, selected = false, isExpanded = false, dateBadge,
    dueDate, hideCollapsedDueDate = false, notes = "", subtasks = [], tags = [],
    status = "todo", schedule = "anytime", priority = "none", projectId, sectionId,
    projects = [], className, onCompletedChange, onSelect, onToggleExpand, onCloseExpand,
    onUpdateTitle, onUpdateNotes, onToggleSubtask, onAddSubtask, onDeleteSubtask,
    onAddTag, onRemoveTag, onStatusChange, onProjectChange, onSectionIdChange,
    onScheduleModeChange, onDueDateChange, onPriorityChange, onActionClick,
  },
  ref
) {
  const [localTitle, setLocalTitle] = React.useState(title);
  const [localNotes, setLocalNotes] = React.useState(notes);
  const [newSubtaskTitle, setNewSubtaskTitle] = React.useState("");
  const [newTag, setNewTag] = React.useState("");
  const titleRef = React.useRef<HTMLInputElement>(null);
  const notesRef = React.useRef<HTMLTextAreaElement>(null);
  const currentProject = projects.find((project) => project.id === projectId);
  const completedSubtasks = subtasks.filter((subtask) => subtask.completed).length;

  React.useEffect(() => setLocalTitle(title), [title]);
  React.useEffect(() => setLocalNotes(notes), [notes]);
  React.useEffect(() => {
    if (!isExpanded || !notesRef.current) return;
    notesRef.current.style.height = "auto";
    notesRef.current.style.height = `${Math.max(48, notesRef.current.scrollHeight)}px`;
  }, [isExpanded, localNotes]);

  const submitSubtask = () => {
    const value = newSubtaskTitle.trim();
    if (!value) return;
    onAddSubtask?.(value);
    setNewSubtaskTitle("");
  };
  const submitTag = () => {
    const value = newTag.trim();
    if (!value) return;
    onAddTag?.(value);
    setNewTag("");
  };

  if (isExpanded) {
    return (
      <div ref={ref} data-task-id={id} className={cn("my-2 space-y-4 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm", className)}>
        <div className="flex items-start gap-2.5">
          <Checkbox checked={completed} onCheckedChange={onCompletedChange} withSound={false} aria-label={`${completed ? "Reopen" : "Complete"} ${title}`} />
          <input
            ref={titleRef}
            value={localTitle}
            maxLength={500}
            onChange={(event) => {
              setLocalTitle(event.target.value);
              if (event.target.value.trim()) onUpdateTitle?.(event.target.value);
            }}
            onBlur={() => {
              const value = localTitle.trim();
              if (value) onUpdateTitle?.(value); else setLocalTitle(title);
            }}
            onKeyDown={(event) => event.key === "Enter" && titleRef.current?.blur()}
            aria-label="Task title"
            className={cn("min-w-0 flex-1 bg-transparent text-sm font-medium outline-none", completed && "text-zinc-400 line-through")}
          />
          <button type="button" onClick={onCloseExpand} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700" aria-label="Close task details">
            <X className="h-4 w-4" />
          </button>
        </div>

        <textarea
          ref={notesRef}
          value={localNotes}
          maxLength={20_000}
          rows={2}
          onChange={(event) => {
            setLocalNotes(event.target.value);
            onUpdateNotes?.(event.target.value);
          }}
          placeholder="Notes or details..."
          className="ml-7 w-[calc(100%-1.75rem)] resize-none overflow-hidden rounded-md bg-zinc-50 px-3 py-2 text-sm leading-6 text-zinc-700 outline-none focus:ring-2 focus:ring-zinc-300"
        />

        <div className="ml-7 space-y-1.5">
          {subtasks.length > 0 && <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Checklist {completedSubtasks}/{subtasks.length}</p>}
          {subtasks.map((subtask) => (
            <div key={subtask.id} className="group flex min-h-8 items-center gap-2 rounded-md px-1 hover:bg-zinc-50">
              <Checkbox checked={subtask.completed} onCheckedChange={(checked) => onToggleSubtask?.(subtask.id, checked)} withSound={false} aria-label={`${subtask.completed ? "Reopen" : "Complete"} ${subtask.title}`} />
              <span className={cn("min-w-0 flex-1 truncate text-xs", subtask.completed && "text-zinc-400 line-through")}>{subtask.title}</span>
              <button type="button" onClick={() => onDeleteSubtask?.(subtask.id)} className="inline-flex h-7 w-7 items-center justify-center rounded text-zinc-300 opacity-0 hover:text-red-600 focus-visible:opacity-100 group-hover:opacity-100" aria-label={`Delete ${subtask.title}`}>
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2 px-1 text-zinc-400">
            <Plus className="h-3.5 w-3.5" />
            <input value={newSubtaskTitle} onChange={(event) => setNewSubtaskTitle(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submitSubtask()} placeholder="Add checklist item..." className="h-8 flex-1 bg-transparent text-xs text-zinc-700 outline-none" />
          </div>
        </div>

        <div className="ml-7 grid gap-2 border-t border-zinc-100 pt-3 sm:grid-cols-2">
          <label className="space-y-1 text-[11px] font-medium text-zinc-500">
            <span>Project</span>
            <select aria-label="Project" value={projectId ?? ""} onChange={(event) => onProjectChange?.(event.target.value || undefined)} className="h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-xs text-zinc-700 outline-none focus:ring-2 focus:ring-zinc-300">
              <option value="">No project</option>
              {projects.filter((project) => !project.archived).map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
          </label>
          <label className="space-y-1 text-[11px] font-medium text-zinc-500">
            <span>Section</span>
            <select aria-label="Section" value={sectionId ?? ""} disabled={!currentProject} onChange={(event) => onSectionIdChange?.(event.target.value || undefined)} className="h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-xs text-zinc-700 outline-none disabled:bg-zinc-50 disabled:text-zinc-400 focus:ring-2 focus:ring-zinc-300">
              <option value="">{currentProject ? "General" : "Choose a project first"}</option>
              {currentProject?.sections.map((section) => <option key={section.id} value={section.id}>{section.name}</option>)}
            </select>
          </label>
          <label className="space-y-1 text-[11px] font-medium text-zinc-500">
            <span>Due date</span>
            <input aria-label="Due date" type="date" value={dueDate ?? ""} onChange={(event) => onDueDateChange?.(event.target.value || undefined)} className="h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-xs text-zinc-700 outline-none focus:ring-2 focus:ring-zinc-300" />
          </label>
          <label className="space-y-1 text-[11px] font-medium text-zinc-500">
            <span>Availability</span>
            <select aria-label="Availability" value={schedule} onChange={(event) => onScheduleModeChange?.(event.target.value as TaskSchedule)} className="h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-xs text-zinc-700 outline-none focus:ring-2 focus:ring-zinc-300">
              {scheduleOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="space-y-1 text-[11px] font-medium text-zinc-500">
            <span>Status</span>
            <select aria-label="Task status" value={status} onChange={(event) => onStatusChange?.(event.target.value)} className="h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-xs text-zinc-700 outline-none focus:ring-2 focus:ring-zinc-300">
              {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="space-y-1 text-[11px] font-medium text-zinc-500">
            <span>Priority</span>
            <select aria-label="Priority" value={priority} onChange={(event) => onPriorityChange?.(event.target.value as TaskPriority)} className="h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-xs text-zinc-700 outline-none focus:ring-2 focus:ring-zinc-300">
              {priorityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        </div>

        <div className="ml-7 flex flex-wrap items-center gap-1.5">
          {tags.map((tag) => <span key={tag} className="inline-flex items-center gap-1 rounded bg-zinc-100 px-2 py-1 text-[11px] text-zinc-600">#{tag}<button type="button" onClick={() => onRemoveTag?.(tag)} aria-label={`Remove ${tag} tag`}><X className="h-3 w-3" /></button></span>)}
          <div className="flex items-center rounded-md border border-transparent focus-within:border-zinc-200">
            <input value={newTag} onChange={(event) => setNewTag(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submitTag()} placeholder="Add tag" aria-label="Add tag" className="h-8 w-20 bg-transparent px-2 text-xs outline-none" />
            {newTag && <button type="button" onClick={submitTag} className="h-8 px-2 text-xs font-medium text-zinc-600">Add</button>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} data-task-id={id} className={cn("group grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-2.5 transition-colors", selected ? "bg-zinc-100" : "hover:bg-zinc-50", className)}>
      <div className="flex min-w-0 items-center gap-2.5">
        <Checkbox checked={completed} onCheckedChange={onCompletedChange} withSound={false} aria-label={`${completed ? "Reopen" : "Complete"} ${title}`} />
        <button type="button" onClick={onToggleExpand ?? onSelect} className="min-w-0 flex-1 rounded text-left outline-none focus-visible:ring-2 focus-visible:ring-zinc-400" aria-label={`Open task: ${title}`}>
          <span className={cn("block select-text truncate text-[13.5px] font-medium text-zinc-900", completed && "font-normal text-zinc-400 line-through")}>{title}</span>
          {subtasks.length > 0 && <span className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-500"><CheckSquare className="h-3 w-3" />{completedSubtasks}/{subtasks.length}</span>}
        </button>
      </div>
      <div className="flex items-center gap-1.5">
        {dateBadge}
        {dueDate && !dateBadge && !hideCollapsedDueDate && <span className="text-[11px] text-zinc-500">{dueDate}</span>}
        <button type="button" onClick={(event) => { event.stopPropagation(); onActionClick?.(event); }} className="inline-flex h-9 w-9 items-center justify-center rounded text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 sm:h-7 sm:w-7 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100" title="Move to trash" aria-label={`Move ${title} to trash`}>
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
});
