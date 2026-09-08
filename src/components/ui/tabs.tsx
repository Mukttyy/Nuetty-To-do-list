"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  size?: "sm" | "md";
  className?: string;
}

export function Tabs({
  tabs,
  activeId,
  onChange,
  size = "sm",
  className,
}: TabsProps) {
  const sizeClasses = {
    sm: "p-0.5 text-xs",
    md: "p-1 text-sm",
  };

  const itemPadding = {
    sm: "px-2.5 py-1",
    md: "px-3.5 py-1.5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg bg-[#F4F5F7] border border-[#E5E7EB] select-none",
        sizeClasses[size],
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex items-center gap-1.5 rounded-md font-medium transition-all duration-150",
              itemPadding[size],
              isActive
                ? "bg-white text-[#18181B] shadow-xs font-semibold"
                : "text-[#71717A] hover:text-[#18181B]"
            )}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  "text-[10px] px-1 py-0.2 rounded-full",
                  isActive
                    ? "bg-[#F4F5F7] text-[#18181B]"
                    : "text-[#A1A1AA]"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
