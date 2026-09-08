"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActivityEntry {
  id: string;
  time: string;
  actor: string;
  description: string;
}

export interface ActivityLogProps {
  entries: ActivityEntry[];
  defaultOpen?: boolean;
  className?: string;
}

export function ActivityLog({
  entries,
  defaultOpen = true,
  className,
}: ActivityLogProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={cn("text-xs select-none space-y-2", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full font-bold text-[#18181B] hover:text-black transition-colors"
      >
        <span>Activity</span>
        {isOpen ? (
          <ChevronUp className="h-3.5 w-3.5 text-zinc-400" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
        )}
      </button>

      {isOpen && (
        <div className="space-y-1 text-[11px] text-[#71717A] leading-relaxed">
          {entries.map((entry) => (
            <p key={entry.id}>
              <span className="text-[#A1A1AA]">({entry.time})</span>{" "}
              <span className="text-[#18181B] font-medium">{entry.actor}</span>{" "}
              <span>{entry.description}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

