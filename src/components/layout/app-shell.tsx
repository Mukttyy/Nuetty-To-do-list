"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
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
      {isMobileNavigationOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={() => setIsMobileNavigationOpen(false)}
        />
      )}

      {/* Column 1: Sidebar (Full Height 100vh) */}
      <Sidebar
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
      <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden bg-white">
        <TopBar
          completedCount={completedCount}
          totalCount={totalCount}
          syncStatus={syncStatus}
          onBeforeLogout={onBeforeLogout}
          onOpenNavigation={() => setIsMobileNavigationOpen(true)}
        />
        <main className="flex-1 h-full overflow-y-auto bg-white flex flex-col min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
