# GitHub Labels System

This directory contains the source of truth for GitHub issue and PR labels across the Outfitter organization.

## Overview

The labels system provides consistent issue tracking across all repositories while allowing flexibility for repo-specific needs. Labels are organized into categories for easy management and automation.

## Label Structure

### Core Labels (`core.json`)

Always included in every repository. These provide the foundation for issue tracking:

#### Issue Types

- `type/bug` - Something isn't working
- `type/feature` - New capability
- `type/refactor` - Code restructuring; no behavior change
- `type/docs` - Documentation
- `type/performance` - Performance or efficiency work
- `type/security` - Security fix or hardening
- `type/chore` - Routine maintenance and housekeeping
- `type/question` - Question or clarification needed
- `type/feedback` - User or stakeholder feedback
- `type/idea` - Feature idea or suggestion
- `type/epic` - Large feature or initiative

#### Bug Categories (Failure Modes)

- `bug/regression` - Previously working functionality broke
- `bug/crash` - Fatal error causing termination
- `bug/security` - Security vulnerability or exposure
- `bug/performance` - Slow, inefficient, or resource-heavy
- `bug/data-loss` - Data corruption or loss
- `bug/compat` - Compatibility between systems/versions
- `bug/ui` - Visual defects or layout issues
- `bug/flaky` - Intermittent failures
- `bug/blocked` - Prevents other work from proceeding

#### Status Tracking

- `status/triage` - Awaiting initial assessment
- `status/ready` - Groomed and ready to start
- `status/in-progress` - Actively being worked
- `status/in-review` - Awaiting code review
- `status/blocked` - Blocked by dependency/decision

#### Requirements (needs/)

- `needs/design` - Design/RFC required
- `needs/decision` - Stakeholder/product decision required
- `needs/docs` - Docs work outstanding
- `needs/tests` - Tests/QA outstanding
- `needs/review` - Code review required
- `needs/repro` - Reproduction steps needed
- `needs/help` - Help wanted
- `needs/qa` - QA verification required before merge
- `needs/backport` - Backport/cherry-pick to release branch required

#### Issue States

- `state/duplicate` - Duplicate of another issue
- `state/invalid` - Not a valid issue
- `state/wontfix` - Not planned
- `state/obsolete` - No longer relevant
- `state/stale` - Closed due to inactivity
- `state/deprecated` - Deprecated - scheduled for removal

#### Size Indicators

- `size/XS` - Very small change (≈ ≤25 LOC)
- `size/S` - Small change (≈ 26–100 LOC)
- `size/M` - Medium change (≈ 101–300 LOC)
- `size/L` - Large change (≈ 301–800 LOC)
- `size/XL` - Very large change (≈ >800 LOC)

#### Semantic Versioning

- `semver/major` - Breaking change
- `semver/minor` - Backward-compatible feature
- `semver/patch` - Backward-compatible bug fix
- `semver/hotfix` - Hotfix - expedite to production
- `semver/version-bump` - Version bump only

#### Source Tracking

- `source/community` - Opened by external contributor/user
- `source/internal` - Opened by core team
- `source/user` - Requested by a user/customer
- `source/agent` - Created by AI agent

#### Community Labels

- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed

#### AI Agent Labels

- `agent/claude` - Claude AI integration/functionality
- `agent/coderabbit` - CodeRabbit AI integration/functionality
- `agent/codex` - Codex AI integration/functionality
- `agent/cursor` - Cursor AI integration/functionality
- `agent/amp` - Amp AI integration/functionality
- `agent/devin` - Devin AI integration/functionality

#### Merge Queue

- `queue/merge` - Ready to merge
- `queue/hotfix` - Hotfix - expedite merge

#### Changesets

- `changeset/added` - Changeset has been added
- `changeset/needed` - PR needs a changeset
- `changeset/skip` - Skip changeset for this PR

### Common Scopes

Included by default in all repositories (indicates WHERE in the system) as part of `core.json`:

- `scope/api` - API endpoints and contracts
- `scope/ui` - UI/UX components and styling
- `scope/cli` - Command-line tools and interfaces
- `scope/backend` - Backend services, workers, runtime
- `scope/docs` - Documentation, guides, and examples (distinct from `type/docs`)
- `scope/build` - Build system and compilation
- `scope/ci` - CI/CD pipelines and automation
- `scope/deps` - Dependencies and packages
- `scope/tests` - Test suites and coverage
- `scope/architecture` - System design and structure

### Optional Labels (`labels-optional.json`)

Available for repos to enable based on their specific needs. These include additional scopes, test categories, lifecycle stages, CI controls, and meta labels:

#### Infrastructure & Platform

- `scope/db` - Database schemas, migrations, queries
- `scope/auth` - Authentication and authorization
- `scope/infra` - Infrastructure and hosting
- `scope/config` - Configuration and environment settings
- `scope/monitoring` - Logging, metrics, and observability
- `scope/deployment` - Deployment to environments and servers
- `scope/distribution` - Package publishing and release artifacts

#### Development Areas

- `scope/dx` - Developer experience improvements
- `scope/tooling` - Development tools and scripts
- `scope/mobile` - Mobile applications
- `scope/sdk` - SDK and library development
- `scope/integrations` - Third-party integrations

#### Business/Product

- `scope/analytics` - Analytics, tracking, and metrics
- `scope/billing` - Payments, subscriptions, and billing
- `scope/onboarding` - User onboarding and first-run experience
- `scope/i18n` - Internationalization and translations

#### Architecture

- `scope/monorepo` - Monorepo structure and tooling
- `scope/packages` - Package and library management
- `scope/types` - TypeScript types and definitions
- `scope/schemas` - Data schemas and validation
- `scope/performance` - Performance optimization
- `scope/reliability` - Reliability and stability
- `scope/security` - Security concerns and hardening
- `scope/qa` - Quality assurance processes
- `scope/logging` - Logging and observability
- `scope/error-handling` - Error handling and recovery
- `scope/code-quality` - Code quality and standards
- `scope/dev-workflow` - Development workflow and processes

#### Test Labels

- `test/coverage` - Test coverage improvements
- `test/utils` - Test utilities and helpers
- `test/e2e` - End-to-end tests
- `test/unit` - Unit tests
- `test/integration` - Integration tests

#### Priority Labels (for non-Linear projects)

- `priority/P0` - Critical—top of queue
- `priority/P1` - High priority
- `priority/P2` - Medium priority
- `priority/P3` - Low priority

#### Urgency Indicators (Linear-compatible)

- `urgency/critical` - Critical urgency - immediate action
- `urgency/high` - High urgency - soon
  (Everything else is normal urgency by default)

#### Lifecycle Labels

- `lifecycle/experimental` - Experimental feature - may change
- `lifecycle/beta` - Beta feature - stabilizing
- `lifecycle/stable` - Stable feature - production ready
- `lifecycle/deprecated` - Deprecated - will be removed

#### CI/CD Control

- `ci/skip` - Skip CI checks
- `ci/urgent` - Bypass CI requirements (emergency)
- `ci/benchmark` - Run performance benchmarks
- `ci/e2e` - Run full E2E test suite

#### Meta Labels

- `meta/breaking` - Contains breaking changes
- `meta/changelog` - Include in changelog
- `meta/release-notes` - Highlight in release notes
- `meta/no-stale` - Exempt from stale bot
- `meta/preflight` - Release preparation tasks
- `meta/release-blocker` - Must resolve before release
- `meta/standards` - Standards compliance and conventions

## Linear Priority Integration

For projects using Linear:

### Native Priority Field

Linear has a dedicated priority field (P0-P4) that syncs bidirectionally with GitHub. This is preferred over priority labels to avoid duplication.

### Alternative Urgency Indicators

If you need additional urgency context beyond Linear's priority field:

- `urgency/critical` - Immediate action required
- `urgency/high` - Needs attention soon
- `meta/release-blocker` - Must resolve before release

These complement Linear's priority without duplicating it.

### Automation Options

#### GitHub Actions + Linear API

```yaml
name: Sync Linear Priority
on:
  issues:
    types: [labeled]
jobs:
  sync:
    if: startsWith(github.event.label.name, 'priority/')
    steps:
      - uses: linear-app/action@v1
        with:
          set-priority: ${{ github.event.label.name }}
```

#### Linear Webhooks → GitHub API

Set up Linear webhooks to update GitHub labels when priority changes in Linear.

### For Non-Linear Projects

Use traditional `priority/*` labels from the optional set.

## Version Tracking Strategies

Instead of version-specific labels that become stale, consider these scalable approaches:

### GitHub Milestones (Recommended)

- Create milestones for each release (v1.0, v1.1, v2.0)
- Assign issues to milestones for version planning
- Automatically track progress percentage
- Easy to bulk-move issues between releases
- Clean up by closing milestones after release

### GitHub Projects

- Create a project board per release
- Use columns: Backlog → Todo → In Progress → Done
- Provides kanban-style visualization
- Can span multiple repositories

### Branch-Based Labels

For backporting and maintenance:

- `needs-backport` - Flag for backporting decision
- `backported` - Already backported to stable branches

### Urgency + Meta Labels

Focus on urgency rather than specific versions:

- `urgency/critical` + `meta/release-blocker` - Must fix before ANY release
- `urgency/high` - Should be addressed soon
- No label = Normal urgency
- Use Linear's priority field for actual prioritization

This approach scales better because urgency naturally cascades as releases complete, without needing to update labels.

## Label Philosophy: Scopes vs Categories

The labeling system uses two complementary dimensions:

- **Scopes** (`scope/*`) indicate **WHERE** in the system (which area/component)
- **Bug categories** (`bug/*`) indicate **HOW** it fails (the failure mode/symptom)
- **Type labels** (`type/*`) indicate **WHAT** kind of work (bug, feature, docs, etc.)
- **Priority** - Use Linear's field (or `priority/*` labels if not using Linear)
- **Urgency** (`urgency/*`) - Additional context beyond priority

### Example Combinations

For a build system that won't compile:

- `type/bug` + `bug/blocked` + `scope/build` + `urgency/critical`

For flaky CI tests:

- `type/bug` + `bug/flaky` + `scope/tests` + `scope/ci`

For slow API responses:

- `type/bug` + `bug/performance` + `scope/api` + `scope/backend`

For a dependency security vulnerability:

- `type/security` + `bug/security` + `scope/deps` + `meta/release-blocker`

For npm package publishing issues:

- `type/bug` + `bug/blocked` + `scope/distribution`

For server deployment failures:

- `type/bug` + `bug/blocked` + `scope/deployment`

For release preparation tasks:

- `type/chore` + `meta/preflight` + `scope/documentation` (updating docs for release)
- `type/chore` + `meta/preflight` + `scope/build` (version bumping)
- `type/bug` + `meta/release-blocker` + `urgency/critical` (critical bug found during release prep)

This separation allows precise issue categorization while avoiding label proliferation. You don't need `bug/build`, `bug/ci`, `bug/deps` because those are scopes, not failure modes.

**Note on deployment vs distribution:**

- `scope/deployment` - Getting your app running on servers/cloud (Vercel, AWS, K8s)
- `scope/distribution` - Publishing packages/artifacts for others to use (npm, Docker Hub, releases)

## Using the Labels System

### For New Repositories

1. Create `.github/workflows/update-labels.yml` in your repository:

```yaml
name: Update Labels

on:
  workflow_dispatch:
  push:
    branches:
      - main
    paths:
      - '.github/workflows/update-labels.yml'

jobs:
  update-labels:
    uses: outfitter-dev/.github/.github/workflows/labels.yml@main
    permissions:
      issues: write
    with:
      # Core labels are always included
      # Common scopes are included by default (api, ui, cli, backend, documentation, build, ci, deps, tests, architecture)

      # Uncomment additional scopes as needed:
      additional_scopes: |
        # scope/db
        # scope/auth
        # scope/deployment
        # lifecycle/experimental

      # Or add custom labels specific to this repo:
      # custom_labels: |
      #   [
      #     { "name": "project/special", "color": "ff0000", "description": "Special project" }
      #   ]
```

2. Commit and push the workflow file
3. Labels will be automatically created/updated

### Manual Trigger

You can manually trigger label updates:

1. Go to Actions tab in the `.github` repository
2. Select "Update repository labels" workflow
3. Click "Run workflow"
4. Optionally specify a target repository (format: `owner/repo`)
5. Click "Run workflow" button

### Updating a Different Repository

```yaml
name: Update Labels in Another Repo

on:
  workflow_dispatch:

jobs:
  update-labels:
    uses: outfitter-dev/.github/.github/workflows/labels.yml@main
    with:
      repository: 'outfitter-dev/other-repo'
    permissions:
      issues: write
```

## How It Works

1. **Label Definition**: Labels are defined in JSON files in this directory
2. **CI Build**: GitHub Actions builds a consolidated `.github/labels.json` from these sources
3. **Idempotent Operations**: If a label already exists, it skips creation without failing
4. **Error Handling**: Distinguishes between "already exists" errors and actual failures
5. **Flexible Targeting**: Can update the current repo or any specified repository

## Workflow Template (`update-labels-template.yml`)

A template workflow file is provided for easy adoption. Copy and customize it for your repository's needs.

## Customization

### Adding Repository-Specific Labels

In your repository's workflow file, add custom labels:

```yaml
custom_labels: |
  [
    {
      "name": "project/phase1",
      "color": "ff0000",
      "description": "Phase 1 implementation"
    }
  ]
```

### Disabling Common Scopes

If your repository doesn't need the default common scopes:

```yaml
disable_common_scopes: true
```

### Enabling Optional Scopes

Select which optional scopes to include:

```yaml
additional_scopes: |
  scope/db
  scope/auth
  scope/monitoring
  scope/deployment
  lifecycle/experimental
  lifecycle/beta
```

## Label Replacement

The system can automatically replace old labels with new standardized ones. The `replaces` field in label definitions handles this:

```json
{
  "name": "type/bug",
  "color": "d73a49",
  "description": "Something isn't working",
  "replaces": ["bug"]
}
```

This will rename any existing "bug" label to "type/bug" while preserving issue associations.

## Permissions Required

- **issues: write** - Required to create and manage labels
- If updating a different repository, the workflow's GitHub token must have access to that repository

## Benefits

- **Consistency**: Ensures all repositories have the same label structure
- **Centralized Management**: Update label definitions in one place
- **Automation**: No manual label creation needed for new repositories
- **Flexibility**: Repositories can add their own specific labels
- **Safety**: Won't fail if labels already exist
- **Evolution**: Can rename/replace old labels automatically

## Troubleshooting

### Labels not being created

- Check that the workflow has `issues: write` permission
- Verify the repository name format is correct (`owner/repo`)
- Ensure the GitHub token has access to the target repository

### Workflow not found

- Make sure you're referencing the correct path: `outfitter-dev/.github/.github/workflows/labels.yml@main`
- Verify the workflow file exists and is on the main branch

### Permission denied

- For cross-repository updates, you may need to use a Personal Access Token (PAT) with appropriate permissions
- Ensure the calling workflow includes `permissions: issues: write`

## Making Changes

To modify the label system:

1. Edit the appropriate JSON file in this directory:

   - `core.json` - Core labels and common scopes (always included)
   - `scopes-optional.json` - Optional scopes and labels

2. The CI workflow will automatically rebuild `.github/labels.json`

3. Repositories using the label system will get updates on their next workflow run

**Note**: While you can directly edit `.github/labels.json` for emergency patches, changes should be made to the source files in this directory for maintainability.
