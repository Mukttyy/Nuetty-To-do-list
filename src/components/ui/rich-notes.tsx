"use client";

import * as React from "react";
import { Bold, Italic, Underline, List, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RichNotesProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

export const RichNotes = React.forwardRef<HTMLTextAreaElement, RichNotesProps>(
  (
    {
      value,
      onChange,
      placeholder = "Add notes here...",
      className,
      readOnly = false,
      ...props
    },
    ref
  ) => {
    const [isBold, setIsBold] = React.useState(false);
    const [isItalic, setIsItalic] = React.useState(false);
    const [isUnderline, setIsUnderline] = React.useState(false);

    return (
      <div
        className={cn(
          "w-full rounded-xl border border-[#E5E7EB] bg-white overflow-hidden transition-colors focus-within:border-zinc-400 focus-within:ring-2 focus-within:ring-zinc-400/20",
          className
        )}
      >
        {/* Formatting Toolbar */}
        <div className="flex items-center gap-0.5 px-2.5 py-1.5 border-b border-[#F0F1F3] bg-[#FAFAFA] select-none">
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setIsBold(!isBold)}
            className={cn(
              "h-6 w-6 inline-flex items-center justify-center rounded text-xs font-bold transition-colors",
              isBold
                ? "bg-zinc-200 text-[#18181B]"
                : "text-[#71717A] hover:bg-zinc-100 hover:text-[#18181B]"
            )}
            title="Bold"
          >
            <Bold className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={() => setIsItalic(!isItalic)}
            className={cn(
              "h-6 w-6 inline-flex items-center justify-center rounded text-xs transition-colors",
              isItalic
                ? "bg-zinc-200 text-[#18181B]"
                : "text-[#71717A] hover:bg-zinc-100 hover:text-[#18181B]"
            )}
            title="Italic"
          >
            <Italic className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={() => setIsUnderline(!isUnderline)}
            className={cn(
              "h-6 w-6 inline-flex items-center justify-center rounded text-xs transition-colors",
              isUnderline
                ? "bg-zinc-200 text-[#18181B]"
                : "text-[#71717A] hover:bg-zinc-100 hover:text-[#18181B]"
            )}
            title="Underline"
          >
            <Underline className="h-3.5 w-3.5" />
          </button>

          <span className="h-3.5 w-px bg-[#E5E7EB] mx-1" />

          <button
            type="button"
            tabIndex={-1}
            className="h-6 w-6 inline-flex items-center justify-center rounded text-[#71717A] hover:bg-zinc-100 hover:text-[#18181B] transition-colors"
            title="Bullet List"
          >
            <List className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            tabIndex={-1}
            className="h-6 w-6 inline-flex items-center justify-center rounded text-[#71717A] hover:bg-zinc-100 hover:text-[#18181B] transition-colors"
            title="Add Link"
          >
            <Link2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Text Area */}
        <textarea
          ref={ref}
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full p-3 text-xs leading-relaxed text-[#18181B] placeholder:text-zinc-400 focus:outline-none resize-none bg-transparent"
          {...props}
        />
      </div>
    );
  }
);

RichNotes.displayName = "RichNotes";
