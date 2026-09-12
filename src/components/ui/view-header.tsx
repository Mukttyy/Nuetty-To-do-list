import * as React from "react";
import { cn } from "@/lib/utils";

export interface ViewHeaderProps {
  title: string;
  count?: number;
  icon?: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function ViewHeader({
  title,
  count,
  icon,
  description,
  actions,
  className,
}: ViewHeaderProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex min-h-8 flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex min-w-0 items-center gap-2.5">
          {icon && (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center text-zinc-500">
              {icon}
            </span>
          )}
          <h1 className="truncate text-xl font-semibold tracking-[-0.02em] text-zinc-950">
            {title}
          </h1>
          {count !== undefined && (
            <span className="text-sm font-normal tabular-nums text-zinc-500">
              {count}
            </span>
          )}
        </div>
        {actions && (
          <div className="basis-full sm:basis-auto sm:shrink-0">{actions}</div>
        )}
      </div>
      {description && (
        <p className="max-w-2xl text-xs leading-5 text-zinc-500">{description}</p>
      )}
    </div>
  );
}
