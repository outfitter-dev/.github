# Bugfix Pull Request

## Summary
- One‑sentence description of the bug and the fix.

## Bug Context
- Impacted users/surfaces.
- First observed when and where.

## Reproduction
- Steps to reproduce (current behavior).
- Expected behavior.

## Root Cause
- Brief analysis of the underlying cause.
- Links to relevant code/commits/logs.

## Fix Strategy
- Approach taken and why it’s safe.
- Alternatives considered.

## Scope
- What’s included.
- Out of scope / follow‑ups.

## Test Plan (red → green → refactor)
- [ ] Add failing regression test(s) that prove the bug (red)
- [ ] Implement the fix so tests pass (green)
- [ ] Keep tests green while refactoring (refactor)
- [ ] Typecheck, lint, unit tests, build all pass locally
- [ ] Negative tests and edge cases covered

## Risks & Rollback
- Risks: functional/security/perf/ops
- Rollback: how to revert + validation steps

## Screenshots / Recordings (if UI)
- Before/After images or short video/loom link

## Checklist
- [ ] Conventional Commits (, ≤72‑char subject, no emojis)
- [ ]  added when applicable (autoclose on merge)
- [ ] PR size within budget (~100–250 LOC, ≤8 files); split/stack if >~300 non‑mechanical
- [ ] Mechanical changes isolated (formatting/renames/codegen/lockfiles)
- [ ] Lint, typecheck, tests, build all pass
- [ ] Docs updated if behavior changed (README/docs/CHANGELOG)
- [ ] Opened as Draft; mark Ready after checks pass
- [ ] Branch ; never commit to 
- [ ]  reviewed; stack submitted via Graphite
- [ ] Approval obtained if any irreversible change

