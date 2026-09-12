# NUETTY MASTER AUDIT PROTOCOL v1.0

## 1. Objective

Audit Nuetty end to end with reproducible evidence, repair confirmed defects with the smallest safe change, and verify that the exact audited revision is fit for its declared use.

This protocol does not claim that software can be proven to contain zero defects. A PASS means no known unresolved blocking finding remains within the recorded scope, revision, environment, and methods.

## 2. Audit Scope and Product Boundary

Before conclusions or code changes, record:

- repository path, branch, commit, working-tree state, and audit date;
- framework, runtime, package manager, browser targets, and dependency snapshot;
- intended product mode: prototype, local-only application, or production service;
- applicable features and explicit exclusions;
- available environments, credentials, test data, and infrastructure;
- destructive actions and production testing that are out of scope.

Features that are visible to users are considered implemented unless clearly labelled as unavailable prototypes. Documentation cannot silently redefine broken UI as acceptable.

## 3. Non-Negotiable Principles

- Evidence before conclusions.
- Unknown remains `UNVERIFIED`; uncertainty is never converted into PASS.
- No silent failure, hidden data loss, misleading success, or fake security.
- No invented requirements, API behavior, database fields, or infrastructure.
- No speculative abstraction, unnecessary dependency, or style-only refactor.
- Preserve existing user work and capture a baseline before modification.
- Fix root causes with the smallest safe change.
- Every meaningful fix requires targeted retest and regression analysis.
- Scale and future-proofing must follow credible requirements, not hypothetical vanity targets.
- Security, privacy, accessibility, and data integrity are product behavior, not optional polish.

## 4. Control Status

Each control and phase uses exactly one status:

- `PASS`: applicable checks passed with sufficient evidence.
- `FAIL`: one or more unresolved blocking findings remain.
- `BLOCKED`: verification cannot proceed without a stated dependency or authority.
- `UNVERIFIED`: evidence is insufficient.
- `NOT_APPLICABLE`: demonstrably outside the declared product boundary, with rationale.
- `ACCEPTED_RISK`: explicitly accepted by an authorized owner with rationale, compensating control, owner, and expiry date.

`NOT_APPLICABLE`, `UNVERIFIED`, and `ACCEPTED_RISK` are never aliases for PASS.

## 5. Severity

Severity considers impact, likelihood, exploitability, exposure, and recoverability.

- `CRITICAL`: credible data loss/corruption, authentication or authorization bypass with meaningful impact, severe compromise, or catastrophic failure.
- `HIGH`: major feature, security, privacy, integrity, reliability, or accessibility failure.
- `MEDIUM`: meaningful functional or UX defect, realistic maintainability risk, or moderate performance/reliability issue.
- `LOW`: minor defect or limited inconsistency.
- `INFO`: evidence-backed non-blocking observation.

Critical findings block release. High findings block release unless formally accepted by the project owner. The auditor cannot accept risk on the owner's behalf.

## 6. Required Evidence

Important checks record, where applicable:

- commit or working-tree snapshot;
- timestamp and environment versions;
- exact command, request, interaction, or inspection performed;
- expected and actual result;
- relevant source location;
- test output, log, screenshot, trace, or persisted-state observation;
- limitation and confidence level (`HIGH`, `MEDIUM`, `LOW`).

Evidence containing credentials or personal data must be redacted. Destructive, load, and fault testing must not target production without explicit authorization and recovery controls.

## 7. Finding Record

Every confirmed finding contains:

- ID, phase, severity, category, status, and confidence;
- location;
- expected and actual behavior;
- reproduction and evidence;
- root cause and impact;
- minimal recommended fix and blast radius;
- files changed;
- targeted retest and regression result;
- owner or blocker when unresolved.

Duplicate symptoms that share one root cause should be represented by one primary finding with linked evidence.

## 8. Audit Workflow

### Stage A — Baseline and Discovery

1. Preserve working-tree state and identify repository integrity problems.
2. Read requirements, decisions, changelog, setup instructions, and version-matched framework documentation.
3. Inventory architecture, routes, components, state, storage, tests, dependencies, deployment, and external systems.
4. Create requirement-to-implementation-to-test traceability.
5. Run baseline lint, typecheck, tests, build, dependency scan, and runtime smoke checks without modifying application behavior.

### Stage B — Triage

Order work by:

1. active security exposure and data loss;
2. cross-cutting root causes;
3. Critical then High severity;
4. dependency order and blast radius;
5. Medium and Low findings.

An urgent Critical finding may interrupt discovery after evidence is preserved.

### Stage C — Vertical-Slice Audit and Repair

Audit each applicable user flow through all layers:

`Requirement → UI → state → persistence/API → validation → result → failure handling → tests → documentation`

For each confirmed issue:

`Reproduce → record → analyze root cause → define expected behavior → patch minimally → targeted retest → dependent regression → rescan`

### Stage D — Horizontal Sweeps

After core flows stabilize, scan the whole system for cross-cutting issues:

- security, privacy, and business-logic abuse;
- data integrity, persistence, concurrency, and recovery;
- accessibility and responsive behavior;
- performance and credible capacity limits;
- dependency/supply-chain integrity;
- dead code, duplication, complexity, and AI-slop;
- configuration, production, observability, backup, and documentation drift.

### Stage E — Final Verification

1. Install and run from a clean environment where feasible.
2. Run full lint, typecheck, automated tests, production build, runtime flows, and applicable rescans.
3. Reconcile every control and finding.
4. Perform a fresh forensic pass against the exact final snapshot, preferably in a separate context before reading prior conclusions.

## 9. Quality Gates

### Gate 0 — Product and Requirements

Verify product mode, users, primary journeys, scope, acceptance criteria, assumptions, contradictions, and documentation authority.

### Gate 1 — Repository and Architecture

Verify repository integrity, framework conventions, component boundaries, dependency direction, state/data flow, dead code, duplication, and unnecessary complexity.

### Gate 2 — Core User Flows

Verify every implemented flow in default, empty, success, validation, duplicate-action, error, stale, refresh, and recovery states. For Nuetty this includes task create, view, edit, complete/uncomplete, move, soft-delete, restore, search, filter, sort, navigation, and persistence.

### Gate 3 — Data, API, Backend, and Identity

Verify contracts, schema validation, IDs, dates, state transitions, ownership, authentication, authorization, database integrity, migrations, and failure behavior. Missing layers are `NOT_APPLICABLE` only when the product makes no claim that they exist.

### Gate 4 — UI, Accessibility, and Responsive Behavior

Verify the approved design system plus semantics, labels, keyboard operation, focus management, contrast, zoom/reflow, reduced motion, touch targets, and supported viewport/browser matrix. Target WCAG 2.2 AA for applicable behavior.

### Gate 5 — Security, Privacy, and Supply Chain

Verify trust boundaries, input handling, storage exposure, XSS/CSRF/injection applicability, session behavior, secrets, headers, dependency vulnerabilities, lockfile integrity, package necessity, personal-data lifecycle, and third-party risk.

### Gate 6 — Reliability and Performance

Verify silent failures, corrupted state, storage/network failure, concurrency, idempotency, recovery, resource bounds, rendering/request cost, and measurable performance against a declared workload.

### Gate 7 — Testing

Verify test quality rather than coverage alone: unit, integration, browser/E2E, negative, regression, accessibility, and failure tests as applicable. Assertions must derive from authoritative expected behavior.

### Gate 8 — Production and Documentation

Verify clean setup, environment separation, production build/start, deployment assumptions, logging, monitoring, rollback/recovery, README accuracy, architecture records, and change history.

### Gate 9 — Final Forensic Gate

Repeat discovery and high-risk flows from a clean perspective. Confirm that no Critical remains, no unaccepted High remains, all fixes are retested, limitations are explicit, and the report is tied to the exact final snapshot.

## 10. Regression Cadence

- Per fix: targeted reproduction and directly related behavior.
- Per batch: lint, typecheck, relevant integration/browser tests, and affected-layer scan.
- Per gate or cross-cutting change: full automated suite, production build, and broader regression.

Authentication, shared state, persistence schema, global components, dependency, and build configuration changes require broader regression immediately.

## 11. Stop Conditions

Stop the affected work and report rather than guess when:

- product intent is ambiguous enough to change architecture;
- credentials, infrastructure, or authoritative requirements are missing;
- a change risks unrecoverable data loss;
- production testing is unsafe;
- evidence cannot be reproduced;
- user-owned changes cannot be distinguished or preserved.

Record `BLOCKED BY`, `NEEDED`, and `STILL VERIFIABLE`.

## 12. Completion Rule

The audit is complete only when:

- every applicable gate has a disposition and evidence;
- no Critical or unaccepted High finding remains;
- every implemented fix has passed targeted retest and appropriate regression;
- assumptions, exclusions, limitations, and residual risks are explicit;
- documentation matches the final behavior;
- the final result identifies the exact audited revision and revalidation triggers.

Final outcome: `PASS`, `FAIL`, or `BLOCKED`, with non-blocking notes and accepted risks listed separately.
