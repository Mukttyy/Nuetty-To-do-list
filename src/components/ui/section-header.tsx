"use client";

import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  title: string;
  count?: number;
  emoji?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function SectionHeader({
  title,
  count,
  emoji,
  isOpen = true,
  onToggle,
  className,
}: SectionHeaderProps) {
  return (
    <div
      onClick={onToggle}
      className={cn(
        "flex items-center gap-1.5 py-1 text-sm font-bold text-[#18181B] cursor-pointer select-none group w-fit",
        className
      )}
    >
      <span className="text-zinc-400 group-hover:text-[#18181B] transition-colors -ml-1">
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </span>

      {emoji && <span className="text-sm shrink-0">{emoji}</span>}

      <span className="group-hover:text-black transition-colors">{title}</span>

      {count !== undefined && (
        <span className="text-xs font-normal text-[#A1A1AA] ml-1">
          {count}
        </span>
      )}
    </div>
  );
}
