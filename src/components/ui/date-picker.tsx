"use client";

import * as React from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { localDateKey } from "@/lib/use-tasks";

export function DatePicker({ value, onChange }: { value?: string; onChange: (value?: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState(() => new Date());
  const today = localDateKey();
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const choose = (date?: string) => { setOpen(false); onChange(date); };
  return <>
    <button type="button" aria-label="Due date" aria-haspopup="dialog" aria-expanded={open} onClick={() => { setMonth(value ? new Date(`${value}T12:00:00`) : new Date()); setOpen(true); }} className="flex h-9 w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-2 text-xs text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300">
      <span>{value ? new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00`)) : "No date"}</span><Calendar className="h-4 w-4" />
    </button>
    <Dialog open={open} title="Choose due date" onClose={() => setOpen(false)} className="max-w-[300px] sm:max-w-[300px] max-h-[95dvh] overflow-y-auto p-3 sm:p-3 [&_h2]:text-sm">
      <div className="mt-1 flex items-center justify-between">
        <button type="button" aria-label="Previous month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-zinc-100"><ChevronLeft className="h-4 w-4" /></button>
        <span aria-live="polite" className="text-sm font-medium">{new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(first)}</span>
        <button type="button" aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-zinc-100"><ChevronRight className="h-4 w-4" /></button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => <span key={day} className="py-1.5 text-zinc-500">{day}</span>)}
        {Array.from({ length: first.getDay() }, (_, i) => <span key={`empty-${i}`} />)}
        {Array.from({ length: days }, (_, i) => {
          const date = localDateKey(new Date(month.getFullYear(), month.getMonth(), i + 1));
          return <button key={date} type="button" aria-label={date} aria-pressed={value === date} aria-current={today === date ? "date" : undefined} onClick={() => choose(date)} className={`min-h-9 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 ${value === date ? "bg-zinc-900 text-white" : "text-zinc-800 hover:bg-zinc-100"} ${today === date ? "font-bold underline underline-offset-4" : ""}`}>{i + 1}</button>;
        })}
      </div>
      <div className="mt-2 flex justify-between border-t border-zinc-200 pt-1 text-xs">
        <button type="button" onClick={() => choose(undefined)} className="min-h-10 rounded-md px-3 hover:bg-zinc-100">Clear date</button>
        <button type="button" onClick={() => choose(today)} className="min-h-10 rounded-md px-3 font-medium hover:bg-zinc-100">Today</button>
      </div>
    </Dialog>
  </>;
}
