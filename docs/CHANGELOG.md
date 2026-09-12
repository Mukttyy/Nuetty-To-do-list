# CHANGELOG

All notable changes, architectural milestones, and UI Kit versions will be documented here.

## [Custom workspace and calendar-based flow] - 2026-09-10

- Replaced hard-coded Personal/Work structures with user-owned projects and sections stored in PostgreSQL.
- Made new non-demo accounts empty and removed cross-account legacy browser-storage import.
- Added real date values with automatic Today, Upcoming, overdue, Anytime, Someday, and Completed views.
- Simplified status to To Do, In Progress, and Done; added optional task priority.
- Repaired Quick Find routing for undated project tasks and scoped sorting to each rendered view.
- Added global Inbox capture, contextual project/section creation, and project/section lifecycle actions.
- Made Trash retention indefinite with Restore, per-item permanent deletion, Empty Trash, and Undo for soft deletion.
- Added relational payload validation and end-to-end coverage for custom workspaces, manual Trash, account isolation, and stale revisions.

## [Prototype entry and synchronization hardening] - 2026-09-10

- Renamed the product to `Nuetty — Everything To Do List` and applied the supplied N mark to the interface and browser metadata.
- Unified all workspace headers, replaced decorative emoji with line icons, widened the task canvas, reduced repeated row metadata, and reserved colored date badges for overdue states.
- Added mobile-safe touch targets and title truncation, responsive Today filters, accessible row actions, and concise shared empty states.
- Reworked task creation so project headers create General tasks, section-level add buttons preserve context, and task details can change project, section, and schedule.
- Added database support for unscheduled tasks and tasks without a project, preventing Today and Inbox items from being forced into Personal.
- Replaced the illustration carousel and trust-marketing badge with a restrained, accessible single-column sign-in screen.
- Added an environment-gated, idempotent demo account and populated prototype workspace.
- Allowed the active HTTP loopback port during development while keeping production origins restricted.
- Added persisted task positions and per-user collection revisions with HTTP 409 conflict recovery.
- Made field edits update immediately and made sign-out wait for pending writes.
- Replaced fake drag/action affordances and custom dropdowns with truthful direct actions and native selects.
- Added visible synchronization states, accessible touch targets, and usable collapsed navigation.
- Isolated browser tests in a guarded `_test` database and expanded coverage for demo access, ordering, no-blur edits, and concurrent tabs.
- Split synchronization infrastructure from task-domain operations and removed dead inspector, rich-note, and illustration modules.

## [Full-stack persistence and audit remediation] - 2026-09-09

- Added Better Auth email/password registration, sign-in, sign-out, and server sessions.
- Added PostgreSQL ownership-aware tables for users, tasks, subtasks, and activity.
- Added ordered SQL migrations with checksums, transactional writes, payload validation, and same-origin mutation protection.
- Replaced browser-only persistence with server synchronization; retained valid legacy browser tasks as a one-time import path.
- Added database health and unauthorized-access checks plus browser coverage for persistence and two-account isolation.
- Made the shell usable on narrow screens with off-canvas navigation and a full-width task canvas.
- Removed non-functional note-formatting controls and aligned the architecture records with the implemented two-region inline editor.
- Added baseline response security headers and repaired the corrupt Git index without discarding working-tree changes.

## [Phase 6 - Navigation, Quick Find & Filtering] - 2026-09-08
- **Command Palette (`⌘K`)** (`src/components/layout/command-palette.tsx`):
  - Fast keyboard-driven fuzzy search across all tasks, tags, notes, and projects.
  - Keyboard navigation (`↑`, `↓`, `Enter`, `Esc`).
  - Directly expands the task inline and activates its corresponding view.
- **Top Bar Controls** (`src/components/layout/top-bar.tsx`):
  - Interactive `Sort` menu (`Newest`, `Oldest`, `Alphabetical`).
  - Interactive `Filter` menu (`Unread / Active`, `All Tasks`, `Completed`).
- **Global Keyboard Shortcuts**:
  - `⌘K` / `Ctrl+K`: Toggle Command Palette.
  - `Space`: Toggle complete for currently selected task (with native Web Audio synthesis pop).
  - `ArrowUp` / `ArrowDown`: Traverse tasks in current active view.
  - `Delete` / `Backspace`: Soft delete selected task.
  - `Escape`: Close the expanded task / Command Palette.
- **Task Detail Polish**:
  - Inline tag creation (`+` button).
  - Inline subtask creation (`+ Add` button).
  - Move Task to Project popover.

## [Phase 5 - Multi-View Task Engine] - 2026-09-08
- **Data Models & Datasets** (`src/types/task.ts`, `src/lib/initial-tasks.ts`):
  - Exact 1-to-1 data mapping across all 5 reference screens (`Today (7)`, `Upcoming (3)`, `Someday (5)`, `Personal (7)`, `Work (4)`).
- **Task State Hook** (`src/lib/use-tasks.ts`):
  - Originally persisted CRUD operations in `localStorage`; superseded by the 2026-09-09 PostgreSQL phase.
  - Dynamic real-time calculation of sidebar counter badges.
- **Dedicated View Canvas Modules** (`src/components/views/`):
  - `today-view.tsx`, `upcoming-view.tsx`, `someday-view.tsx`, `personal-view.tsx`, `work-view.tsx`, `inbox-view.tsx`, `trash-view.tsx`.

## [UI Kit v0.2.0-complete] - 2026-09-08

### Complete UI Kit Matrix (Zero AI Slop)
- **Buttons** (`src/components/ui/button.tsx`):
  - Size matrix: `xs` (24px), `sm` (28px), `md` (36px - default), `lg` (44px - touch), `iconXs`, `iconSm`, `iconMd`.
  - Visual variants: `primary`, `secondary`, `outline`, `ghost`, `action`, `destructive`, `link`.
  - States: default, hover, active (`scale-[0.98]`), focus-visible ring, disabled (`opacity-40`), loading spinner.
- **Checkbox & Switch** (`src/components/ui/checkbox.tsx`, `src/components/ui/switch.tsx`):
  - Checkbox states: `unchecked`, `checked` (with Web Audio pop), `indeterminate` (minus icon for partial sub-tasks), `disabled`.
  - Switch: Smooth iOS/macOS toggle switch.
- **Inputs & Search** (`src/components/ui/input.tsx`):
  - Sizes: `sm` (28px), `md` (36px), `lg` (42px).
  - States: default, error (rose border + message), disabled, with search icon, with `⌘K` badge, with helper text.
- **Dropdown Status Selector** (`src/components/ui/dropdown.tsx`):
  - Native accessible selector with status color context (`To Do`, `In Progress`, `Review`, `Done`, `Someday`).
- **Segmented Tabs** (`src/components/ui/tabs.tsx`):
  - Minimalist pill segmented controls with counts (`All 12`, `To Do 7`, `In Progress 3`, `Done 2`).
- **Notes Editor** (`src/components/ui/notes-field.tsx`):
  - Multiline plain-text note area. The former non-functional formatting toolbar was removed in the 2026-09-09 audit remediation.
- **Feedback & Confirmation Dialog** (`src/components/ui/dialog.tsx`, `src/components/ui/toast.tsx`):
  - Accessible modal dialog for confirmations (`Delete Project`).
  - Floating dark action toast with `Undo (⌘Z)` button.
- **Empty States & Skeletons** (`src/components/ui/empty-state.tsx`, `src/components/ui/skeleton.tsx`):
  - Minimalist all-clear empty state and loading shimmer bars.
- **Verification**:
  - `tsc --noEmit` PASS (0 errors).
  - `next build` PASS (0 errors).
  - Dev server HTTP 200 OK.
