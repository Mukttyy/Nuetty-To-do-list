"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { InspectorPanel, type InspectorTaskData } from "@/components/layout/inspector-panel";
import { cn } from "@/lib/utils";

export interface AppShellProps {
  children: React.ReactNode;
  activeView?: string;
  onSelectView?: (viewId: string) => void;
  selectedTask?: InspectorTaskData | null;
  isInspectorOpen?: boolean;
  onCloseInspector?: () => void;
  onStatusChange?: (status: string) => void;
  onNotesChange?: (notes: string) => void;
  onSubtaskToggle?: (subtaskId: string, completed: boolean) => void;
  className?: string;
}

export function AppShell({
  children,
  activeView = "today",
  onSelectView,
  selectedTask,
  isInspectorOpen = false,
  onCloseInspector,
  onStatusChange,
  onNotesChange,
  onSubtaskToggle,
  className,
}: AppShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  return (
    <div
      className={cn(
        "h-screen w-screen flex bg-white text-[#18181B] overflow-hidden select-none",
        className
      )}
    >
      {/* Column 1: Sidebar (Full Height 100vh) */}
      <Sidebar
        activeView={activeView}
        onSelectView={onSelectView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Column 2: Main Task Canvas (Flexible Center) */}
      <main className="flex-1 h-full overflow-y-auto bg-white flex flex-col min-w-0">
        {children}
      </main>

      {/* Column 3: Task Details Inspector (Right Column, 360px) */}
      <InspectorPanel
        isOpen={isInspectorOpen}
        onClose={onCloseInspector || (() => { })}
        task={selectedTask}
        onStatusChange={onStatusChange}
        onNotesChange={onNotesChange}
        onSubtaskToggle={onSubtaskToggle}
      />
    </div>
  );
}

