"use client";

import * as React from "react";
import {
  Search,
  X,
  Calendar,
  Clock,
  Archive,
  Check,
  Folder,
  CircleDashed,
} from "lucide-react";
import type { Project, Task } from "@/types/task";
import { localDateKey, taskSchedule } from "@/lib/use-tasks";
import { cn } from "@/lib/utils";

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  projects: Project[];
  onSelectTask: (task: Task) => void;
}

type CommandPaletteDialogProps = Omit<CommandPaletteProps, "isOpen">;

function CommandPaletteDialog({
  onClose,
  tasks,
  projects,
  onSelectTask,
}: CommandPaletteDialogProps) {
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const listboxId = React.useId();

  // Filter tasks matching query
  const filteredTasks = React.useMemo(() => {
    if (!query.trim()) {
      // Show first 8 active tasks
      return tasks.filter((t) => !t.isDeleted).slice(0, 8);
    }
    const q = query.toLowerCase().trim();
    return tasks
      .filter(
        (t) =>
          !t.isDeleted &&
          (t.title.toLowerCase().includes(q) ||
            t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
            t.notes.toLowerCase().includes(q) ||
            projects.find((project) => project.id === t.projectId)?.name.toLowerCase().includes(q))
      )
      .slice(0, 10);
  }, [projects, tasks, query]);

  // Focus the search field after the dialog enters the document.
  React.useEffect(() => {
    const previouslyFocused = document.activeElement;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, []);

  const selectTask = React.useCallback(
    (task: Task) => {
      onSelectTask(task);
      onClose();
    },
    [onClose, onSelectTask]
  );

  // Keyboard navigation inside palette
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredTasks.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : Math.max(filteredTasks.length - 1, 0)
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filteredTasks[selectedIndex];
        if (selected) selectTask(selected);
      } else if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'input:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredTasks, selectedIndex, onClose, selectTask]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 bg-black/25 backdrop-blur-[2px] flex items-start justify-center pt-24 px-4 select-none animate-in fade-in-0 duration-150"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-xl rounded-2xl bg-white border border-[#E5E7EB] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={titleId} className="sr-only">
          Find a task
        </h2>
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 border-b border-[#E5E7EB]">
          <Search className="h-4 w-4 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Quick find tasks, tags, or projects..."
            aria-label="Search tasks, tags, or projects"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded="true"
            aria-controls={listboxId}
            aria-activedescendant={
              filteredTasks[selectedIndex]
                ? `${listboxId}-option-${filteredTasks[selectedIndex].id}`
                : undefined
            }
            className="flex-1 py-3.5 bg-transparent text-sm text-[#18181B] placeholder:text-zinc-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded text-zinc-400 hover:text-zinc-700"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div
          id={listboxId}
          role="listbox"
          aria-label="Task results"
          className="max-h-80 overflow-y-auto p-2 space-y-0.5"
        >
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={task.id}
                  id={`${listboxId}-option-${task.id}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => selectTask(task)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    "flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer",
                    isSelected
                      ? "bg-zinc-100/90 text-[#18181B] ring-1 ring-zinc-200/70"
                      : "text-zinc-600 hover:bg-zinc-50"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="shrink-0 text-zinc-500">
                      {task.projectId ? (
                        <Folder className="h-3.5 w-3.5" />
                      ) : (
                        <CircleDashed className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <span
                      className={cn(
                        "font-medium truncate",
                        task.completed && "line-through text-zinc-400 font-normal"
                      )}
                    >
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {task.dueDate && task.dueDate <= localDateKey() && !task.completed && (
                      <span className="flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[11px] font-medium text-zinc-600">
                        <Calendar className="h-3 w-3" />
                        Today
                      </span>
                    )}
                    {task.dueDate && task.dueDate > localDateKey() && !task.completed && (
                      <span className="flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[11px] font-medium text-zinc-600">
                        <Clock className="h-3 w-3" />
                        Upcoming
                      </span>
                    )}
                    {taskSchedule(task) === "someday" && !task.completed && (
                      <span className="flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[11px] font-medium text-zinc-600">
                        <Archive className="h-3 w-3" />
                        Someday
                      </span>
                    )}
                    <span className="text-[11px] text-zinc-400 font-normal">
                      {projects.find((project) => project.id === task.projectId)?.name || "No project"}
                    </span>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-zinc-700" />
                    )}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-zinc-400">
              No tasks found matching &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="px-4 py-2 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-white border border-zinc-200 px-1 py-0.5 rounded text-[10px] text-zinc-600">
                ↑
              </kbd>{" "}
              <kbd className="font-mono bg-white border border-zinc-200 px-1 py-0.5 rounded text-[10px] text-zinc-600">
                ↓
              </kbd>{" "}
              navigate
            </span>
            <span>
              <kbd className="font-mono bg-white border border-zinc-200 px-1 py-0.5 rounded text-[10px] text-zinc-600">
                ↵
              </kbd>{" "}
              open
            </span>
          </div>
          <span>
            <kbd className="font-mono bg-white border border-zinc-200 px-1 py-0.5 rounded text-[10px] text-zinc-600">
              esc
            </kbd>{" "}
            dismiss
          </span>
        </div>
      </div>
    </div>
  );
}

export function CommandPalette({ isOpen, ...dialogProps }: CommandPaletteProps) {
  if (!isOpen) return null;
  return <CommandPaletteDialog {...dialogProps} />;
}
