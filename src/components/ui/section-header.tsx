"use client";

import * as React from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  title: string;
  count?: number;
  isOpen?: boolean;
  onToggle?: () => void;
  onAdd?: () => void;
  className?: string;
}

export function SectionHeader({
  title,
  count,
  isOpen = true,
  onToggle,
  onAdd,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("group flex w-full items-center gap-1", className)}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex min-h-11 w-fit cursor-pointer select-none items-center gap-1.5 rounded py-1 text-[13.5px] font-semibold text-[#18181B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 sm:min-h-8"
      >
        <span className="-ml-1 text-zinc-400 transition-colors group-hover:text-[#18181B]">
          {isOpen ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </span>

        <span className="transition-colors group-hover:text-black">{title}</span>

        {count !== undefined && (
          <span className="ml-1 text-[12.5px] font-normal text-[#71717A]">
            {count}
          </span>
        )}
      </button>

      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          aria-label={`Add task to ${title}`}
          title={`Add task to ${title}`}
          className="inline-flex h-10 w-10 items-center justify-center rounded text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 sm:h-7 sm:w-7 sm:opacity-60 sm:hover:opacity-100 sm:focus-visible:opacity-100"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
