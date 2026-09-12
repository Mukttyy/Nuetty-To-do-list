# NUETTY ENGINEERING AUDIT REPORT

## Audit identity

- Protocol: `NUETTY MASTER AUDIT PROTOCOL v1.0`
- Audit date: 2026-09-10 (Asia/Jakarta)
- Repository: `/home/muktty/Documents/Wesclic/To Do List`
- Baseline: `main` at `159fbadd76643c91401e58806fb47a7d866feb35`
- Current product mode: local full-stack application with server accounts and PostgreSQL
- Overall result: **PASS for the verified local full-stack scope; not yet verified for public production deployment**

The worktree contained material user changes before the audit. They were preserved. Audit and implementation changes remain uncommitted.

## Verified baseline

| Area | Result | Evidence |
|---|---|---|
| Framework | PASS | Next.js 16.3.4, React 19.2.8, strict TypeScript |
| Repository integrity | PASS after recovery | zero-byte `.git/index` retained as `.git/index.corrupt-20260909-112828`; index reconstructed from HEAD without replacing working files |
| Backend | PASS for local scope | same-origin `/api/tasks`, Better Auth routes, PostgreSQL health endpoint |
| Database integrity | PASS | four checksum-protected migrations; user ownership FKs; stable positions and per-user revisions |
| Authentication | PASS for implemented scope | registration, sign-in, sign-out, server sessions, non-plaintext password storage check |
| Browser regression | PASS | ten Chromium scenarios covering prototype access, persistence, authorization, ordering, concurrent edits, two-user isolation, legacy data behavior, and responsive layout |
| Static/build gates | PASS | lint, typecheck, production build, and patch whitespace check |
| Dependencies | PASS | `npm audit --audit-level=high`: no known high/critical vulnerability |

## Gate status

| Gate | Status | Scope note |
|---|---|---|
| Product and architecture | PASS | records now match the approved full-stack and responsive inline architecture |
| Core user flows | PASS | register, sign in/out, create, reload, search, complete, trash, and restore exercised |
| Data and identity | PASS | server-owned datasets, runtime validation, transactions, FKs, and account isolation verified |
| UI and responsive | PASS for tested paths | login and dashboard tested at 375×812; navigation is off-canvas on mobile |
| Accessibility | PARTIAL | critical semantics/focus behavior improved; full WCAG 2.2 AA manual and automated audit is not complete |
| Security | PARTIAL | sessions, authorization, same-origin mutation check, limits, validation, headers, and dependency audit pass; deployed HTTPS/CSP/email verification remain open |
| Reliability | PARTIAL | transaction rollback, migration idempotency, ordering, sign-out flush, and multi-tab conflict behavior verified; backup restore, load, and long-duration testing remain open |
| Production | BLOCKED BY ENVIRONMENT | no public target, managed database, monitoring, backups, or incident/recovery evidence was supplied |

## Findings and disposition

### AUD-001 — Corrupt Git index

- Severity: HIGH
- Status: RESOLVED / RETESTED
- Repair: retained the corrupt index backup and safely reconstructed the index from HEAD.

### AUD-002 — Static quality failures

- Severity: HIGH
- Status: RESOLVED / RETESTED
- Repair: corrected hydration/state effects, component contracts, dead state/imports, and affected accessibility semantics.

### AUD-003 — Empty or corrupt browser tasks were overwritten

- Severity: HIGH
- Status: RESOLVED / RETESTED
- Repair: added runtime schema validation, honored a valid empty dataset, preserved malformed raw data, blocked destructive sync after load failure, and exposed the error.

### AUD-004 — Simulated authentication and browser-only persistence

- Severity: HIGH
- Status: RESOLVED / RETESTED
- Repair: replaced the fake profile gate with Better Auth email/password accounts and server sessions; added PostgreSQL-backed per-user tasks and removed false local-only claims.
- Evidence: sign-up/sign-in/logout/persistence browser flow passes; anonymous task access returns 401; two independent accounts cannot see each other's tasks.

### AUD-005 — Mobile interface unusable

- Severity: HIGH
- Status: RESOLVED / RETESTED
- Repair: fixed login overflow, introduced off-canvas navigation, and preserved a full-width narrow-screen task canvas.

### AUD-006 — No automated application tests

- Severity: HIGH
- Status: RESOLVED for the critical regression slice
- Repair: added Playwright orchestration with a guarded disposable database and ten deterministic scenarios.

### AUD-007 — Completion audio side effects

- Severity: MEDIUM
- Status: RESOLVED / STATICALLY RETESTED
- Repair: moved audio effects outside functional state updaters and removed duplicate connected-control playback.

### AUD-008 — Expired sample dates

- Severity: MEDIUM
- Status: RESOLVED
- Repair: replaced stale 2024 assumptions with truthful relative schedules.

### AUD-009 — Interactive semantics incomplete

- Severity: MEDIUM
- Status: PARTIALLY RESOLVED
- Repair: improved task controls, command-palette dialog/combobox/listbox behavior, focus containment/restoration, navigation triggers, and accessible names.
- Residual: complete keyboard, zoom/reflow, contrast, and screen-reader certification remains open.

### AUD-010 — Architecture records contradicted the product

- Severity: HIGH
- Status: RESOLVED BY OWNER DECISION
- Repair: decisions and constitution now record Next.js 16, PostgreSQL, Better Auth, the responsive two-region shell, inline task details, and actual folders.

### AUD-011 — Notes toolbar advertised unsupported formatting

- Severity: MEDIUM
- Status: RESOLVED
- Repair: removed the decorative formatting toolbar; notes remain an honest plain-text field until a safe document format and renderer are designed.

### AUD-012 — Production deployment not evidenced

- Severity: MEDIUM
- Status: OPEN / ENVIRONMENT-DEPENDENT
- Local work complete: framework disclosure removed; `nosniff`, same-origin framing, strict referrer, restrictive permissions policy, authenticated APIs, and production rate limiting configured.
- Required before public release: managed PostgreSQL, unique production secret, HTTPS origin verification, email verification/recovery, CSP design, monitoring, backups, restore drill, performance/load evidence, and an incident path.

### AUD-013 — Multi-tab write conflict

- Severity: MEDIUM
- Status: RESOLVED / RETESTED
- Repair: added a per-user collection revision, row locking, HTTP 409 rejection for stale writes, visible conflict state, and explicit server/local-copy recovery.

### AUD-014 — Generic prototype onboarding and false trust copy

- Severity: MEDIUM
- Status: RESOLVED / VISUALLY RETESTED
- Repair: removed the illustration carousel and account-isolation marketing badge; replaced them with a neutral single-column form and environment-gated prototype credentials.

### AUD-015 — Ordering, sign-out loss, and test pollution

- Severity: HIGH
- Status: RESOLVED / RETESTED
- Repair: persisted task position, propagated edits on input, blocked sign-out until pending saves finish, and moved E2E resets to a database-name-guarded `nuetty_test` database.

## Automated regression scenarios

1. Database health succeeds and anonymous task access is rejected.
2. The seeded prototype account can sign in.
3. A real server account persists a created task across reload and re-login, including search, completion, trash, restore, and a pending edit at sign-out.
4. A valid intentionally empty legacy dataset remains empty and its migration key is removed.
5. Corrupt legacy storage remains untouched and produces a visible error.
6. Account entry remains reachable at 375×812.
7. Task order and notes edited without blur survive reload.
8. The task canvas and off-canvas navigation remain usable at 375×812.
9. Two authenticated accounts remain data-isolated.
10. Concurrent stale writes are rejected and recoverable without silent overwrite.

The primary authenticated flow also checks that cross-origin mutation is rejected and invalid payloads fail validation.

## Release judgment

The application now has a real backend, PostgreSQL persistence, and server-backed identity. Its defined local full-stack scope is evidence-backed and suitable for continued development and controlled testing. It must not yet be labeled production-ready until AUD-012 is closed in the actual deployment environment. No claim of perfection or exhaustive coverage is made.
