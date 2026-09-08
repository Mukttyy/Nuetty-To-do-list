import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      size = "md",
      leftIcon,
      rightAction,
      error = false,
      errorMessage,
      helperText,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "h-7 text-xs px-2.5 rounded-md",
      md: "h-9 text-sm px-3 rounded-lg",
      lg: "h-11 text-base px-3.5 rounded-lg",
    };

    const leftIconPadding = {
      sm: "pl-7",
      md: "pl-9",
      lg: "pl-10",
    };

    const rightActionPadding = {
      sm: "pr-7",
      md: "pr-9",
      lg: "pr-10",
    };

    return (
      <div className="w-full">
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-2.5 flex items-center pointer-events-none text-zinc-400">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            disabled={disabled}
            className={cn(
              "flex w-full bg-white text-[#18181B] transition-colors shadow-none select-text",
              "placeholder:text-zinc-400",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
              "disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-400 disabled:border-zinc-200",
              error
                ? "border border-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-200"
                : "border border-[#E5E7EB] hover:border-zinc-300 focus-visible:border-[#18181B] focus-visible:ring-zinc-400/30",
              sizeClasses[size],
              leftIcon && leftIconPadding[size],
              rightAction && rightActionPadding[size],
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

        {errorMessage && (
          <p className="text-[11px] text-rose-600 mt-1 font-medium select-none">
            {errorMessage}
          </p>
        )}

        {!errorMessage && helperText && (
          <p className="text-[11px] text-[#71717A] mt-1 select-none">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
