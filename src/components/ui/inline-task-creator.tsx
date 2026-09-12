"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InlineTaskCreatorProps {
  onAdd: (title: string) => void;
  placeholder?: string;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function InlineTaskCreator({
  onAdd,
  placeholder = "New task...",
  className,
  open,
  onOpenChange,
}: InlineTaskCreatorProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const isOpen = open ?? internalOpen;

  const setIsOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (open === undefined) setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange, open]
  );

  React.useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle("");
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      setTitle("");
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <div className={cn("pt-0.5", className)}>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex min-h-11 w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-left text-[13px] text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-700 sm:min-h-8"
        >
          <div className="w-4 -ml-1 flex items-center justify-center">
            <Plus className="h-3.5 w-3.5 stroke-[2.2]" />
          </div>
          <span>New task</span>
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex min-h-11 items-center gap-2.5 rounded-xl bg-zinc-50/80 px-2.5 py-1.5 ring-1 ring-zinc-200/80 transition-all sm:min-h-8",
        className
      )}
    >
      <div className="w-4 -ml-1 shrink-0" />
      <div className="text-zinc-300 shrink-0">
        <Checkbox checked={false} disabled />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-[13.5px] font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
      />

      <button
        type="button"
        onClick={() => {
          setTitle("");
          setIsOpen(false);
        }}
        className="text-[11.5px] text-zinc-400 hover:text-zinc-700 px-1.5 py-0.5 cursor-pointer"
      >
        Esc
      </button>
    </form>
  );
}
