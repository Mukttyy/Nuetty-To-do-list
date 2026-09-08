import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = "No tasks remaining",
  description = "You are all done for today. Take a break or add a new task.",
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center select-none rounded-xl border border-dashed border-[#E5E7EB] bg-[#FAFAFA]",
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 mb-3">
        {icon || <CheckCircle2 className="h-5 w-5 text-emerald-600 stroke-[1.8]" />}
      </div>
      <h3 className="text-sm font-semibold text-[#18181B]">{title}</h3>
      <p className="text-xs text-[#71717A] max-w-xs mt-1 leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
