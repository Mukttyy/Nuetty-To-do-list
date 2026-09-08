"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  emoji?: string;
}

export function SidebarItem({
  icon,
  label,
  count,
  active = false,
  onClick,
  className,
  emoji,
}: SidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors select-none text-left",
        active
          ? "bg-[#EAECEE] text-[#18181B] font-semibold"
          : "text-[#71717A] hover:bg-[#ECEEF1] hover:text-[#18181B]",
        className
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0 truncate">
        {emoji ? (
          <span className="text-sm shrink-0">{emoji}</span>
        ) : icon ? (
          <span className="shrink-0 flex items-center justify-center">{icon}</span>
        ) : null}
        <span className="truncate">{label}</span>
      </div>

      {count !== undefined && (
        <span
          className={cn(
            "text-[11px] font-normal tabular-nums shrink-0",
            active ? "text-[#71717A]" : "text-[#A1A1AA]"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

