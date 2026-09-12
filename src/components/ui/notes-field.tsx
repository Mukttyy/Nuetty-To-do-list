"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface NotesFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

export const NotesField = React.forwardRef<HTMLTextAreaElement, NotesFieldProps>(
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
  ) => (
    <textarea
      ref={ref}
      value={value}
      readOnly={readOnly}
      onChange={(event) => onChange?.(event.target.value)}
      placeholder={placeholder}
      rows={4}
      className={cn(
        "w-full resize-none rounded-lg border border-zinc-200 bg-white p-3 text-[13px] leading-relaxed text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200",
        className
      )}
      {...props}
    />
  )
);

NotesField.displayName = "NotesField";
