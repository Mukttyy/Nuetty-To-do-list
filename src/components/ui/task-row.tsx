"use client";

import * as React from "react";
import { GripVertical, Folder, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface TaskRowProps {
  id?: string;
  title: string;
  completed?: boolean;
  onCompletedChange?: (completed: boolean) => void;
  selected?: boolean;
  onSelect?: () => void;
  dateBadge?: React.ReactNode;
  addedAgo?: string;
  categoryIcon?: React.ReactNode;
  showFolderIcon?: boolean;
  isDragging?: boolean;
  className?: string;
  onActionClick?: (e: React.MouseEvent) => void;
}

export const TaskRow = React.forwardRef<HTMLDivElement, TaskRowProps>(
  (
    {
      title,
      completed = false,
      onCompletedChange,
      selected = false,
      onSelect,
      dateBadge,
      addedAgo,
      categoryIcon,
      showFolderIcon = false,
      isDragging = false,
      className,
      onActionClick,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        onClick={onSelect}
        className={cn(
          "group relative flex items-center justify-between gap-3 px-2.5 py-2 rounded-xl transition-all duration-150 cursor-pointer select-none",
          selected
            ? "bg-zinc-100/90 ring-1 ring-zinc-200/60"
            : "hover:bg-zinc-50/80 active:bg-zinc-100/60",
          isDragging &&
            "shadow-lg ring-1 ring-zinc-300/80 bg-white scale-[1.01] z-30 opacity-95",
          className
        )}
      >
        {/* Left Side: Grip + Checkbox + Title */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* 6-dot Drag Handle */}
          <div
            className={cn(
              "flex items-center justify-center -ml-1 text-zinc-300 transition-colors duration-150 cursor-grab active:cursor-grabbing",
              selected ? "text-blue-500" : "group-hover:text-zinc-400"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4 stroke-[2.2]" />
          </div>

          {/* Checkbox */}
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={completed}
              onCheckedChange={onCompletedChange}
            />
          </div>

          {/* Title and subtitle */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-[14px] font-medium transition-colors truncate",
                  completed
                    ? "line-through text-zinc-400 font-normal"
                    : "text-zinc-900"
                )}
              >
                {title}
              </span>
              {dateBadge && <div className="shrink-0">{dateBadge}</div>}
            </div>

            {addedAgo && (
              <p className="text-[11px] text-zinc-400 mt-0.5 font-normal">
                Added: {addedAgo}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Category/Folder Icon + Context Action */}
        <div className="flex items-center gap-1.5 shrink-0 text-zinc-400">
          {categoryIcon && (
            <div className="flex items-center justify-center text-zinc-500">
              {categoryIcon}
            </div>
          )}

          {showFolderIcon && (
            <div className="flex items-center justify-center text-zinc-600 bg-zinc-100 p-1 rounded">
              <Folder className="h-3.5 w-3.5 fill-current" />
            </div>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onActionClick?.(e);
            }}
            className="h-6 w-6 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }
);

TaskRow.displayName = "TaskRow";

