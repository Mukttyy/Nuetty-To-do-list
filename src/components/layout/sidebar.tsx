"use client";

import * as React from "react";
import { Archive, Calendar, CheckCircle2, ChevronsLeft, ChevronsRight, CircleDashed, Clock, Inbox, Plus, Search, Trash2, X } from "lucide-react";
import { BrandMark } from "@/components/ui/brand-mark";
import { ProjectIcon } from "@/components/ui/project-icon";
import { SidebarItem } from "@/components/ui/sidebar-item";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/task";

interface Counts {
  inbox?: number; today?: number; upcoming?: number; anytime?: number; someday?: number;
  completed?: number; trash?: number; projects?: Record<string, number>;
}
export interface SidebarProps {
  activeView?: string;
  onSelectView?: (viewId: string) => void;
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenCommandPalette?: () => void;
  isMobileOpen?: boolean;
  counts?: Counts;
  projects?: Project[];
  onCreateProject?: (name: string) => string | undefined;
}

export function Sidebar({ activeView = "today", onSelectView, className, isCollapsed = false, onToggleCollapse, onOpenCommandPalette, isMobileOpen = false, counts = {}, projects = [], onCreateProject }: SidebarProps) {
  const [addingProject, setAddingProject] = React.useState(false);
  const [projectName, setProjectName] = React.useState("");
  const [projectError, setProjectError] = React.useState<string | null>(null);
  const submitProject = () => {
    const value = projectName.trim();
    if (!value) {
      setProjectError("Enter a project name.");
      return;
    }
    const error = onCreateProject?.(value);
    if (error) {
      setProjectError(error);
      return;
    }
    setProjectName("");
    setProjectError(null);
    setAddingProject(false);
  };
  const nav = [
    ["inbox", "Inbox", Inbox, "text-blue-600"],
    ["today", "Today", Calendar, "text-emerald-600"],
    ["upcoming", "Upcoming", Clock, "text-violet-600"],
    ["anytime", "Anytime", CircleDashed, "text-zinc-500"],
    ["someday", "Someday", Archive, "text-amber-600"],
    ["completed", "Completed", CheckCircle2, "text-zinc-500"],
    ["trash", "Trash", Trash2, "text-zinc-400"],
  ] as const;

  return <aside aria-label="Primary navigation" className={cn("fixed inset-y-0 left-0 z-50 flex h-full w-60 -translate-x-full flex-col border-r border-zinc-200 bg-[#F7F8FA] transition-all md:static md:translate-x-0", isMobileOpen && "translate-x-0", isCollapsed && "md:w-14", className)}>
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className={cn("flex items-center pt-4 pb-2.5", isCollapsed ? "flex-col gap-2 px-2" : "justify-between px-3.5")}>
        <div className="flex items-center gap-2"><BrandMark size={24} />{!isCollapsed && <span className="text-sm font-bold tracking-tight">Nuetty</span>}</div>
        <button type="button" onClick={onToggleCollapse} className="hidden h-7 w-7 items-center justify-center rounded text-zinc-400 hover:bg-zinc-200 hover:text-zinc-800 md:inline-flex" aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>{isCollapsed ? <ChevronsRight className="h-3.5 w-3.5" /> : <ChevronsLeft className="h-3.5 w-3.5" />}</button>
      </div>

      <div className="px-2 pb-3">
        <button type="button" onClick={onOpenCommandPalette} className={cn("flex h-8 w-full items-center rounded-md text-xs text-zinc-500 hover:bg-zinc-200/70", isCollapsed ? "justify-center" : "gap-2 border border-zinc-200 bg-white px-2.5")} aria-label="Quick find">
          <Search className="h-4 w-4" />{!isCollapsed && <><span className="flex-1 text-left">Quick find</span><kbd className="text-[10px] text-zinc-400">⌘K</kbd></>}
        </button>
      </div>

      <nav className="space-y-0.5 px-2">
        {nav.map(([id, label, Icon, color]) => <SidebarItem key={id} icon={<Icon className={cn("h-4 w-4", color)} />} label={label} count={counts[id]} active={activeView === id} onClick={() => onSelectView?.(id)} compact={isCollapsed} />)}
      </nav>

      <div className="mt-5 border-t border-zinc-200 px-2 pt-3">
        {!isCollapsed && <div className="mb-1 flex items-center justify-between px-2">
          <span className="text-xs font-semibold text-zinc-600">Projects</span>
          <button type="button" onClick={() => { setAddingProject(true); setProjectError(null); }} className="inline-flex h-7 w-7 items-center justify-center rounded text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700" aria-label="Create project"><Plus className="h-3.5 w-3.5" /></button>
        </div>}
        {addingProject && !isCollapsed && <div className="mb-2">
          <div className={cn("flex items-center gap-1 rounded-md border bg-white px-2", projectError ? "border-red-300" : "border-zinc-200")}>
            <input autoFocus value={projectName} onChange={(event) => { setProjectName(event.target.value); setProjectError(null); }} onKeyDown={(event) => { if (event.key === "Enter") submitProject(); if (event.key === "Escape") { setAddingProject(false); setProjectError(null); } }} placeholder="Project name" aria-label="Project name" aria-invalid={Boolean(projectError)} aria-describedby={projectError ? "project-create-error" : undefined} className="h-9 min-w-0 flex-1 bg-transparent text-xs outline-none" />
            <button type="button" onClick={() => { setAddingProject(false); setProjectError(null); }} aria-label="Cancel project"><X className="h-3.5 w-3.5 text-zinc-400" /></button>
          </div>
          {projectError && <p id="project-create-error" role="alert" className="px-2 pt-1.5 text-[11px] text-red-700">{projectError}</p>}
        </div>}
        <div className="space-y-0.5">
          {projects.filter((project) => !project.archived).map((project) => <SidebarItem key={project.id} icon={<ProjectIcon name={project.icon} className="h-4 w-4" style={{ color: project.color }} />} label={project.name} count={counts.projects?.[project.id]} active={activeView === `project:${project.id}`} onClick={() => onSelectView?.(`project:${project.id}`)} compact={isCollapsed} />)}
          {!isCollapsed && projects.some((project) => project.archived) && <p className="px-2 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Archived</p>}
          {!isCollapsed && projects.filter((project) => project.archived).map((project) => <SidebarItem key={project.id} icon={<Archive className="h-4 w-4 text-zinc-400" />} label={project.name} count={counts.projects?.[project.id]} active={activeView === `project:${project.id}`} onClick={() => onSelectView?.(`project:${project.id}`)} />)}
          {projects.length === 0 && !isCollapsed && <p className="px-2 py-2 text-[11px] leading-4 text-zinc-400">Create a project when a task needs a home.</p>}
          {isCollapsed && <button type="button" onClick={() => { setAddingProject(true); setProjectError(null); }} className="flex h-8 w-full items-center justify-center rounded text-zinc-500 hover:bg-zinc-200" aria-label="Create project"><Plus className="h-4 w-4" /></button>}
        </div>
      </div>
    </div>
  </aside>;
}
