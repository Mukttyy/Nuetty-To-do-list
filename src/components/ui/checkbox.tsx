"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { playCompleteSound } from "@/lib/sound";

export interface CheckboxProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  withSound?: boolean;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      checked = false,
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

    const sizeClasses = {
      sm: "h-4 w-4 rounded-[4px]",
      md: "h-[18px] w-[18px] rounded-[5px]",
      lg: "h-5 w-5 rounded-[6px]",
    };

    const iconSizes = {
      sm: "h-3 w-3 stroke-[2.8]",
      md: "h-3.5 w-3.5 stroke-[2.8]",
      lg: "h-4 w-4 stroke-[2.8]",
    };

    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        ref={ref}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative inline-flex items-center justify-center transition-all duration-150 select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-40",
          sizeClasses[size],
          checked
            ? "bg-zinc-800 text-white border-transparent active:scale-90"
            : "bg-white border border-zinc-300/90 text-transparent hover:border-zinc-400 active:scale-90",
          className
        )}
        {...props}
      >
        <Check
          className={cn(
            iconSizes[size],
            "transition-transform duration-150 ease-out",
            checked ? "scale-100 opacity-100" : "scale-50 opacity-0"
          )}
        />
        {/* Expanded 44x44px touch area for WCAG 2.5.5 */}
        <span className="absolute -inset-2.5 pointer-events-none sm:hidden" />
      </button>
    );
  }
);

Checkbox.displayName = "Checkbox";

