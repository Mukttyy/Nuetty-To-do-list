"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DropdownOption {
  value: string;
  label: string;
  dotColor?: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  size?: "sm" | "md";
  disabled?: boolean;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  ariaLabel = "Select an option",
  className,
  size = "md",
  disabled = false,
}: DropdownProps) {
  const selectedOption = options.find((option) => option.value === value);
  const sizeClasses = {
    sm: "h-10 rounded-md px-2 text-xs sm:h-7",
    md: "h-11 rounded-lg px-3 text-xs sm:h-8",
  };

  return (
    <div className={cn("relative w-full", className)}>
      {selectedOption?.dotColor && (
        <span
          className="pointer-events-none absolute left-2.5 top-1/2 z-10 h-2 w-2 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: selectedOption.dotColor }}
          aria-hidden="true"
        />
      )}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(
          "w-full border border-[#E5E7EB] bg-white font-medium text-[#18181B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-400",
          selectedOption?.dotColor && "pl-6",
          sizeClasses[size]
        )}
      >
        {!selectedOption && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
