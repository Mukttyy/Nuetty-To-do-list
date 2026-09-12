import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors border select-none",
  {
    variants: {
      variant: {
        today:
          "bg-zinc-50 text-zinc-600 border-zinc-200",
        tomorrow:
          "bg-zinc-50 text-zinc-600 border-zinc-200",
        upcoming:
          "bg-zinc-50 text-zinc-600 border-zinc-200",
        someday:
          "bg-zinc-50 text-zinc-600 border-zinc-200",
        overdue:
          "bg-rose-100 text-rose-800 border-rose-200/60 font-semibold",
        inbox:
          "bg-zinc-50 text-zinc-600 border-zinc-200",
        tag:
          "bg-zinc-100/90 text-zinc-700 border-zinc-200/70 hover:bg-zinc-200/70 cursor-default",
        counter:
          "bg-transparent text-zinc-400 border-transparent font-normal",
        neutral:
          "bg-zinc-100 text-zinc-600 border-zinc-200",
      },
      size: {
        xs: "text-[10px] px-1.5 py-0.5 rounded-[4px] gap-1",
        sm: "text-[11px] px-2 py-0.5 rounded-[5px] gap-1 leading-tight",
        md: "text-xs px-2.5 py-1 rounded-[6px] gap-1.5",
        tag: "text-[12px] px-2.5 py-0.5 rounded-[6px] gap-1 font-normal tracking-tight",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "sm",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  prefixHash?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, prefixHash, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      >
        {prefixHash && <span className="opacity-50">#</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
