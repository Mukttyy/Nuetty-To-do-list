"use client";

import * as React from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ViewHeader } from "@/components/ui/view-header";
import type { Project, Task } from "@/types/task";

interface TrashViewProps {
  tasks: Task[];
  projects: Project[];
  onRestoreTask: (id: string) => void;
  onPermanentlyDeleteTask: (id: string) => void;
  onEmptyTrash: () => void;
}

function formatDeletedAt(value?: string): string {
  if (!value) return "Deletion date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Deletion date unavailable" : `Deleted ${new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(date)}`;
}

export function TrashView({ tasks, projects, onRestoreTask, onPermanentlyDeleteTask, onEmptyTrash }: TrashViewProps) {
  const [deleteTarget, setDeleteTarget] = React.useState<Task | "all" | null>(null);

  return <div className="mx-auto w-full max-w-[800px] space-y-6 px-4 pb-16 pt-5 sm:px-6 sm:pt-7">
    <ViewHeader
      title="Trash"
      count={tasks.length}
      icon={<Trash2 className="h-4 w-4" />}
      description="Items remain here until you restore or permanently delete them. Nuetty never empties Trash automatically."
      actions={tasks.length > 0 ? <Button variant="outline" size="xs" onClick={() => setDeleteTarget("all")}>Empty Trash</Button> : undefined}
    />
    <div className="space-y-2">
      {tasks.map((task) => {
        const project = projects.find((item) => item.id === task.projectId);
        return <div key={task.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-700">{task.title}</p>
            <p className="mt-1 text-[11px] text-zinc-400">{project?.name ?? "No project"} · {formatDeletedAt(task.deletedAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="xs" leftIcon={<RotateCcw className="h-3 w-3" />} onClick={() => onRestoreTask(task.id)}>Restore</Button>
            <Button variant="outline" size="xs" leftIcon={<Trash2 className="h-3 w-3" />} onClick={() => setDeleteTarget(task)}>Delete permanently</Button>
          </div>
        </div>;
      })}
      {tasks.length === 0 && <EmptyState title="Trash is empty" description="Deleted tasks will stay here until you remove them manually." icon={<Trash2 className="h-5 w-5" />} />}
    </div>
    <ConfirmDialog
      open={deleteTarget !== null}
      title={deleteTarget === "all" ? `Permanently delete ${tasks.length} ${tasks.length === 1 ? "item" : "items"}?` : deleteTarget ? `Permanently delete “${deleteTarget.title}”?` : "Permanently delete item?"}
      description="This action cannot be undone. The deleted data cannot be restored from Trash."
      confirmLabel={deleteTarget === "all" ? "Empty Trash" : "Delete permanently"}
      destructive
      onClose={() => setDeleteTarget(null)}
      onConfirm={() => {
        if (deleteTarget === "all") onEmptyTrash();
        else if (deleteTarget) onPermanentlyDeleteTask(deleteTarget.id);
        setDeleteTarget(null);
      }}
    />
  </div>;
}
