"use client";

import * as React from "react";
import { Dialog } from "@/components/ui/dialog";
import { ProjectIcon } from "@/components/ui/project-icon";
import type { Project, Task } from "@/types/task";
import { localDateKey, taskSchedule } from "@/lib/use-tasks";

export interface CommandPaletteProps {
  isOpen: boolean; onClose: () => void; tasks: Task[]; projects: Project[];
  onSelectTask: (task: Task) => void; onSelectProject: (project: Project) => void;
}
type Result = { kind: "project"; project: Project; id: string } | { kind: "task"; task: Task; id: string };

function SearchDialog({ onClose, tasks, projects, onSelectTask, onSelectProject }: Omit<CommandPaletteProps, "isOpen">) {
  const [query, setQuery] = React.useState("");
  const [index, setIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listId = React.useId();
  const results = React.useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    const projectResults: Result[] = projects.filter(project => !q ? !project.archived : project.name.toLowerCase().includes(q) || project.description?.toLowerCase().includes(q))
      .slice(0, 10).map(project => ({ kind: "project", project, id: `project-${project.id}` }));
    const taskResults: Result[] = tasks.filter(task => {
      if (task.isDeleted) return false;
      if (!q) return !task.completed;
      const project = projects.find(project => project.id === task.projectId);
      const section = project?.sections.find(section => section.id === task.sectionId);
      return [task.title, task.notes, ...task.tags, project?.name, section?.name].some(text => text?.toLowerCase().includes(q));
    }).slice(0, 10).map(task => ({ kind: "task", task, id: `task-${task.id}` }));
    return [...projectResults, ...taskResults];
  }, [projects, tasks, query]);
  const selected = Math.min(index, Math.max(0, results.length - 1));
  React.useEffect(() => {
    const result = results[selected];
    if (result) document.getElementById(`${listId}-${result.id}`)?.scrollIntoView({ block: "nearest" });
  }, [results, selected, listId]);
  const choose = (result: Result) => {
    if (result.kind === "project") onSelectProject(result.project);
    else onSelectTask(result.task);
    onClose();
  };
  return <Dialog open title="Quick find" onClose={onClose} initialFocusRef={inputRef} className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
    <input ref={inputRef} role="combobox" aria-label="Search tasks, tags, or projects" aria-controls={listId} aria-expanded="true" aria-autocomplete="list" aria-activedescendant={results[selected] ? `${listId}-${results[selected].id}` : undefined} value={query} onChange={event => { setQuery(event.target.value); setIndex(0); }} placeholder="Quick find tasks, tags, or projects..." className="mt-3 h-11 w-full min-w-0 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300" onKeyDown={event => {
      if (event.nativeEvent.isComposing) return;
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (results.length) setIndex((selected + (event.key === "ArrowDown" ? 1 : -1) + results.length) % results.length);
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (results[selected]) choose(results[selected]);
      }
    }} />
    <div id={listId} role="listbox" aria-label="Tasks and projects" className="mt-3 max-h-[45dvh] space-y-1 overflow-y-auto">
      {results.map((result, i) => {
        const project = result.kind === "project" ? result.project : projects.find(project => project.id === result.task.projectId);
        const task = result.kind === "task" ? result.task : undefined;
        const section = project?.sections.find(section => section.id === task?.sectionId);
        const today = localDateKey();
        const state = task ? task.completed ? "Completed" : task.dueDate ? task.dueDate < today ? `Overdue · ${task.dueDate}` : task.dueDate === today ? "Today" : task.dueDate : taskSchedule(task) : project?.archived ? "Archived" : "";
        return <button key={result.id} id={`${listId}-${result.id}`} type="button" role="option" aria-selected={selected === i} onClick={() => choose(result)} onFocus={() => setIndex(i)} className={`flex min-h-12 w-full items-start gap-2 rounded-lg px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 ${selected === i ? "bg-zinc-100" : "hover:bg-zinc-50"}`}>
          <ProjectIcon name={project?.icon} style={{ color: project?.color }} className="mt-0.5 shrink-0" />
          <span className="min-w-0 flex-1">
            <span className={`block truncate text-sm ${task?.completed ? "text-zinc-500 line-through" : "text-zinc-900"}`}>{task?.title ?? project?.name}</span>
            <span className="block truncate text-xs text-zinc-500">{task ? `Task · ${project?.name ?? "No project"}${section ? ` / ${section.name}` : ""}` : "Project"}{state ? ` · ${state}` : ""}</span>
          </span>
        </button>;
      })}
    </div>
    {results.length === 0 && <p role="status" className="py-6 text-center text-sm text-zinc-500">{query.trim() ? "No tasks or projects found." : "Your workspace is empty."}</p>}
    <p className="mt-3 text-xs text-zinc-500">↑ ↓ Navigate · Enter Open · Esc Close</p>
  </Dialog>;
}

export function CommandPalette({ isOpen, ...props }: CommandPaletteProps) {
  return isOpen ? <SearchDialog {...props} /> : null;
}
