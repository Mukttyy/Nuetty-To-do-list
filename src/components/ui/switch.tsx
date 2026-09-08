"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: "sm" | "md";
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked = false,
      onCheckedChange,
      size = "md",
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const handleClick = () => {
      if (disabled) return;
      onCheckedChange?.(!checked);
    };

    const dimensions = {
      sm: "h-4 w-7",
      md: "h-5 w-9",
    };

    const thumbDimensions = {
      sm: "h-3 w-3 translate-x-0.5",
      md: "h-3.5 w-3.5 translate-x-0.5",
    };

    const thumbChecked = {
      sm: "translate-x-3.5",
      md: "translate-x-4.5",
    };

    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        ref={ref}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-40",
          dimensions[size],
          checked ? "bg-[#18181B]" : "bg-zinc-200 hover:bg-zinc-300/80",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none inline-block rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out my-auto",
            thumbDimensions[size],
            checked && thumbChecked[size]
          )}
        />
      </button>
    );
  }
);

Switch.displayName = "Switch";

