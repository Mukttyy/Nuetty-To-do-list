# Nuetty — Everything To Do List

Nuetty is a responsive full-stack task workspace built with Next.js 16, React 19, TypeScript, PostgreSQL, and Better Auth.

## What is implemented

- Email/password accounts backed by server sessions.
- Per-user tasks, custom projects and sections, subtasks, tags, priority, dates, and Trash stored in PostgreSQL.
- Runtime payload validation, transactional writes, database constraints, and versioned SQL migrations.
- Stable task ordering and revision-based conflict detection across tabs.
- Responsive desktop/mobile UI with an off-canvas mobile navigation.
- Date-derived Today and Upcoming views, plus Inbox, Anytime, Someday, Completed, and manually managed Trash.
- New accounts start empty. Sample projects and tasks are seeded only into the environment-gated demo account.

## Local development

Requirements: Node.js 20.9 or newer, npm, and Docker with Compose.

```bash
cp .env.example .env.local
# Set a unique BETTER_AUTH_SECRET and keep the PostgreSQL credentials aligned with compose.yaml.
npm install
npm run db:setup
npm run dev
```

Open the local URL printed by Next.js (normally `http://localhost:3000`; it may select another port when that port is occupied). Development authentication accepts HTTP loopback origins on the active port. The component playground remains available at `/ui-kit`.

When `DEMO_MODE=true`, `db:setup` creates an idempotent prototype account:

```text
Email: demo@nuetty.test
Password: NuettyDemo!2026
```

The demo endpoint and seed are disabled unless explicitly enabled, and the seed refuses to run in production.

Useful database commands:

```bash
npm run db:migrate
npm run db:down
```

`db:down` stops the local database container but retains its named volume. Real environment files remain ignored; `.env.test` contains only isolated, non-production test values.

## Quality gates

```bash
npm run lint
npm run typecheck
npm run test:e2e
npm run build
npm audit
```

The Playwright suite resets only the dedicated `nuetty_test` database, applies every migration, seeds the prototype account, and verifies authentication, persistence, custom project/section creation, account isolation, conflict handling, relational validation, Quick Find routing, manual Trash deletion, and responsive behavior. The reset script refuses database names that do not end in `_test`.

## Production boundary

Before a public deployment, provide production-managed PostgreSQL, HTTPS URLs, a unique secret, backups, monitoring, and a tested recovery path. Email verification, password reset, reminders, and repeating tasks are not implemented yet. Current synchronization replaces one user's complete workspace atomically; revision checks stop stale tabs and require the user to choose the server or local copy.

## Audit records

- `docs/MASTER_AUDIT_PROTOCOL.md` defines the audit method and evidence rules.
- `docs/AUDIT_REPORT.md` contains the current verified results and remaining risks.
