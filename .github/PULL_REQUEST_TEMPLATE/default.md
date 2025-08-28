# Pull Request Template

## Summary
- One‑sentence description of the change.

## Context & Motivation
- Why this change? Link issues/docs/spec.
- Issue linking: use `Closes #123` to autoclose on merge.

## Scope
- What’s included.
- What’s explicitly out of scope (follow‑ups).

## Stack Plan (if stacked)
- [ ] PR 1: <title> — <short scope>
- [ ] PR 2: <title> — <short scope>

## Implementation Notes
- Key decisions, tradeoffs, alternatives considered.

## Test Plan (red → green → refactor)
- [ ] Add failing test(s) that demonstrate the change needed (red)
- [ ] Implement code so tests pass (green)
- [ ] Keep tests green while refactoring (refactor)
- [ ] Typecheck, lint, unit tests, build all pass locally

## Risks & Rollback
- Risks: <functional/perf/security/ops impacts>
- Rollback: <how to revert + validation>

## Screenshots / Recordings (if UI)
- Before/After images or short video/loom link

## Checklist
- [ ] Conventional Commits for each commit (≤72‑char subject, no emojis)
- [ ] PR size: ~100–250 effective LOC, ≤8 files; split/stack if >~300 non‑mechanical
- [ ] Mechanical changes isolated (formatting, renames, codegen, lockfiles)
- [ ] Lint, typecheck, tests, build all pass
- [ ] Docs updated (README/docs/CHANGELOG/Changesets if used)
- [ ] `Closes #123` added when applicable
- [ ] Opened as Draft; mark Ready for review once checks pass
- [ ] Branch name `[agent-name]/<slug>` (e.g., `claude/<slug>`); never commit to `main`
- [ ] `gt log` reviewed; stack submitted via Graphite
- [ ] Approval obtained for irreversible changes
- [ ] Experimental work in `exp/<slug>`; do not merge without tests

