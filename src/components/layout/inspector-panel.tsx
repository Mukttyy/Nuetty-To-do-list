"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { PropertyRow } from "@/components/ui/property-row";
import { Dropdown } from "@/components/ui/dropdown";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { RichNotes } from "@/components/ui/rich-notes";
import { SubtaskItem } from "@/components/ui/subtask-item";
import { ActivityLog } from "@/components/ui/activity-log";
import { Calendar, ChevronDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InspectorTaskData {
  id: string;
  title: string;
  projectEmoji?: string;
  projectName?: string;
  dueDate?: string;
  dueBadge?: string;
  status: string;
  assigneeName: string;
  tags: string[];
  notes: string;
  subtasks: { id: string; title: string; completed: boolean }[];
  activity: { id: string; time: string; actor: string; description: string }[];
}

export interface InspectorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  task?: InspectorTaskData | null;
  onStatusChange?: (status: string) => void;
  onNotesChange?: (notes: string) => void;
  onSubtaskToggle?: (subtaskId: string, completed: boolean) => void;
  className?: string;
}

const statusOptions = [
  { value: "todo", label: "To Do", dotColor: "#71717A" },
  { value: "in_progress", label: "In Progress", dotColor: "#2563EB" },
  { value: "review", label: "Review", dotColor: "#8B5CF6" },
  { value: "done", label: "Done", dotColor: "#10B981" },
  { value: "someday", label: "Someday", dotColor: "#F59E0B" },
];

export function InspectorPanel({
  isOpen,
  onClose,
  task,
  onStatusChange,
  onNotesChange,
  onSubtaskToggle,
  className,
}: InspectorPanelProps) {
  if (!isOpen || !task) return null;

  return (
    <aside
      className={cn(
        "w-[360px] h-full border-l border-[#E5E7EB] bg-white flex flex-col justify-between shrink-0 select-none overflow-hidden",
        className
      )}
    >
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#E5E7EB] pb-3">
          <h2 className="text-sm font-bold text-[#18181B] leading-snug">
            Task Details: {task.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="h-6 w-6 inline-flex items-center justify-center rounded text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors -mr-1"
            title="Close Details (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Properties Grid */}
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#18181B] block mb-2">
            Properties
          </span>

          <PropertyRow label="Project">
            <span className="text-xs text-[#18181B] font-medium flex items-center gap-1.5">
              <span>{task.projectEmoji || "😎"}</span>
              <span>{task.projectName || "Personal"}</span>
            </span>
          </PropertyRow>

          <PropertyRow label="Due Date">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#18181B] flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                {task.dueDate || "No Due Date"}
              </span>
              {task.dueBadge && <Badge variant="today">{task.dueBadge}</Badge>}
            </div>
          </PropertyRow>

          <PropertyRow label="Status" labelIcon={<ChevronDown className="h-3 w-3 text-zinc-400" />}>
            <div className="w-36">
              <Dropdown
                size="sm"
                options={statusOptions}
                value={task.status}
                onChange={(val) => onStatusChange?.(val)}
              />
            </div>
          </PropertyRow>

          <PropertyRow label="Assignee">
            <div className="flex items-center gap-2">
              <Avatar initials="A" size="sm" />
              <span className="text-xs text-[#18181B]">{task.assigneeName}</span>
            </div>
          </PropertyRow>

          <PropertyRow label="Tags">
            <div className="flex items-center gap-1.5 flex-wrap">
              {task.tags.map((tag) => (
                <Badge key={tag} variant="tag" prefixHash>
                  {tag}
                </Badge>
              ))}
              <button
                type="button"
                className="h-5 w-5 inline-flex items-center justify-center rounded border border-[#E5E7EB] text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </PropertyRow>
        </div>

        {/* Notes Editor */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-[#18181B] block">Notes</span>
          <RichNotes
            value={task.notes}
            onChange={(val) => onNotesChange?.(val)}
            placeholder="Add notes, context, or links..."
          />
        </div>

        {/* Sub-tasks Section */}
        {task.subtasks.length > 0 && (
          <div className="border-t border-[#E5E7EB] pt-4 space-y-2">
            <span className="text-xs font-bold text-[#18181B] block">
              Sub-tasks
            </span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {task.subtasks.map((sub) => (
                <SubtaskItem
                  key={sub.id}
                  title={sub.title}
                  completed={sub.completed}
                  onCompletedChange={(done) => onSubtaskToggle?.(sub.id, done)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Activity Timeline */}
        {task.activity.length > 0 && (
          <div className="border-t border-[#E5E7EB] pt-4">
            <ActivityLog entries={task.activity} />
          </div>
        )}
      </div>

      {/* Footer Action Bar */}
      <div className="p-4 border-t border-[#E5E7EB] flex items-center justify-between gap-3 bg-white shrink-0">
        <Button
          variant="outline"
          size="sm"
          rightIcon={<ChevronDown className="h-3 w-3 text-zinc-400 ml-1" />}
        >
          Move Task to...
        </Button>
        <Button variant="primary" size="sm" onClick={onClose}>
          Close Details
        </Button>
      </div>
    </aside>
  );
}

