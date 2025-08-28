# Release Pull Request

## Summary
- One‑sentence description of the release/version bump.

## Packages / Modules Affected
- <pkg-a>: x.y.z → x.y.z
- <pkg-b>: a.b.c → a.b.c

## Semver Rationale
- For each package, specify: patch/minor/major and why.
- Note any pre-release tags (beta/rc) and intended cadence.

## Changelog & Changesets
- Link to CHANGELOG entries or summarize notable changes.
- Link to included Changesets (if applicable) and confirm they match the versions above.

## Release Plan
- Target: main or  branch (if using release branches).
- Tagging: repo tag  (if used) and/or package-level tags.
- Distribution: npm publish (CI or manual), GitHub Release notes (if applicable).
- Rollout: outline any feature flags/gradual enablement.

## Test & Verification
- [ ] Typecheck, lint, unit tests, build all pass
- [ ] Smoke test of published artifact (local or canary install) if applicable
- [ ] No unintended code changes beyond version metadata (unless noted below)

## Breaking Changes & Migration (if any)
- Describe the breaking change(s)
- Provide concise migration instructions and examples

## Risks & Rollback
- Risks: dependency graph issues, unmet peer deps, publish failures
- Rollback: revert the PR and tag; publish a patch or deprecate problematic versions as needed

## Post‑merge Tasks
- Confirm tags/releases created
- Verify CI publish succeeded
- Update docs/website/release notes links if applicable

## Checklist
- [ ] Conventional Commit: 
- [ ] PR is primarily mechanical (version files, changelogs); any code changes are justified above
- [ ]  added when applicable
- [ ] Draft until all checks pass; mark Ready when green
- [ ] Branch name ; never commit to 
- [ ]  reviewed; stack via Graphite
- [ ] Approval obtained if any irreversible change (rare for version bumps)

