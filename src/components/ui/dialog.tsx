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
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  className?: string;
  placement?: "center" | "drawer";
}

export function Dialog({ open, title, description, onClose, children, initialFocusRef, returnFocusRef, className, placement = "center" }: DialogProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const onCloseRef = React.useRef(onClose);
  const titleId = React.useId();
  const descriptionId = React.useId();
  React.useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  React.useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const returnFocus = returnFocusRef?.current ?? previousFocus;
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
      const focusable = Array.from(panelRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])") ?? []).filter(element => element.getClientRects().length > 0);
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
      returnFocus?.focus();
    };
  }, [initialFocusRef, returnFocusRef, open]);

  if (!open) return null;

  return <div className={cn("fixed inset-0 z-[80] flex bg-zinc-950/35", placement === "drawer" ? "items-stretch justify-start" : "items-end justify-center sm:items-center sm:p-6")} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} className={cn("max-h-[100dvh] overflow-y-auto overscroll-contain bg-white p-5 shadow-2xl", placement === "drawer" ? "flex w-72 max-w-[85vw] flex-col" : "w-full rounded-t-2xl sm:max-h-[calc(100dvh-3rem)] sm:max-w-md sm:rounded-xl sm:p-6", className)}>
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
