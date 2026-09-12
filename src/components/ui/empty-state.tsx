import * as React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("py-14 text-center", className)}>
      {icon && (
        <span className="mx-auto mb-2 flex h-6 w-6 items-center justify-center text-zinc-400">
          {icon}
        </span>
      )}
      <p className="text-[13px] font-medium text-zinc-600">{title}</p>
      {description && (
        <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-zinc-500">
          {description}
        </p>
      )}
    </div>
  );
}
