"use client";

import * as React from "react";
import { Archive, Folder, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { InlineTaskCreator } from "@/components/ui/inline-task-creator";
import { SectionHeader } from "@/components/ui/section-header";
import { TaskListView, type TaskListActions } from "@/components/views/task-list-view";
import type { Project, Task } from "@/types/task";

interface ProjectViewProps extends TaskListActions {
  project: Project;
  tasks: Task[];
  onAddTask: (title: string, sectionId?: string) => void;
  onRenameProject: (name: string) => void;
  onArchiveProject: () => void;
  onDeleteProject: () => void;
  onAddSection: (name: string) => void;
  onRenameSection: (sectionId: string, name: string) => void;
  onDeleteSection: (sectionId: string) => void;
}

export function ProjectView({ project, tasks, onAddTask, onRenameProject, onArchiveProject, onDeleteProject, onAddSection, onRenameSection, onDeleteSection, ...actions }: ProjectViewProps) {
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({});
  const [creatingSectionId, setCreatingSectionId] = React.useState<string | null>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const generalTasks = tasks.filter((task) => !task.sectionId);

  const askRenameProject = () => {
    const name = window.prompt("Project name", project.name);
    if (name?.trim()) onRenameProject(name);
    setMenuOpen(false);
  };
  const askAddSection = () => {
    const name = window.prompt("New section name");
    if (name?.trim()) onAddSection(name);
    setMenuOpen(false);
  };

  return (
    <div className="mx-auto w-full max-w-[800px] space-y-6 px-4 pb-16 pt-5 sm:px-6 sm:pt-7">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <Folder className="h-4 w-4 text-zinc-500" />
            <h1 className="truncate text-xl font-semibold tracking-tight text-zinc-950">{project.name}</h1>
            <span className="text-sm text-zinc-500">{tasks.length}</span>
          </div>
          <p className="mt-1.5 text-xs text-zinc-500">Tasks and sections in this project.</p>
        </div>
        <div className="relative">
          <button type="button" onClick={() => setMenuOpen((open) => !open)} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100" aria-label="Project options"><MoreHorizontal className="h-4 w-4" /></button>
          {menuOpen && <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg">
            <button type="button" onClick={askRenameProject} className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-xs hover:bg-zinc-50"><Pencil className="h-3.5 w-3.5" />Rename project</button>
            <button type="button" onClick={askAddSection} className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-xs hover:bg-zinc-50"><Plus className="h-3.5 w-3.5" />Add section</button>
            <button type="button" onClick={() => { onArchiveProject(); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-xs hover:bg-zinc-50"><Archive className="h-3.5 w-3.5" />{project.archived ? "Unarchive project" : "Archive project"}</button>
            <button type="button" onClick={() => { if (window.confirm(`Delete “${project.name}”? Its tasks will be moved to Inbox.`)) onDeleteProject(); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-xs text-red-700 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" />Delete project</button>
          </div>}
        </div>
      </div>

      <InlineTaskCreator placeholder={`Add a task to ${project.name}...`} onAdd={(title) => onAddTask(title)} />

      {project.sections.map((section) => {
        const sectionTasks = tasks.filter((task) => task.sectionId === section.id);
        const isOpen = openSections[section.id] ?? true;
        return <section key={section.id} className="space-y-1">
          <div className="group flex items-center gap-1">
            <SectionHeader title={section.name} count={sectionTasks.length} isOpen={isOpen} onToggle={() => setOpenSections((current) => ({ ...current, [section.id]: !isOpen }))} onAdd={() => { setCreatingSectionId(section.id); setOpenSections((current) => ({ ...current, [section.id]: true })); }} />
            <button type="button" onClick={() => { const name = window.prompt("Section name", section.name); if (name?.trim()) onRenameSection(section.id, name); }} className="inline-flex h-7 w-7 items-center justify-center rounded text-zinc-300 opacity-0 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:opacity-100 group-hover:opacity-100" aria-label={`Rename ${section.name}`}><Pencil className="h-3 w-3" /></button>
            <button type="button" onClick={() => window.confirm(`Delete section “${section.name}”? Its tasks will move to General.`) && onDeleteSection(section.id)} className="inline-flex h-7 w-7 items-center justify-center rounded text-zinc-300 opacity-0 hover:bg-red-50 hover:text-red-600 focus-visible:opacity-100 group-hover:opacity-100" aria-label={`Delete ${section.name}`}><Trash2 className="h-3 w-3" /></button>
          </div>
          {isOpen && <div className="space-y-1">
            <TaskListView {...actions} projects={actions.projects} title="" icon={null} tasks={sectionTasks} emptyTitle="" emptyDescription="" allowCreate={false} bare />
            {creatingSectionId === section.id && <InlineTaskCreator open placeholder={`Add a task to ${section.name}...`} onAdd={(title) => { onAddTask(title, section.id); setCreatingSectionId(null); }} onOpenChange={(open) => !open && setCreatingSectionId(null)} />}
          </div>}
        </section>;
      })}

      {(generalTasks.length > 0 || project.sections.length === 0) && <section className="space-y-1">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">General</h2>
        <TaskListView {...actions} projects={actions.projects} title="" icon={null} tasks={generalTasks} emptyTitle="" emptyDescription="" allowCreate={false} bare />
      </section>}
    </div>
  );
}
