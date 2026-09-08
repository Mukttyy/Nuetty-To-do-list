"use client";

import * as React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { SidebarItem } from "@/components/ui/sidebar-item";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Search,
  Inbox,
  Calendar,
  Clock,
  Archive,
  Trash2,
  Plus,
  ChevronsLeft,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarProps {
  activeView?: string;
  onSelectView?: (viewId: string) => void;
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  activeView = "today",
  onSelectView,
  className,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const [isListExpanded, setIsListExpanded] = React.useState(true);

  return (
    <aside
      className={cn(
        "w-60 h-full border-r border-[#E5E7EB] bg-[#F7F8FA] flex flex-col justify-between shrink-0 select-none transition-all duration-200",
        isCollapsed && "w-14 items-center",
        className
      )}
    >
      {/* Top Section */}
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
        {/* Profile / Account Switcher */}
        <div className="pt-5 px-4 pb-3 flex items-center justify-between shrink-0 cursor-pointer hover:opacity-85 transition-opacity">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar initials="A" size="sm" />
            {!isCollapsed && (
              <span className="text-xs font-semibold text-[#18181B] truncate">
                Abram Vaccaro
              </span>
            )}
          </div>
          {!isCollapsed && (
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
          )}
        </div>

        {/* Quick Find Search */}
        {!isCollapsed && (
          <div className="px-3 pb-3">
            <Input
              size="sm"
              placeholder="Quick find"
              leftIcon={<Search className="h-3.5 w-3.5" />}
              rightAction={
                <span className="text-[10px] font-mono text-[#A1A1AA] bg-[#F4F5F7] px-1 py-0.5 rounded border border-[#E5E7EB]">
                  ⌘K
                </span>
              }
            />
          </div>
        )}

        {/* Core Navigation Views */}
        <div className="px-2 space-y-0.5">
          <SidebarItem
            icon={<Inbox className="h-4 w-4 text-[#2563EB]" />}
            label="Inbox"
            active={activeView === "inbox"}
            onClick={() => onSelectView?.("inbox")}
          />
          <SidebarItem
            icon={<Calendar className="h-4 w-4 text-[#10B981]" />}
            label="Today"
            count={7}
            active={activeView === "today"}
            onClick={() => onSelectView?.("today")}
          />
          <SidebarItem
            icon={<Clock className="h-4 w-4 text-[#8B5CF6]" />}
            label="Upcoming"
            count={3}
            active={activeView === "upcoming"}
            onClick={() => onSelectView?.("upcoming")}
          />
          <SidebarItem
            icon={<Archive className="h-4 w-4 text-[#F59E0B]" />}
            label="Someday"
            count={5}
            active={activeView === "someday"}
            onClick={() => onSelectView?.("someday")}
          />
          <SidebarItem
            icon={<Trash2 className="h-4 w-4 text-zinc-400" />}
            label="Trash"
            active={activeView === "trash"}
            onClick={() => onSelectView?.("trash")}
          />
        </div>

        {/* Projects / Lists Group */}
        {!isCollapsed && (
          <div className="mt-5 px-2 pt-3 border-t border-[#E5E7EB]/80">
            {/* List Collapsible Header */}
            <div
              onClick={() => setIsListExpanded(!isListExpanded)}
              className="flex items-center justify-between px-2 py-1 text-xs font-bold text-[#18181B] cursor-pointer hover:text-black transition-colors"
            >
              <div className="flex items-center gap-1">
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-zinc-400 transition-transform duration-150",
                    !isListExpanded && "-rotate-90"
                  )}
                />
                <span>List</span>
              </div>
            </div>

            {/* Projects Items */}
            {isListExpanded && (
              <div className="space-y-0.5 mt-1">
                <SidebarItem
                  emoji="😎"
                  label="Personal"
                  count={7}
                  active={activeView === "project-personal"}
                  onClick={() => onSelectView?.("project-personal")}
                />
                <SidebarItem
                  emoji="🎯"
                  label="Work"
                  count={4}
                  active={activeView === "project-work"}
                  onClick={() => onSelectView?.("project-work")}
                />
                <div className="pt-1 px-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs font-medium text-[#2563EB] hover:text-blue-700 hover:bg-blue-50/60"
                    leftIcon={<Plus className="h-3.5 w-3.5 text-[#2563EB]" />}
                  >
                    Add Project
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer Section */}
      <div className="p-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#71717A] shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center gap-1 text-[11px] text-[#71717A] truncate">
            <span>Workspace: Personal</span>
            <span className="opacity-40">|</span>
            <button
              type="button"
              className="hover:text-[#18181B] inline-flex items-center gap-1 transition-colors"
            >
              <Settings className="h-3 w-3" />
              <span>Settings</span>
            </button>
          </div>
        ) : null}

        <button
          type="button"
          onClick={onToggleCollapse}
          className="h-6 w-6 inline-flex items-center justify-center rounded text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200/60 transition-colors"
          title="Collapse sidebar"
        >
          <ChevronsLeft className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  );
}

