"use client";

import * as React from "react";
import { Calendar, ChevronDown, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { TaskSyncStatus } from "@/lib/use-tasks";
import { cn } from "@/lib/utils";

export type SortOption = "newest" | "oldest" | "alphabetical";
export type FilterOption = "active" | "all" | "completed";

export interface TopBarProps {
  completedCount?: number;
  totalCount?: number;
  syncStatus?: TaskSyncStatus;
  onBeforeLogout?: () => Promise<boolean>;
  onOpenNavigation?: () => void;
  className?: string;
}

const syncLabels: Record<TaskSyncStatus, string> = {
  loading: "Loading",
  saving: "Saving…",
  saved: "Saved",
  error: "Save failed",
  conflict: "Conflict",
};

function formatCurrentDate(): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
}

export function TopBar({
  completedCount = 0,
  totalCount = 0,
  syncStatus = "saved",
  onBeforeLogout,
  onOpenNavigation,
  className,
}: TopBarProps) {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [logoutError, setLogoutError] = React.useState<string | null>(null);
  const profileRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const signOutRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!isProfileOpen) return;
    signOutRef.current?.focus();

    function closeMenu(event: MouseEvent | KeyboardEvent) {
      if (event instanceof KeyboardEvent && event.key !== "Escape") return;
      if (
        event instanceof MouseEvent &&
        profileRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      setIsProfileOpen(false);
      if (event instanceof KeyboardEvent) triggerRef.current?.focus();
    }

    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeMenu);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeMenu);
    };
  }, [isProfileOpen]);

  const handleLogout = async () => {
    setLogoutError(null);
    if (onBeforeLogout && !(await onBeforeLogout())) {
      setLogoutError("Your latest changes could not be saved. Try again before signing out.");
      return;
    }
    const result = await logout();
    if (result.error) setLogoutError(result.error);
  };

  return (
    <header
      className={cn(
        "h-11 px-3 sm:px-6 border-b border-zinc-100 bg-white flex items-center justify-between shrink-0 select-none z-20",
        className
      )}
    >
      <div className="flex items-center gap-2 text-xs font-medium text-zinc-600">
        <button
          type="button"
          onClick={onOpenNavigation}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>
        <span className="hidden items-center gap-2 sm:flex">
          <Calendar className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
          <time suppressHydrationWarning>{formatCurrentDate()}</time>
        </span>
      </div>

      <div className="flex items-center gap-3">
        {totalCount > 0 && (
          <span className="hidden text-[11.5px] tabular-nums text-zinc-500 sm:inline">
            {completedCount} of {totalCount} done
          </span>
        )}
        <span
          role="status"
          className={cn(
            "text-[11px]",
            syncStatus === "error" || syncStatus === "conflict"
              ? "text-amber-700"
              : "text-zinc-500"
          )}
        >
          {syncLabels[syncStatus]}
        </span>

        <div ref={profileRef} className="relative">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsProfileOpen((open) => !open)}
            aria-expanded={isProfileOpen}
            aria-haspopup="menu"
            aria-label="Open profile menu"
            className="flex h-8 items-center gap-2 rounded-md px-1.5 text-zinc-800 hover:bg-zinc-100"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded bg-zinc-900 text-[10px] font-bold text-white">
              {user?.initials ?? "U"}
            </span>
            <span className="hidden max-w-[110px] truncate text-xs font-medium text-zinc-700 sm:inline">
              {user?.name ?? "User"}
            </span>
            <ChevronDown
              className={cn(
                "h-3 w-3 text-zinc-400 transition-transform",
                isProfileOpen && "rotate-180"
              )}
              aria-hidden="true"
            />
          </button>

          {isProfileOpen && (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+6px)] z-50 w-56 rounded-lg border border-zinc-200 bg-white p-1.5 text-left shadow-lg"
            >
              <div className="px-2.5 py-2">
                <p className="truncate text-xs font-semibold text-zinc-900">
                  {user?.name}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                  {user?.email}
                </p>
              </div>
              {logoutError && (
                <p role="alert" className="px-2.5 pb-2 text-[11px] text-red-700">
                  {logoutError}
                </p>
              )}
              <div className="my-1 h-px bg-zinc-100" />
              <button
                ref={signOutRef}
                type="button"
                role="menuitem"
                onClick={() => void handleLogout()}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              >
                <LogOut className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
