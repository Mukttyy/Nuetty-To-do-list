# CHANGELOG

All notable changes, architectural milestones, and UI Kit versions will be documented here.

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
  - Full popover selector with status color dots (`To Do`, `In Progress`, `Review`, `Done`, `Someday`), active checkmarks, and outside click / Escape key dismissal.
- **Segmented Tabs** (`src/components/ui/tabs.tsx`):
  - Minimalist pill segmented controls with counts (`All 12`, `To Do 7`, `In Progress 3`, `Done 2`).
- **Rich Notes Editor** (`src/components/ui/rich-notes.tsx`):
  - Multiline note area with formatting toolbar (`B`, `I`, `U`, List, Link).
- **Feedback & Confirmation Dialog** (`src/components/ui/dialog.tsx`, `src/components/ui/toast.tsx`):
  - Accessible modal dialog for confirmations (`Delete Project`).
  - Floating dark action toast with `Undo (⌘Z)` button.
- **Empty States & Skeletons** (`src/components/ui/empty-state.tsx`, `src/components/ui/skeleton.tsx`):
  - Minimalist all-clear empty state and loading shimmer bars.
- **Verification**:
  - `tsc --noEmit` PASS (0 errors).
  - `next build` PASS (0 errors).
  - Dev server HTTP 200 OK.
