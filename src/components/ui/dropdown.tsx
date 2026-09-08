"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
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
  className?: string;
  size?: "sm" | "md";
  disabled?: boolean;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
  size = "md",
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  const sizeClasses = {
    sm: "h-7 text-xs px-2.5 rounded-md gap-1.5",
    md: "h-8 text-xs px-3 rounded-lg gap-2",
  };

  return (
    <div ref={containerRef} className={cn("relative inline-block w-full", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between border border-[#E5E7EB] bg-white text-[#18181B] font-medium transition-colors select-none",
          "hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1",
          "disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-400",
          sizeClasses[size]
        )}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.dotColor && (
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: selectedOption.dotColor }}
            />
          )}
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-zinc-400 transition-transform duration-150 shrink-0",
            isOpen && "rotate-180 text-zinc-600"
          )}
        />
      </button>

      {/* Floating Menu Popover */}
      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-50 min-w-full w-max max-w-xs rounded-xl border border-[#E5E7EB] bg-white p-1 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.1)] animate-in fade-in-0 zoom-in-95 select-none">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left",
                  isSelected
                    ? "bg-[#F4F5F7] font-semibold text-[#18181B]"
                    : "text-[#71717A] hover:bg-zinc-50 hover:text-[#18181B]"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  {option.dotColor && (
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: option.dotColor }}
                    />
                  )}
                  <span>{option.label}</span>
                </div>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 text-[#18181B] shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
