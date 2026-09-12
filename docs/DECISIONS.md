# DECISIONS REGISTRY

## D-001
- **Decision**: Adopt Next.js App Router + TypeScript Strict as core framework.
- **Status**: SUPERSEDED BY D-012 for the exact supported version
- **Reason**: Standardized React ecosystem, server/client component separation, robust typing.

---

## D-002
- **Decision**: Visual Reference Source of Truth = Things 3 / Linear Desktop Productivity Hybrid.
- **Status**: APPROVED
- **Reason**: Uploaded reference screens define layout, typography, palette, tokens, and UX flow.

---

## D-003
- **Decision**: 3-Column Layout Architecture (Sidebar ~240px, Canvas flex-1, Inspector ~360px).
- **Status**: SUPERSEDED BY D-013
- **Reason**: Directly observed in reference screens and established in Constitution.

---

## D-004
- **Decision**: Semantic Functional Color Tokens (Emerald for Today, Purple for Upcoming, Amber for Someday, Blue for Inbox/Primary, Rose for Overdue).
- **Status**: APPROVED
- **Reason**: Strict 1-to-1 visual fidelity; forbids arbitrary random colors.

---

## D-005
- **Decision**: UI Kit First with Hard User Approval Gate before page/feature development.
- **Status**: APPROVED
- **Reason**: Mandated by Master Prompt V3 (#0, #4, #9, #31).

---

## D-008
- **Decision**: Official Project Name = `nuetty - to do list`. Removed artificial macOS window traffic lights and `Full Screen Canvas` badge.
- **Status**: SUPERSEDED BY D-018
- **Reason**: Requested by user to keep UI quiet, native, and free from redundant decorative elements.

---

## D-009
- **Decision**: UI Kit v1.0 LOCKED. Proceed to Phase 4 (Layout System).
- **Status**: APPROVED (User Explicit Decision)
- **Reason**: User verified the complete UI Kit in `/ui-kit`, confirmed absence of AI slop, and gave explicit green light to advance.

---

## D-010
- **Decision**: Local-First State Store with LocalStorage Persistence (`nuetty_tasks_v1`) and zero network latency.
- **Status**: SUPERSEDED BY D-012
- **Reason**: Provides immediate desktop feel, offline resilience, and automatic state preservation across page reloads.

---

## D-011
- **Decision**: Quick Find Command Palette (`⌘K`), Desktop Keyboard Shortcuts (`Space`, `↑`, `↓`, `Esc`, `Delete`), and Real-Time Sort & Filter Controls.
- **Status**: APPROVED
- **Reason**: Completes high-efficiency workflow matching Things 3 and Linear productivity mechanics.

---

## D-012
- **Decision**: Adopt Next.js 16.3.4, Better Auth, same-origin Route Handlers, and PostgreSQL as the authoritative full-stack architecture. Browser task storage is retained only as a one-time migration source.
- **Status**: APPROVED (User Explicit Decision, 2026-09-09)
- **Reason**: The user requested a real backend and database; accounts, authorization, durable data, and multi-user isolation require a server trust boundary.

---

## D-013
- **Decision**: Use a responsive two-region shell (navigation + task canvas) with inline task expansion. On mobile, navigation becomes off-canvas.
- **Status**: APPROVED (User Explicit Decision, 2026-09-09)
- **Reason**: Inline detail preserves task-list context and remains usable at narrow widths; the former fixed inspector contract contradicted the implemented, tested product.

---

## D-014
- **Decision**: Use normalized ownership-aware tables, foreign keys, transactional full-dataset replacement per user, Zod request validation, and ordered checksum-protected SQL migrations.
- **Status**: APPROVED (User Explicit Decision, 2026-09-09)
- **Reason**: This gives the current small product a measurable integrity boundary without introducing an unnecessary ORM layer. D-017 adds revision checks to the same transaction boundary.

---

## D-015
- **Decision**: Notes remain plain text. Remove non-functional rich-text controls until a persisted format, sanitization policy, and renderer are specified and tested.
- **Status**: APPROVED (User Explicit Decision, 2026-09-09)
- **Reason**: A visible control must perform its advertised action; removing false affordances is safer than implying unsupported formatting.

---

## D-016
- **Decision**: Use a single-column, neutral prototype sign-in screen with an environment-gated seeded demo account. Remove the decorative illustration carousel and unverifiable account-isolation badge.
- **Status**: APPROVED (User Explicit Decision, 2026-09-10)
- **Reason**: Prototype access should be immediate and truthful; ornamental onboarding content and security marketing copy added noise without product value.

---

## D-017
- **Decision**: Persist task position and a per-user collection revision, reject stale writes with HTTP 409, expose explicit conflict recovery, flush pending changes before sign-out, and run browser tests against a guarded disposable test database.
- **Status**: APPROVED (User Explicit Decision, 2026-09-10)
- **Reason**: These controls prevent silent ordering changes, stale-tab overwrite, sign-out data loss, and test pollution of the development database.

---

## D-018
- **Decision**: Official product identity is `Nuetty — Everything To Do List`, using the supplied geometric N mark in the application shell, account entry, and browser metadata.
- **Status**: APPROVED (User Explicit Decision, 2026-09-10)
- **Reason**: One consistent name and mark makes the prototype recognizable across the interface and browser tab without introducing extra decorative branding.

---

## D-019
- **Decision**: Built-in lists are computed perspectives; projects and sections are user-owned data. Today and Upcoming derive from an ISO calendar date, Anytime contains active undated work, and Someday represents deferred availability rather than workflow status.
- **Status**: APPROVED (User Explicit Decision, 2026-09-10)
- **Reason**: This removes hard-coded demo taxonomy and prevents tasks from requiring manual movement as calendar days change.

---

## D-020
- **Decision**: Trash has indefinite retention. Only an explicit per-item permanent delete or confirmed Empty Trash operation removes task records.
- **Status**: APPROVED (User Explicit Decision, 2026-09-10)
- **Reason**: The user requires full manual control over irreversible deletion.
