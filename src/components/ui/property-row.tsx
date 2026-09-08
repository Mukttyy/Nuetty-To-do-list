import * as React from "react";
import { cn } from "@/lib/utils";

export interface PropertyRowProps {
  label: string;
  children: React.ReactNode;
  labelIcon?: React.ReactNode;
  className?: string;
}

export function PropertyRow({
  label,
  children,
  labelIcon,
  className,
}: PropertyRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-1.5 text-xs select-none",
        className
      )}
    >
      <div className="flex items-center gap-1.5 w-24 shrink-0 text-[#71717A] font-normal">
        <span>{label}</span>
        {labelIcon}
      </div>
      <div className="flex-1 flex items-center gap-2 justify-start min-w-0">
        {children}
      </div>
    </div>
  );
}
