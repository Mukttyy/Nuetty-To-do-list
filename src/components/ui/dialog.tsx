"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  className?: string;
}

export function Dialog({ open, title, description, onClose, children, initialFocusRef, className }: DialogProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const onCloseRef = React.useRef(onClose);
  const titleId = React.useId();
  const descriptionId = React.useId();
  React.useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  React.useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => {
      const fallback = panelRef.current?.querySelector<HTMLElement>("button, input, textarea, select, [tabindex]:not([tabindex='-1'])");
      (initialFocusRef?.current ?? fallback)?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [initialFocusRef, open]);

  if (!open) return null;

  return <div className="fixed inset-0 z-[80] flex items-end justify-center bg-zinc-950/35 p-0 sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} className={cn("w-full rounded-t-2xl bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-xl sm:p-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id={titleId} className="text-base font-semibold text-zinc-950">{title}</h2>
          {description && <p id={descriptionId} className="mt-1.5 text-sm leading-5 text-zinc-600">{description}</p>}
        </div>
        <button type="button" onClick={onClose} className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100" aria-label="Close dialog"><X className="h-4 w-4" /></button>
      </div>
      {children}
    </div>
  </div>;
}

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => void;
  destructive?: boolean;
}

export function ConfirmDialog({ open, title, description, confirmLabel, onClose, onConfirm, destructive = false }: ConfirmDialogProps) {
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  return <Dialog open={open} title={title} description={description} onClose={onClose} initialFocusRef={cancelRef}>
    <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <button ref={cancelRef} type="button" onClick={onClose} className="h-10 rounded-lg px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-100">Cancel</button>
      <button type="button" onClick={onConfirm} className={cn("h-10 rounded-lg px-4 text-sm font-semibold text-white", destructive ? "bg-red-600 hover:bg-red-700" : "bg-zinc-900 hover:bg-zinc-800")}>{confirmLabel}</button>
    </div>
  </Dialog>;
}
