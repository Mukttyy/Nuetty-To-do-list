# PROJECT CONSTITUTION — NUETTY

## Product

- **Name**: Nuetty — Everything To Do List
- **Purpose**: a quiet, responsive task manager with fast inline editing and durable, account-isolated server storage.
- **Reference character**: Things 3 / Linear-grade desktop productivity, adapted for desktop and mobile web.

## Approved technical baseline

- **Application**: Next.js 16 App Router, React 19, strict TypeScript.
- **Styling**: Tailwind CSS with semantic design tokens; Lucide icons and native emoji.
- **Backend boundary**: same-origin Next.js Route Handlers.
- **Identity**: Better Auth email/password accounts and cookie-backed server sessions.
- **Database**: PostgreSQL 17 with versioned, checksum-protected SQL migrations.
- **Validation**: Zod at the API boundary plus PostgreSQL constraints and foreign keys.
- **Testing**: ESLint, TypeScript, Playwright browser flows, production build, and dependency audit.

## Product invariants

1. Every task query and mutation is authorized against the active server session.
2. Task, subtask, and activity ownership remains bound to one database user.
3. Multi-entity saves are atomic: the complete valid dataset commits or rolls back.
4. Invalid or corrupt legacy browser data is surfaced and never silently overwritten.
5. Browser storage is only a one-time migration source; PostgreSQL is authoritative.
6. Controls must perform the action they advertise. Unimplemented controls remain disabled or absent.
7. Mobile navigation must not reduce the main task canvas below a usable width.
8. A stale client revision must never overwrite a newer server revision silently.
9. Sign-out must wait for pending task writes or remain blocked with a visible error.

## Current architecture

```text
Browser UI
  ├─ Better Auth client ──> /api/auth/* ──> Better Auth ──> PostgreSQL
  └─ task domain + sync hooks ─> /api/tasks ─> repository ─> PostgreSQL

src/
  app/                 App Router pages and API Route Handlers
  components/auth/     Account entry UI
  components/layout/   Responsive shell, navigation, top bar, command palette
  components/views/    Task views
  components/ui/       Reusable visual primitives
  lib/                 Client state, auth client, validation, seed/migration data
  server/              Server-only auth, database pool, task repository
  types/               Domain types
migrations/            Ordered SQL schema history
scripts/               Migration, demo seed, and guarded test reset tools
tests/e2e/             Critical browser regression suite
```

## Layout contract

- **Desktop**: collapsible navigation sidebar plus flexible task canvas; the selected task expands inline so context is preserved.
- **Mobile**: full-width task canvas plus off-canvas navigation and overlay.
- **Notes**: stored and edited as plain text. No formatting affordance may be shown until a safe persisted document format and renderer are implemented.

## Design rules

- Neutral surfaces, high-contrast text, restrained semantic accents.
- Strict 4/8 px spacing rhythm and purposeful hierarchy.
- No gratuitous gradients, glassmorphism, fake metrics, or decorative controls.
- Prototype entry is a restrained single-column form; decorative onboarding carousels and unverifiable trust claims are prohibited.
- No claims of cloud readiness, recovery, or synchronization guarantees without evidence.

## Delivery state

- UI kit, responsive shell, views, command palette, filtering, task editing, authentication, PostgreSQL persistence, migrations, and the critical regression suite are implemented.
- Public production deployment remains gated by managed infrastructure, email verification/recovery, observability, backup/restore testing, and deployed-environment validation.
