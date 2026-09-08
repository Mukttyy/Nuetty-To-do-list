# PROJECT CONSTITUTION — NUETTY - TO DO LIST

## Project
- **Name**: nuetty - to do list
- **Purpose**: Minimalist, distraction-free, ultra-clean productivity task management system with native desktop feel, 3-column layout, zero-latency interactions, and strict anti-AI-slop design.
- **Reference**: Clean desktop web reference screens (Things 3 & Linear-Grade)

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **React**: React 19 / 18
- **TypeScript**: Strict Mode enabled (`noImplicitAny: true`, strict null checks)
- **Styling**: Tailwind CSS + CSS Semantic Custom Properties (Design Tokens)
- **Component System**: Headless UI Primitives (Radix / CVA)
- **Icon Library**: Lucide React + Native System Emojis

## Design System (Observed & Calibrated from Reference)
- **Color System**:
  - `Surface Canvas`: `#FFFFFF` (Pure White)
  - `Surface Sidebar`: `#F7F8FA` / `#F5F6F8` (Neutral Cool Light Gray)
  - `Surface Active / Hover`: `#ECEEF1` / `#EAECEE`
  - `Surface Inspector`: `#FFFFFF` with left border `#E5E7EB`
  - `Text Primary`: `#18181B` (Zinc-900 / High Contrast)
  - `Text Muted / Secondary`: `#71717A` (Zinc-500)
  - `Text Subtle / Placeholder`: `#A1A1AA` (Zinc-400)
  - `Border Subtle`: `#E4E4E7` / `#E5E7EB`
  - `Functional Accents`:
    - Today: `#10B981` (Emerald green, pill bg `#D1FAE5`, text `#065F46`)
    - Upcoming: `#8B5CF6` (Purple, pill bg `#EDE9FE`, text `#5B21B6`)
    - Someday: `#F59E0B` (Amber, pill bg `#FEF3C7`, text `#92400E`)
    - Inbox / Primary Action: `#2563EB` (Blue, pill bg `#DBEAFE`, text `#1E40AF`)
    - Overdue / Destructive: `#EF4444` (Rose red, pill bg `#FEE2E2`, text `#991B1B`)
- **Typography**:
  - Font: Inter / Geist Sans
  - Heading 1 / List Display: 28px–32px Bold / ExtraBold
  - Section Headers: 14px–15px Bold
  - Task Row Title: 14px Medium
  - Badges & Pills: 11px–12px Medium
  - Body / Notes: 13px–14px Regular
- **Geometry & Spacing**:
  - Window Frame Radius: 16px–20px (`rounded-2xl`)
  - Selection Pills & Task Cards: 10px–12px (`rounded-xl`)
  - Checkboxes: 5px–6px (`rounded-md`)
  - Detail Inspector Inputs: 8px (`rounded-lg`)
  - Spacing scale: Strict 4px / 8px / 12px / 16px / 24px grid
- **Shadows**:
  - Flat base: `shadow-none` for docked elements
  - Dragging / Elevated Card: `0 10px 25px -5px rgba(0, 0, 0, 0.08)`
  - Dropdowns & Popovers: `0 8px 20px -4px rgba(0, 0, 0, 0.1)`

## UI Kit
- **Status**: IN PROGRESS (Phase 2)
- **Version**: UI KIT v0.1 (Drafting)
- **Approved Date**: Pending User Approval
- **Playground Route**: `/ui-kit`

## Architecture
- **Pattern**: Clean Layered Architecture (UI → Feature Hook → Service → Mock / API)
- **Folder Structure**:
  ```text
  src/
  ├── app/                  # Next.js App Router (Layouts, /ui-kit, app pages)
  ├── components/
  │   ├── ui/               # Pure UI Kit Primitives (Button, Checkbox, Badge, Input, Card, Modal, etc.)
  │   ├── layout/           # App Shell (Sidebar, TaskList, TaskDetailsPanel)
  │   └── features/         # Domain components (TaskRow, SubtaskList, RichNotesEditor, ActivityLog)
  ├── lib/                  # Utilities (cn, date-utils, id-gen)
  ├── services/             # TaskService, ProjectService (Backend-Ready abstraction)
  ├── types/                # Strict domain types (Task, Project, Section, Tag, User)
  └── docs/                 # Constitution, Decisions, Changelog
  ```
- **State Strategy**: Local-First Optimistic State (`useTasks`, `TaskStore`) with abstract storage layer.
- **Backend Readiness**: Zero UI coupling with network layer.

## Layout System (3-Column Architecture)
1. **Column 1 — Navigation Sidebar (~240px)**:
   - Window traffic lights
   - User account switcher
   - Quick find trigger
   - Core Views (Inbox, Today, Upcoming, Someday, Trash)
   - Project Lists with Emoji & Counter
   - Workspace status & collapse button
2. **Column 2 — Task Canvas (Flexible center)**:
   - Header with dynamic title, count, and view controls (`Sort`, `Filter`)
   - Inline task creation (`+ New task`)
   - Grouped sections (by Section, by Date, or by Category)
   - Task cards with reorder grip, checkbox, metadata tags, and quick actions
3. **Column 3 — Task Details Inspector (~360px collapsible)**:
   - Task title & metadata properties (Project, Due Date, Status, Assignee, Tags)
   - Rich Notes Editor (B, I, U, List, Link)
   - Interactive Sub-tasks Checklist
   - Activity Log Timeline
   - Bottom Action Bar (`Move Task to...` & `Close Details`)

## Anti-AI-Slop Rules
- No gratuitous gradients or iridescent glassmorphism
- No arbitrary non-token colors
- No fake decorative AI metric cards
- Strict 8px/4px layout rhythm
- No cards inside cards inside cards without visual purpose

## Gate Status
- **Phase 0 Discovery**: COMPLETED
- **Phase 1 Reference Analysis**: COMPLETED
- **Phase 2 UI Kit Development**: READY TO START
- **User Approval Gate**: HARD BLOCKED BEFORE APP PAGES

