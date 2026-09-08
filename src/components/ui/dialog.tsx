"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: DialogProps) {
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs select-none">
      <div
        className={cn(
          "w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-2xl animate-in fade-in-0 zoom-in-95",
          className
        )}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h3 className="text-sm font-bold text-[#18181B]">{title}</h3>
            {description && (
              <p className="text-xs text-[#71717A] mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-6 w-6 inline-flex items-center justify-center rounded-md text-[#71717A] hover:bg-zinc-100 hover:text-[#18181B] transition-colors -mr-1 -mt-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {children && <div className="py-2 text-xs">{children}</div>}

        {footer && <div className="mt-5 flex items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
