"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface SubtaskItemProps {
  id?: string;
  title: string;
  completed?: boolean;
  onCompletedChange?: (completed: boolean) => void;
  withSound?: boolean;
  className?: string;
}

export function SubtaskItem({
  title,
  completed = false,
  onCompletedChange,
  withSound = true,
  className,
}: SubtaskItemProps) {
  return (
    <label
      className={cn(
        "flex items-center gap-2.5 py-1 text-[12.5px] cursor-pointer select-none transition-colors",
        className
      )}
    >
      <Checkbox
        size="sm"
        checked={completed}
        onCheckedChange={onCompletedChange}
        withSound={withSound}
      />
      <span
        className={cn(
          "transition-colors truncate",
          completed ? "line-through text-zinc-400 font-normal" : "text-zinc-800 font-normal"
        )}
      >
        {title}
      </span>
    </label>
  );
}
