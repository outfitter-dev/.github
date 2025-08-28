# Repository Guidelines

## Project Structure & Module Organization

- Monorepo layout:
  - `apps/*` — runnable apps (APIs with Hono/Axum, frontends with React/TanStack).
  - `packages/*` — shared libraries; UI components in `packages/ui/components`.
  - `e2e/*` — Playwright tests; fixtures in `e2e/fixtures`.
  - `.github/*` — workflows, issue/PR templates.
- Tests live next to code (`foo.test.ts`) or under `__tests__/`.

## Build, Test, and Development Commands

- `bun install` — install dependencies.
- `bun run dev` — start the active app; see each app’s README for ports.
- `bun run build` — typecheck and build all packages.
- `bun test` — run unit tests (Vitest).
- `bunx playwright test` — run E2E tests.
- `bun run lint` and `bun run format` — lint and format (ESLint/Prettier).

## Coding Style & Naming Conventions

- TypeScript strict; prefer explicit types and narrow unions.
- 2‑space indent; single quotes; trailing commas; organized imports.
- File names: kebab-case; React components: PascalCase.
- Branches: `feat/area/slug`, `fix/issue-123`, `exp/codename`.
- Keep PRs small (~<300 lines); feature‑flag incomplete work.

## Testing Guidelines

- Frameworks: Vitest (unit), Playwright (E2E).
- Name files `*.test.ts[x]`; colocate with the code under test.
- Don’t regress coverage; add tests for new behavior.
- Run `bun test` and `bunx playwright test` locally before PRs.

## Commit & Pull Request Guidelines

- Use Graphite (`gt`) with stacked PRs; `main` stays releasable.
- Flow: write code → `git add -A` → `gt create -m "feat(area): short summary"` → `gt submit --no-interactive`.
- Commits: imperative present; reference issues (`#123`) when relevant.
- PRs: clear description, linked issues, screenshots for UI, repro steps for bugs.
- Squash‑merge; avoid merge commits; keep branches short‑lived and rebased.

## Labels & Issue Hygiene

- Standard labels: `type/*`, `priority/P[0-3]`, `status/*`, `semver/*`, `scope/*`.
- Sync labels via GitHub Actions: Actions → "Update repository labels" → Run workflow.
- From another repo, call reusable workflow: `uses: outfitter-dev/.github/.github/workflows/labels.yml@main` (requires `permissions: issues: write`).
- Edit label definitions in `src/labels/*`; CI rebuilds `.github/labels.json` on `main`. See `docs/actions/update-labels.md` for details and troubleshooting.

## Security & Configuration

- Use `.env.local` for secrets; never commit secrets. Update `.env.example` when adding vars.
- Prefer Cloudflare/Vercel environment variables for deployment.
