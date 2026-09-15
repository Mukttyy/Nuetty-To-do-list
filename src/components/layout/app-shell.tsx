"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { TaskSyncStatus } from "@/lib/use-tasks";
import type { Project } from "@/types/task";

export interface AppShellProps {
  children: React.ReactNode;
  activeView?: string;
  onSelectView?: (viewId: string) => void;
  onOpenCommandPalette?: () => void;
  completedCount?: number;
  totalCount?: number;
  syncStatus?: TaskSyncStatus;
  onBeforeLogout?: () => Promise<boolean>;
  counts?: {
    inbox?: number;
    today?: number;
    upcoming?: number;
    anytime?: number;
    someday?: number;
    completed?: number;
    trash?: number;
    projects?: Record<string, number>;
  };
  projects?: Project[];
  onCreateProject?: (name: string) => string | undefined;
  className?: string;
}

export function AppShell({
  children,
  activeView = "today",
  onSelectView,
  onOpenCommandPalette,
  completedCount,
  totalCount,
  syncStatus,
  onBeforeLogout,
  counts,
  projects,
  onCreateProject,
  className,
}: AppShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = React.useState(false);
  React.useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => { if (desktop.matches) setIsMobileNavigationOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  const handleSelectView = (viewId: string) => {
    onSelectView?.(viewId);
    setIsMobileNavigationOpen(false);
  };

  return (
    <div
      className={cn(
        "relative h-full w-full flex bg-white text-[#18181B] overflow-hidden",
        className
      )}
    >
      <a href="#task-content" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[90] focus:rounded focus:bg-white focus:p-3">Skip to tasks</a>
      <Dialog open={isMobileNavigationOpen} title="Navigation" placement="drawer" onClose={() => setIsMobileNavigationOpen(false)} className="bg-[#F7F8FA] p-3">
        <Sidebar activeView={activeView} onSelectView={handleSelectView} onOpenCommandPalette={() => { setIsMobileNavigationOpen(false); onOpenCommandPalette?.(); }} counts={counts} projects={projects} onCreateProject={onCreateProject} className="static min-h-0 w-full flex-1 translate-x-0 border-0" />
      </Dialog>

      {/* Column 1: Sidebar (Full Height 100vh) */}
      <Sidebar
        className="hidden md:flex"
        activeView={activeView}
        onSelectView={handleSelectView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onOpenCommandPalette={onOpenCommandPalette}
        counts={counts}
        projects={projects}
        onCreateProject={onCreateProject}
        isMobileOpen={isMobileNavigationOpen}
      />

      {/* Column 2: Main Task Area with Discreet Top Bar */}
      <div inert={isMobileNavigationOpen} className="flex-1 h-full flex flex-col min-w-0 overflow-hidden bg-white">
        <TopBar
          completedCount={completedCount}
          totalCount={totalCount}
          syncStatus={syncStatus}
          onBeforeLogout={onBeforeLogout}
          onOpenNavigation={() => setIsMobileNavigationOpen(true)}
        />
        <main id="task-content" tabIndex={-1} className="flex-1 h-full overflow-y-auto bg-white flex flex-col min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
