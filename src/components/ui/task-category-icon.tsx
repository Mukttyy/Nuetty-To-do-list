import * as React from "react";
import { Calendar, FileText, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TaskCategoryIconProps {
  type?: "phone" | "calendar" | "doc" | "palette" | "utensil" | "dog" | "book";
  className?: string;
}
export function TaskCategoryIcon({ type, className }: TaskCategoryIconProps) {
  if (!type) return null;

  switch (type) {
    case "phone":
      return (
        <div
          className={cn(
            "h-6 w-6 rounded-md bg-[#27272A] flex items-center justify-center text-white shadow-xs",
            className
          )}
        >
          <Phone className="h-3 w-3 fill-white" />
        </div>
      );
    case "calendar":
      return (
        <div
          className={cn(
            "h-6 w-6 rounded-md bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669]",
            className
          )}
        >
          <Calendar className="h-3.5 w-3.5" />
        </div>
      );
    case "doc":
      return (
        <div
          className={cn(
            "h-6 w-6 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-600",
            className
          )}
        >
          <FileText className="h-3.5 w-3.5" />
        </div>
      );
    case "palette":
      return (
        <span className={cn("text-sm select-none", className)} role="img" aria-label="Palette">
          🎨
        </span>
      );
    case "utensil":
      return (
        <span className={cn("text-sm select-none", className)} role="img" aria-label="Lunch">
          🍽️
        </span>
      );
    case "dog":
      return (
        <span className={cn("text-sm select-none", className)} role="img" aria-label="Dog">
          🐶
        </span>
      );
    case "book":
      return (
        <span className={cn("text-sm select-none", className)} role="img" aria-label="Book">
          📖
        </span>
      );
    default:
      return null;
  }
}
