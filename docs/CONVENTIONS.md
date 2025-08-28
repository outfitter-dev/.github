# GitHub Actions & CI/CD Conventions

## Overview

This document defines conventions and best practices for GitHub Actions workflows, reusable components, and CI/CD patterns across the Outfitter organization.

## Repository Structure

```
outfitter-dev/
├── .github/                    # Organization defaults (PUBLIC)
│   ├── .github/
│   │   ├── ISSUE_TEMPLATE/     # Default issue templates
│   │   ├── PULL_REQUEST_TEMPLATE/  # Default PR templates
│   │   └── SECURITY.md         # Security policy
│   ├── workflow-templates/     # Workflow starter templates
│   └── CONVENTIONS.md          # This document
│
├── ci-commons/                 # Shared CI/CD (PRIVATE, org-accessible)
│   ├── .github/
│   │   ├── workflows/         # Reusable workflows (on: workflow_call)
│   │   └── actions/           # Composite actions
│   └── scripts/               # Shared shell/Node scripts
│
└── [project repos]            # Your actual project repositories
```

## Naming Conventions

### Workflow Files

```yaml
# Reusable workflows (ci-commons)
<stack>-<purpose>.yml
# Examples:
bun-ci.yml          # Bun project CI
pnpm-ci.yml         # pnpm project CI
rust-ci.yml         # Rust project CI
go-ci.yml           # Go project CI
deploy-cloudflare.yml
deploy-vercel.yml

# Project workflows (in each repo)
<trigger>-<purpose>.yml
# Examples:
pr-validation.yml   # Runs on pull_request
push-main.yml       # Runs on push to main
release-publish.yml # Runs on release
daily-security.yml  # Scheduled security scan
```

### Composite Actions Naming

```yaml
setup-<tool>/action.yml        # Tool installation
cache-<type>/action.yml        # Caching strategies
check-<validation>/action.yml  # Validation checks

# Examples:
setup-bun/action.yml
setup-turbo/action.yml
cache-dependencies/action.yml
check-typescript/action.yml
```

### Workflow Inputs/Outputs
Use kebab-case for all inputs, outputs, and secrets:

```yaml
inputs:
  bun-version:        # NOT bunVersion or bun_version
  skip-tests:         # NOT skipTests
  deploy-environment: # NOT deployEnvironment
```

## Reusable Workflows

### Standard Structure for Workflows
Every reusable workflow should follow this pattern:

```yaml
name: Descriptive Name
description: What this workflow does and when to use it

on:
  workflow_call:
inputs:
# Required inputs first
working-directory:
  description: Directory containing package.json
  type: string
  required: true

# Optional inputs with defaults
bun-version:
  description: Bun version to use
  type: string
  default: 'latest'

skip-tests:
  description: Skip test execution
  type: boolean
  default: false

outputs:
# Useful outputs for caller workflows
version:
  description: Version that was built/deployed
  value: ${{ jobs.build.outputs.version }}

secrets:
# Only declare secrets actually used
npm-token:
  description: NPM registry auth token
  required: false

jobs:
  build:
name: Build
runs-on: ubuntu-latest
outputs:
version: ${{ steps.version.outputs.version }}

steps:
- uses: actions/checkout@v4

- uses: outfitter-dev/ci-commons/.github/actions/setup-bun@v1
  with:
bun-version: ${{ inputs.bun-version }}

# ... rest of workflow
```

### Input Validation
Always validate inputs at the start of jobs:

```yaml
- name: Validate inputs
  run: |
if [[ ! -d "${{ inputs.working-directory }}" ]]; then
echo "::error::Working directory does not exist: ${{ inputs.working-directory }}"
exit 1
fi
```

## Composite Actions

### Standard Structure for Actions

```yaml
name: Setup Bun
description: Install Bun with caching
author: outfitter-dev

inputs:
  bun-version:
description: Version of Bun to install
default: 'latest'

outputs:
  cache-hit:
description: Whether cache was restored
value: ${{ steps.cache.outputs.cache-hit }}

runs:
  using: composite
  steps:
- name: Setup Bun
uses: oven-sh/setup-bun@v2
with:
  bun-version: ${{ inputs.bun-version }}

- name: Cache dependencies
id: cache
uses: actions/cache@v4
with:
  path: ~/.bun/install/cache
  key: ${{ runner.os }}-bun-${{ hashFiles('**/bun.lockb', '**/bun.lock') }}
  restore-keys: |
${{ runner.os }}-bun-
```

## Versioning Strategy

### Semantic Versioning
All reusable workflows and actions use semantic versioning:

```bash
v1.0.0  # Initial stable release
v1.0.1  # Patch: Bug fixes, no breaking changes
v1.1.0  # Minor: New features, backwards compatible
v2.0.0  # Major: Breaking changes
```

### Calling Versioned Components

```yaml
# ✅ Good - Pin to major version for stability + updates
- uses: outfitter-dev/ci-commons/.github/workflows/bun-ci.yml@v1
- uses: outfitter-dev/ci-commons/.github/actions/setup-bun@v1

# ⚠️ Risky - Follows main branch
- uses: outfitter-dev/ci-commons/.github/workflows/bun-ci.yml@main

# 🔒 Paranoid - Pin to exact version or commit
- uses: outfitter-dev/ci-commons/.github/workflows/bun-ci.yml@v1.2.3
- uses: outfitter-dev/ci-commons/.github/workflows/bun-ci.yml@abc123f
```

## Caching Strategies

### Dependency Caching Priority

1. **Package manager cache** (fastest)
2. **node_modules/.pnpm/.yarn** (fallback)
3. **Build outputs** (when appropriate)

### Cache Key Patterns

```yaml
# Bun projects
key: ${{ runner.os }}-bun-${{ hashFiles('**/bun.lockb', '**/bun.lock') }}

# pnpm projects
key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}

# Rust projects
key: ${{ runner.os }}-cargo-${{ hashFiles('**/Cargo.lock') }}

# Go projects
key: ${{ runner.os }}-go-${{ hashFiles('**/go.sum') }}

# Turbo build cache
key: ${{ runner.os }}-turbo-${{ github.sha }}
restore-keys: |
  ${{ runner.os }}-turbo-
```

### Cache Paths by Package Manager

```yaml
# Bun
path: |
  ~/.bun/install/cache
  node_modules

# pnpm
path: |
  ~/.pnpm-store
  node_modules/.pnpm

# Cargo
path: |
  ~/.cargo/registry
  ~/.cargo/git
  target

# Go
path: |
  ~/go/pkg/mod
  ~/.cache/go-build
```

## Security Best Practices

### Permissions
Always use least-privilege permissions:

```yaml
# Default to read-only
permissions:
  contents: read

jobs:
  deploy:
# Elevate only where needed
permissions:
contents: read
deployments: write
id-token: write  # For OIDC
```

### Secret Management

```yaml
# ✅ Good - Pass only needed secrets
jobs:
  deploy:
uses: ./.github/workflows/deploy.yml@v1
secrets:
deploy-token: ${{ secrets.CLOUDFLARE_API_TOKEN }}

# ❌ Bad - Pass all secrets
jobs:
  deploy:
uses: ./.github/workflows/deploy.yml@v1
secrets: inherit  # Only for same-org private repos
```

### Dependency Verification

```yaml
# Always use exact versions for third-party actions
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11  # v4.1.1

# Run security audits (don't fail on warnings)
- run: |
bun audit || true
pnpm audit || true
cargo audit || true
```

## Matrix Strategies

### OS Coverage

```yaml
strategy:
  matrix:
os: [ubuntu-latest, macos-latest]
# Add windows-latest only if explicitly supported
```

### Version Testing

```yaml
strategy:
  matrix:
bun-version: ['latest', '1.1.0']  # Current + minimum supported
node-version: ['20', '22']        # LTS versions only
```

### Conditional Matrix

```yaml
strategy:
  matrix:
include:
- os: ubuntu-latest
  bun-version: latest
  run-deploy: true
- os: macos-latest
  bun-version: latest
  run-deploy: false
```

## Performance Optimizations

### Parallelization

```yaml
# Run independent checks in parallel
jobs:
  lint:
runs-on: ubuntu-latest
# ...
  
  typecheck:
runs-on: ubuntu-latest
# ...
  
  test:
runs-on: ubuntu-latest
# ...
  
  # Gate on all checks
  validate:
needs: [lint, typecheck, test]
runs-on: ubuntu-latest
steps:
- run: echo "All checks passed"
```

### Early Exit

```yaml
# Fail fast on first error
strategy:
  fail-fast: true
  matrix:
# ...

# Cancel in-progress runs on new push
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

### Conditional Steps

```yaml
# Skip expensive steps when possible
- name: Deploy
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  run: ./deploy.sh
```

## Package Manager Detection

### Auto-Detection Pattern

```yaml
- name: Detect package manager
  id: detect-pm
  shell: bash
  run: |
if [ -f "bun.lockb" ] || [ -f "bun.lock" ]; then
echo "manager=bun" >> $GITHUB_OUTPUT
echo "lockfile=bun.lock*" >> $GITHUB_OUTPUT
elif [ -f "pnpm-lock.yaml" ]; then
echo "manager=pnpm" >> $GITHUB_OUTPUT
echo "lockfile=pnpm-lock.yaml" >> $GITHUB_OUTPUT
elif [ -f "yarn.lock" ]; then
echo "manager=yarn" >> $GITHUB_OUTPUT
echo "lockfile=yarn.lock" >> $GITHUB_OUTPUT
elif [ -f "package-lock.json" ]; then
echo "manager=npm" >> $GITHUB_OUTPUT
echo "lockfile=package-lock.json" >> $GITHUB_OUTPUT
else
echo "::error::No lockfile found"
exit 1
fi

- name: Install dependencies
  run: ${{ steps.detect-pm.outputs.manager }} install --frozen-lockfile
```

## Error Handling

### Informative Errors

```yaml
- name: Build
  id: build
  run: bun run build
  continue-on-error: true

- name: Report build failure
  if: steps.build.outcome == 'failure'
  run: |
echo "::error title=Build Failed::Check the build logs for TypeScript or bundling errors"
echo "::notice::Common issues: missing dependencies, type errors, circular imports"
exit 1
```

### Retry Logic

```yaml
- name: Deploy with retry
  uses: nick-fields/retry@v3
  with:
timeout_minutes: 10
max_attempts: 3
retry_wait_seconds: 30
command: ./deploy.sh
```

## Deployment Patterns

### Environment-Based Deployment

```yaml
on:
  workflow_call:
inputs:
environment:
  type: string
  required: true

jobs:
  deploy:
runs-on: ubuntu-latest
environment:
name: ${{ inputs.environment }}
url: ${{ steps.deploy.outputs.url }}

steps:
- name: Deploy
  id: deploy
  run: |
if [[ "${{ inputs.environment }}" == "production" ]]; then
  ./deploy-prod.sh
else
  ./deploy-preview.sh
fi
```

### OIDC Authentication (Cloudflare/AWS)

```yaml
permissions:
  id-token: write
  contents: read

steps:
  - name: Configure AWS credentials
uses: aws-actions/configure-aws-credentials@v4
with:
role-to-assume: arn:aws:iam::123456789:role/github-actions
aws-region: us-east-1
```

## Monorepo Patterns

### Turbo Integration

```yaml
- name: Run affected tasks
  run: |
# Get changed files
CHANGED=$(git diff --name-only ${{ github.event.before }} ${{ github.sha }})

# Run only affected packages
turbo run build test --filter=[HEAD^1]

# Or use Turbo's GitHub Actions integration
turbo run build test --filter="...[origin/main]"
```

### Workspace Filtering

```yaml
# pnpm workspaces
- run: pnpm --filter @outfitter/contracts build

# Bun workspaces
- run: bun run --filter='./packages/ui' test
```

## Graphite Integration

### Stack-Aware CI

```yaml
- name: Check if part of stack
  run: |
if gt log --json | jq '.current.has_parent'; then
echo "This PR is part of a stack"
# Run lighter checks, full validation on stack base
fi
```

## Debugging Workflows

### Enable Debug Logging
Set repository secrets:

- `ACTIONS_RUNNER_DEBUG`: `true`
- `ACTIONS_STEP_DEBUG`: `true`

### Useful Debug Steps

```yaml
- name: Debug context
  if: ${{ github.event_name == 'pull_request' }}
  run: |
echo "Event: ${{ github.event_name }}"
echo "Ref: ${{ github.ref }}"
echo "SHA: ${{ github.sha }}"
echo "Actor: ${{ github.actor }}"
echo "PR: ${{ github.event.pull_request.number }}"

- name: Debug environment
  run: |
node --version
bun --version
pwd
ls -la
env | sort
```

### SSH Debugging (Emergency)

```yaml
- name: Setup tmate session
  if: ${{ failure() && github.event_name == 'workflow_dispatch' }}
  uses: mxschmitt/action-tmate@v3
  timeout-minutes: 15
```

## Anti-Patterns to Avoid

### ❌ Don't Do This

```yaml
# Don't use latest for third-party actions
- uses: some/action@latest  # Unpinned, can break

# Don't hardcode secrets
- run: curl -H "Authorization: Bearer abc123"  # Exposed secret

# Don't skip lockfile
- run: bun install  # Missing --frozen-lockfile

# Don't ignore errors silently
- run: bun test || true  # Hides failures

# Don't use personal access tokens
  token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}  # Use GITHUB_TOKEN or OIDC

# Don't mix package managers
- run: |
npm install
bun run build  # Inconsistent
```

### ✅ Do This Instead

```yaml
# Pin to version or SHA
- uses: some/action@v1.2.3

# Use secrets properly
- run: curl -H "Authorization: Bearer ${{ secrets.API_TOKEN }}"

# Use frozen lockfile
- run: bun install --frozen-lockfile

# Handle errors explicitly
- run: bun test
  continue-on-error: true
  id: test
- if: steps.test.outcome == 'failure'
  run: echo "Tests failed but continuing"

# Use built-in token
  token: ${{ secrets.GITHUB_TOKEN }}

# Consistent package manager
- run: |
bun install --frozen-lockfile
bun run build
```

## Migration Guide

### From Copy-Paste to Reusable

1. **Identify common patterns** across your workflows
2. **Extract to reusable workflow** in ci-commons
3. **Version and tag** the reusable workflow
4. **Update repos** to call the reusable workflow
5. **Delete duplicate code** from individual repos

### Example Migration

Before (in each repo):

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
runs-on: ubuntu-latest
steps:
- uses: actions/checkout@v4
- run: curl -fsSL https://bun.sh/install | bash
- run: echo "$HOME/.bun/bin" >> $GITHUB_PATH
- run: bun install
- run: bun test
```

After (in each repo):

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
uses: outfitter-dev/ci-commons/.github/workflows/bun-ci.yml@v1
```

## Testing Workflows

### Local Testing with act

```bash
# Install act
brew install act  # or use GitHub CLI: gh act

# Test workflow locally
act push  # Simulate push event
act pull_request  # Simulate PR event
act -j test  # Run specific job
```

### Workflow Dispatch for Testing
Add to reusable workflows for manual testing:

```yaml
on:
  workflow_call:
# ... inputs/outputs
  workflow_dispatch:  # Allow manual trigger for testing
inputs:
# Same inputs as workflow_call
```

## Documentation Standards

### Workflow Documentation
Every reusable workflow must include:

```yaml
name: Clear Name
# Top-level comment explaining:
# - Purpose and when to use
# - Required setup/prerequisites  
# - Example usage
# - Outputs produced

# Example:
# This workflow runs CI checks for Bun-based TypeScript projects.
# Prerequisites: bun.lockb or bun.lock must exist
# Usage:
#   jobs:
#     ci:
#       uses: outfitter-dev/ci-commons/.github/workflows/bun-ci.yml@v1
#       with:
#         working-directory: ./packages/myapp
# Outputs: version, build-artifact-id
```

### Inline Documentation

```yaml
steps:
  # Group related steps with comments
  # === Setup Phase ===
  - uses: actions/checkout@v4
  
  # === Build Phase ===
  - name: Build application
run: bun run build

  # === Test Phase ===
  - name: Run tests
run: bun test
```

## Monitoring & Observability

### Workflow Annotations

```yaml
- name: Annotate results
  run: |
echo "::notice title=Deployment::Deployed to ${{ env.URL }}"
echo "::warning title=Performance::Build took longer than expected"
echo "::error title=Failed Check::Linting errors found"
```

### Status Badges
Add to README.md:

```markdown
![CI](https://github.com/outfitter-dev/monorepo/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/outfitter-dev/monorepo/actions/workflows/deploy.yml/badge.svg?branch=main)
```

## Review Checklist

Before creating/modifying workflows:

- [ ] Follows naming conventions
- [ ] Uses versioned reusable components where possible
- [ ] Includes appropriate caching
- [ ] Has least-privilege permissions
- [ ] Pins third-party action versions
- [ ] Handles errors explicitly
- [ ] Includes concurrency controls
- [ ] Documents purpose and usage
- [ ] Tested locally or via workflow_dispatch
- [ ] Considers cost (matrix size, runner type)

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Reusable Workflows](https://docs.github.com/en/actions/using-workflows/reusing-workflows)
- [Composite Actions](https://docs.github.com/en/actions/creating-actions/creating-a-composite-action)
- [OIDC Token Authentication](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments)
- [act - Local Testing](https://github.com/nektos/act)
- [Workflow Security](https://docs.github.com/en/actions/security-guides)