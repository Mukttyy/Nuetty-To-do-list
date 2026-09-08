import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightAction, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-zinc-400">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 transition-colors shadow-none",
            "placeholder:text-zinc-400",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/80 focus-visible:border-zinc-400",
            "disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon ? "pl-9" : "pl-3",
            rightAction ? "pr-10" : "pr-3",
            className
          )}
          ref={ref}
          {...props}
        />
        {rightAction && (
          <div className="absolute right-2.5 flex items-center">
            {rightAction}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

