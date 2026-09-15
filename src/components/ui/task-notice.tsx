"use client";

import * as React from "react";
import { X } from "lucide-react";
import type { TaskNotice as Notice } from "@/lib/use-tasks";
import type { TaskSyncStatus } from "@/lib/use-task-sync";

export function TaskNotice({ notice, status, onDismiss, onUndo, onView }: {
  notice: Notice; status: TaskSyncStatus; onDismiss: () => void;
  onUndo: () => void; onView?: () => void;
}) {
  const [paused, setPaused] = React.useState(false);
  const dismissRef = React.useRef(onDismiss);
  React.useEffect(() => { dismissRef.current = onDismiss; }, [onDismiss]);
  React.useEffect(() => {
    if (paused || status !== "saved") return;
    const timer = window.setTimeout(() => dismissRef.current(), 8000);
    return () => window.clearTimeout(timer);
  }, [notice.id, paused, status]);
  return <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }} className="fixed bottom-4 left-4 right-4 z-[60] flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-900 shadow-lg sm:left-1/2 sm:right-auto sm:w-[420px] sm:-translate-x-1/2">
    <div role="status" className="min-w-0 flex-1"><p>{notice.message}</p><p className="mt-1 text-zinc-500">{status === "saved" ? "Saved" : status === "error" || status === "conflict" ? "Not saved — check the save alert." : "Saving…"}</p></div>
    {notice.undo ? <button type="button" onClick={onUndo} className="min-h-9 px-2 font-semibold underline underline-offset-2">Undo</button> : onView && <button type="button" onClick={onView} className="min-h-9 px-2 font-semibold underline underline-offset-2">View task</button>}
    <button type="button" aria-label="Dismiss notification" onClick={onDismiss} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md hover:bg-zinc-100"><X className="h-4 w-4" /></button>
  </div>;
}
