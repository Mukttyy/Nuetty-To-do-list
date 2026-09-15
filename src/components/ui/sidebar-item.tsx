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
  compact?: boolean;
}

export function SidebarItem({
  icon,
  label,
  count,
  active = false,
  onClick,
  className,
  compact = false,
}: SidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={compact ? label : undefined}
      aria-label={compact ? label : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-11 w-full items-center justify-between gap-2.5 rounded-lg px-3 py-1.5 text-left text-[13px] font-medium transition-colors select-none md:min-h-8",
        compact && "justify-center px-0",
        active
          ? "bg-[#EAECEE] text-[#18181B] font-semibold"
          : "text-[#71717A] hover:bg-[#ECEEF1] hover:text-[#18181B]",
        className
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0 truncate">
        {icon ? (
          <span className="shrink-0 flex items-center justify-center">{icon}</span>
        ) : null}
        {!compact && <span className="truncate">{label}</span>}
      </div>

      {!compact && count !== undefined && (
        <span className="shrink-0 text-[12px] font-normal tabular-nums text-zinc-500">
          {count}
        </span>
      )}
    </button>
  );
}
