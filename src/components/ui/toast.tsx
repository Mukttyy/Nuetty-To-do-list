"use client";

import * as React from "react";
import { Check, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  message: string;
  onUndo?: () => void;
  onClose?: () => void;
  className?: string;
}

export function Toast({
  message,
  onUndo,
  onClose,
  className,
}: ToastProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 px-3.5 py-2 rounded-xl bg-[#18181B] text-white text-xs shadow-lg select-none",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
          <Check className="h-2.5 w-2.5 stroke-[2.5]" />
        </span>
        <span className="font-medium">{message}</span>
      </div>

      {onUndo && (
        <button
          type="button"
          onClick={onUndo}
          className="inline-flex items-center gap-1 font-semibold text-blue-400 hover:text-blue-300 pl-2 border-l border-zinc-700 transition-colors"
        >
          <Undo2 className="h-3 w-3" />
          <span>Undo</span>
          <span className="text-[10px] opacity-60 font-mono">⌘Z</span>
        </button>
      )}
    </div>
  );
}
