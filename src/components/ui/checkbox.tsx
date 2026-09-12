"use client";

import * as React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { playCompleteSound } from "@/lib/sound";

export interface CheckboxProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  withSound?: boolean;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      checked = false,
      indeterminate = false,
      onCheckedChange,
      withSound = true,
      size = "md",
      className,
      disabled,
      readOnly,
      ...props
    },
    ref
  ) => {
    const handleClick = () => {
      if (disabled || readOnly) return;
      const nextChecked = !checked;
      if (nextChecked && withSound) {
        playCompleteSound();
      }
      onCheckedChange?.(nextChecked);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleClick();
      }
    };

    const visualSizeClasses = {
      sm: "h-3.5 w-3.5 rounded-[3.5px]",
      md: "h-[18px] w-[18px] rounded-[5px]",
      lg: "h-5 w-5 rounded-[6px]",
    };

    const hitAreaClasses = {
      sm: "h-10 w-10 -m-3 sm:m-0 sm:h-3.5 sm:w-3.5",
      md: "h-11 w-11 -m-[13px] sm:m-0 sm:h-[18px] sm:w-[18px]",
      lg: "h-11 w-11 -m-3 sm:m-0 sm:h-5 sm:w-5",
    };

    const iconSizes = {
      sm: "h-2.5 w-2.5 stroke-[3]",
      md: "h-3.5 w-3.5 stroke-[2.8]",
      lg: "h-4 w-4 stroke-[2.8]",
    };

    const isMarked = checked || indeterminate;

    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? "mixed" : checked}
        ref={ref}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "group/check relative inline-flex items-center justify-center select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-40",
          hitAreaClasses[size],
          className
        )}
        aria-label={props["aria-label"] ?? "Toggle completion"}
        {...props}
      >
        <span
          className={cn(
            "inline-flex items-center justify-center transition-all duration-150 group-active/check:scale-90",
            visualSizeClasses[size],
            isMarked
              ? "border border-transparent bg-[#18181B] text-white"
              : "border border-zinc-300/90 bg-white text-transparent group-hover/check:border-zinc-400"
          )}
        >
          {indeterminate ? (
            <Minus className={cn(iconSizes[size], "opacity-100 scale-100")} />
          ) : (
            <Check
              className={cn(
                iconSizes[size],
                "transition-transform duration-150 ease-out",
                checked ? "scale-100 opacity-100" : "scale-50 opacity-0"
              )}
            />
          )}
        </span>
      </button>
    );
  }
);

Checkbox.displayName = "Checkbox";
