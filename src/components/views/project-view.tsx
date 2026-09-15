"use client";

import * as React from "react";
import { Archive, MoreHorizontal, Pencil, Plus, Trash2, X } from "lucide-react";
import { InlineTaskCreator } from "@/components/ui/inline-task-creator";
import { ProjectIcon, projectIconOptions } from "@/components/ui/project-icon";
import { SectionHeader } from "@/components/ui/section-header";
import { TaskListView, type TaskListActions } from "@/components/views/task-list-view";
import type { Project, Task } from "@/types/task";

interface ProjectViewProps extends TaskListActions {
  project: Project;
  tasks: Task[];
  onAddTask: (title: string, sectionId?: string) => void;
  onUpdateProject: (changes: Pick<Project, "name" | "description" | "color" | "icon">) => string | undefined;
  onArchiveProject: () => void;
  onDeleteProject: () => void;
  onAddSection: (name: string) => string | undefined;
  onRenameSection: (sectionId: string, name: string) => string | undefined;
  onDeleteSection: (sectionId: string) => void;
}

const projectColors = ["#52525B", "#2563EB", "#7C3AED", "#DB2777", "#DC2626", "#EA580C", "#CA8A04", "#059669"];

export function ProjectView({ project, tasks, onAddTask, onUpdateProject, onArchiveProject, onDeleteProject, onAddSection, onRenameSection, onDeleteSection, ...actions }: ProjectViewProps) {
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({});
  const [creatingSectionId, setCreatingSectionId] = React.useState<string | null>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState(false);
  const [draftName, setDraftName] = React.useState(project.name);
  const [draftDescription, setDraftDescription] = React.useState(project.description ?? "");
  const [draftIcon, setDraftIcon] = React.useState(project.icon ?? "folder");
  const [draftColor, setDraftColor] = React.useState(project.color);
  const [projectError, setProjectError] = React.useState<string | null>(null);
  const [sectionError, setSectionError] = React.useState<string | null>(null);
  const [showCompleted, setShowCompleted] = React.useState(false);
  const completedCount = tasks.filter((task) => task.completed).length;
  const visibleTasks = showCompleted ? tasks : tasks.filter((task) => !task.completed);
  const generalTasks = visibleTasks.filter((task) => !task.sectionId);

  const openProjectEditor = () => {
    setDraftName(project.name);
    setDraftDescription(project.description ?? "");
    setDraftIcon(project.icon ?? "folder");
    setDraftColor(project.color);
    setProjectError(null);
    setEditingProject(true);
    setMenuOpen(false);
  };
  const saveProject = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draftName.trim()) return;
    const error = onUpdateProject({ name: draftName, description: draftDescription, icon: draftIcon, color: draftColor });
    if (error) {
      setProjectError(error);
      return;
    }
    setEditingProject(false);
  };
  const askAddSection = () => {
    const name = window.prompt("New section name");
    if (name?.trim()) setSectionError(onAddSection(name) ?? null);
    setMenuOpen(false);
  };

  return (
    <div className="mx-auto w-full max-w-[800px] space-y-6 px-4 pb-16 pt-5 sm:px-6 sm:pt-7">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <ProjectIcon name={project.icon} className="h-4 w-4" style={{ color: project.color }} />
            <h1 className="truncate text-xl font-semibold tracking-tight text-zinc-950">{project.name}</h1>
            <span className="text-sm text-zinc-500">{tasks.filter((task) => !task.completed).length}</span>
          </div>
          {project.description && <p className="mt-1.5 max-w-xl text-xs leading-5 text-zinc-500">{project.description}</p>}
        </div>
        <div className="relative">
          <button type="button" onClick={() => setMenuOpen((open) => !open)} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100" aria-label="Project options"><MoreHorizontal className="h-4 w-4" /></button>
          {menuOpen && <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg">
            <button type="button" onClick={openProjectEditor} className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-xs hover:bg-zinc-50"><Pencil className="h-3.5 w-3.5" />Edit project</button>
            <button type="button" onClick={askAddSection} className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-xs hover:bg-zinc-50"><Plus className="h-3.5 w-3.5" />Add section</button>
            <button type="button" onClick={() => { onArchiveProject(); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-xs hover:bg-zinc-50"><Archive className="h-3.5 w-3.5" />{project.archived ? "Unarchive project" : "Archive project"}</button>
            <button type="button" onClick={() => { if (window.confirm(`Delete “${project.name}”? Its tasks will move to Inbox and keep their due dates.`)) onDeleteProject(); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-xs text-red-700 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" />Delete project</button>
          </div>}
        </div>
      </div>

      {sectionError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{sectionError}</p>}

      {completedCount > 0 && <label className="flex min-h-10 w-fit cursor-pointer items-center gap-2 text-xs font-medium text-zinc-600">
        <input type="checkbox" checked={showCompleted} onChange={(event) => setShowCompleted(event.target.checked)} className="h-4 w-4 rounded border-zinc-300 accent-zinc-900" />
        Show completed ({completedCount})
      </label>}

      <InlineTaskCreator placeholder={`Add a task to ${project.name}...`} onAdd={(title) => onAddTask(title)} />

      {project.sections.map((section) => {
        const sectionTasks = visibleTasks.filter((task) => task.sectionId === section.id);
        const isOpen = openSections[section.id] ?? true;
        return <section key={section.id} className="space-y-1">
          <div className="group flex items-center gap-1">
            <SectionHeader title={section.name} count={sectionTasks.length} isOpen={isOpen} onToggle={() => setOpenSections((current) => ({ ...current, [section.id]: !isOpen }))} onAdd={() => { setCreatingSectionId(section.id); setOpenSections((current) => ({ ...current, [section.id]: true })); }} />
            <button type="button" onClick={() => { const name = window.prompt("Section name", section.name); if (name?.trim()) setSectionError(onRenameSection(section.id, name) ?? null); }} className="inline-flex h-7 w-7 items-center justify-center rounded text-zinc-300 opacity-0 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:opacity-100 group-hover:opacity-100" aria-label={`Rename ${section.name}`}><Pencil className="h-3 w-3" /></button>
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

      {editingProject && <div className="fixed inset-0 z-[70] flex items-end justify-center bg-zinc-950/30 p-0 sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setEditingProject(false)}>
        <form onSubmit={saveProject} role="dialog" aria-modal="true" aria-labelledby="edit-project-title" className="w-full rounded-t-2xl bg-white p-5 shadow-xl sm:max-w-md sm:rounded-xl sm:p-6">
          <div className="flex items-center justify-between">
            <h2 id="edit-project-title" className="text-base font-semibold text-zinc-950">Edit project</h2>
            <button type="button" onClick={() => setEditingProject(false)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100" aria-label="Close project editor"><X className="h-4 w-4" /></button>
          </div>

          <div className="mt-5 space-y-5">
            <div>
              <label htmlFor="project-edit-name" className="mb-1.5 block text-xs font-medium text-zinc-700">Name</label>
              <input id="project-edit-name" autoFocus required maxLength={100} value={draftName} onChange={(event) => { setDraftName(event.target.value); setProjectError(null); }} aria-invalid={Boolean(projectError)} aria-describedby={projectError ? "project-edit-error" : undefined} className={`h-10 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2 ${projectError ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-zinc-300 focus:border-zinc-600 focus:ring-zinc-200"}`} />
              {projectError && <p id="project-edit-error" role="alert" className="mt-1.5 text-xs text-red-700">{projectError}</p>}
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between"><label htmlFor="project-edit-description" className="text-xs font-medium text-zinc-700">Description</label><span className="text-[10px] text-zinc-400">{draftDescription.length}/280</span></div>
              <textarea id="project-edit-description" maxLength={280} rows={3} value={draftDescription} onChange={(event) => setDraftDescription(event.target.value)} placeholder="What belongs in this project?" className="w-full resize-none rounded-lg border border-zinc-300 px-3 py-2 text-sm leading-5 outline-none placeholder:text-zinc-400 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-200" />
            </div>
            <fieldset>
              <legend className="mb-2 text-xs font-medium text-zinc-700">Icon</legend>
              <div className="grid grid-cols-7 gap-2">
                {projectIconOptions.map((option) => <button key={option.value} type="button" onClick={() => setDraftIcon(option.value)} className={`inline-flex aspect-square items-center justify-center rounded-lg border ${draftIcon === option.value ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 text-zinc-500 hover:bg-zinc-50"}`} aria-label={option.label} aria-pressed={draftIcon === option.value}><option.icon className="h-4 w-4" /></button>)}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-xs font-medium text-zinc-700">Color</legend>
              <div className="flex flex-wrap gap-2.5">
                {projectColors.map((color) => <button key={color} type="button" onClick={() => setDraftColor(color)} className={`h-7 w-7 rounded-full border-2 ${draftColor === color ? "border-zinc-900 ring-2 ring-zinc-200 ring-offset-2" : "border-white"}`} style={{ backgroundColor: color }} aria-label={`Use color ${color}`} aria-pressed={draftColor === color} />)}
              </div>
            </fieldset>
          </div>

          <div className="mt-6 flex justify-end gap-2 border-t border-zinc-100 pt-4">
            <button type="button" onClick={() => setEditingProject(false)} className="h-9 rounded-lg px-3.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100">Cancel</button>
            <button type="submit" disabled={!draftName.trim()} className="h-9 rounded-lg bg-zinc-900 px-4 text-xs font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40">Save changes</button>
          </div>
        </form>
      </div>}
    </div>
  );
}
