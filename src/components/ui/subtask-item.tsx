"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface SubtaskItemProps {
  id?: string;
  title: string;
  completed?: boolean;
  onCompletedChange?: (completed: boolean) => void;
  className?: string;
}

export function SubtaskItem({
  title,
  completed = false,
  onCompletedChange,
  className,
}: SubtaskItemProps) {
  return (
    <label
      className={cn(
        "flex items-center gap-2.5 py-1 text-xs cursor-pointer select-none transition-colors",
        className
      )}
    >
      <Checkbox
        size="sm"
        checked={completed}
        onCheckedChange={onCompletedChange}
      />
      <span
        className={cn(
          "transition-colors",
          completed ? "line-through text-[#A1A1AA]" : "text-[#18181B]"
        )}
      >
        {title}
      </span>
    </label>
  );
}
