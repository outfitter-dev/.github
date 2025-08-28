# Renovate Usage

This repo uses Renovate to manage dependency updates across multiple ecosystems (Bun/pnpm/npm, Go modules, Cargo). Dependabot security alerts remain enabled; Renovate handles the update PRs.

## Why Renovate

- Monorepo-of-projects friendly: group updates and limit PR noise.
- Polyglot: single config drives npm/pnpm, gomod, and cargo.
- Scheduling: updates during quiet windows (e.g., early Monday).
- Automerge for safe devDependency patch/minor updates.
- Labels and grouping for runtime/toolchain vs. app deps.

## Configuration

- Config file: `.github/renovate.json`
- Managers enabled: `npm`, `pnpm`, `gomod`, `cargo`
- Key rules:
  - Group devDependencies weekly; automerge patch/minor.
  - Separate “runtime & toolchain” (TypeScript, Turbo, etc.).
  - Weekly grouped backend (Go/Rust) updates.
  - Majors scheduled separately; no automerge.
  - Security/digest pins daily with `security` label.

## PR Behavior

- Branches/PRs opened per rules above with labels and grouping.
- CI should run lint/typecheck/tests for the touched project.
- For large waves, prefer Graphite stacked PRs when doing manual batches.

## Common Tasks

- Trigger a rebase: comment `@renovate rebase` on a Renovate PR.
- Re-run checks after fixing conflicts: push changes to the PR branch.
- Pause updates temporarily: add `"enabled": false` at repo root, or adjust `schedule` in `.github/renovate.json`.
- Exclude a folder or project:
  - Add to `ignorePaths` in config, e.g.: `"ignorePaths": ["waymark-internal/**", "brand/**"]`.
- Exclude specific packages:
  - Use `packageRules.matchPackagePatterns` with `enabled: false`.

## Bun, pnpm, Rust, Go Notes

- Bun: both `bun.lock` (text) and `bun.lockb` (binary) are used in this repo; Renovate will update dependencies via package.json even if lockfile regeneration is handled in CI.
- pnpm: lockfile is `pnpm-lock.yaml`; workspace filtering is respected by Renovate per package.
- Rust: Cargo updates via `cargo` manager; security checks are covered by CI with `cargo audit`/`cargo-deny` (where present).
- Go: Go modules handled by `gomod`; use `govulncheck` in CI for advisories.

## Local Manual Runs (optional)
Use helper scripts for local checks/updates/validation:

- `scripts/deps/update-check.sh`
- `scripts/deps/update-execute.sh [patch|minor|major]`
- `scripts/deps/update-validate.sh`

## Best Practices

- Keep runtime/toolchain bumps isolated from app deps.
- Auto-merge only low-risk devDependency patch/minor updates.
- Review majors with extra care; land behind flags if needed.
- Use Conventional Commits; Renovate PRs can be squashed to fit.

## Security

- Keep Dependabot security alerts enabled for visibility.
- Renovate’s `security` group handles digest/pin/security-related bumps; treat with priority.

---

Questions? Ping @galligan or open an issue.
