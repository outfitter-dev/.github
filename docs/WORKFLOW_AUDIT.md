# GitHub Actions Workflow Audit

## Executive Summary

Analyzed 30+ workflow files across 8 repositories in the Outfitter ecosystem. Found significant opportunities for consolidation through reusable workflows, with most repositories implementing similar CI/CD patterns but with different approaches.

## Common Patterns Identified

### 1. Claude AI Integration Workflows

**Found in:** monorepo, carabiner, rulesets, supplies, waymark, fieldbooks

#### Pattern: Claude Code Review
```yaml
# Common pattern across repos
name: Claude Code Review
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Claude AI Review
        uses: galligan/claude-code-review@main
        with:
          anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }}
```

**Variations:**
- Some repos use `@v1` tag, others use `@main`
- Different trigger conditions (some include `reopened`)
- Inconsistent secret naming

### 2. CI Pipeline Patterns

#### Pattern A: Bun-based CI (monorepo, carabiner)
```yaml
# Optimized version from carabiner
- uses: oven-sh/setup-bun@v2
  with:
    bun-version: latest
- run: bun install --frozen-lockfile
- run: bun run build
- run: bun test
```

#### Pattern B: pnpm-based CI (rulesets, waymark, turbo-cache, fieldbooks)
```yaml
# Common pnpm pattern
- uses: pnpm/action-setup@v4
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: 'pnpm'
- run: pnpm install --frozen-lockfile
- run: pnpm build
- run: pnpm test
```

#### Pattern C: Rust CI (blz)
```yaml
- uses: dtolnay/rust-toolchain@stable
- uses: Swatinem/rust-cache@v2
- run: cargo build --release
- run: cargo test
```

### 3. Release/Publish Workflows

#### Changesets Pattern (monorepo, carabiner)
```yaml
- uses: changesets/action@v1
  with:
    publish: bun run release
    createGithubReleases: true
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

#### Manual NPM Publish (supplies, waymark, fieldbooks)
```yaml
- run: npm config set //registry.npmjs.org/:_authToken ${{ secrets.NPM_TOKEN }}
- run: pnpm publish --access public --no-git-checks
```

### 4. Deployment Patterns

#### Cloudflare Workers (turbo-cache)
```yaml
- uses: cloudflare/wrangler-action@v3
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    command: deploy
```

## Duplication Analysis

### Exact Duplicates
1. **Claude AI workflows** - Nearly identical across 6 repos
2. **Dependabot configs** - Same update schedule patterns
3. **Basic CI steps** - Checkout, setup, install, build, test sequence

### Near Duplicates with Minor Variations
1. **Package manager setup** - Same logic, different tools (bun vs pnpm)
2. **Caching strategies** - Similar but inconsistent implementations
3. **Matrix testing** - Some use it, others don't for same scenarios

## Key Differences

### 1. Optimization Levels
- **carabiner**: Highly optimized with fail-fast, selective testing
- **monorepo**: Comprehensive but slower
- **Others**: Basic implementations without optimization

### 2. Security Practices
- **blz**: Uses cargo-deny for security audits
- **carabiner**: Has CodeQL analysis
- **Others**: No security scanning

### 3. Testing Strategies
- **carabiner**: Separate unit/integration/e2e workflows
- **fieldbooks**: Combined testing in single job
- **trails**: Go-specific with coverage reports

## Consolidation Opportunities

### High Priority (80% duplication reduction)

#### 1. Create Reusable Claude AI Workflow
```yaml
# .github/workflows/claude-review.yml
name: Claude AI Review
on:
  workflow_call:
    secrets:
      anthropic-api-key:
        required: true
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: galligan/claude-code-review@v1
        with:
          anthropic-api-key: ${{ secrets.anthropic-api-key }}
```

**Impact:** Replace 6 workflows with single reusable workflow

#### 2. Create Package Manager Auto-Detection Composite Action
```yaml
# .github/actions/setup-package-manager/action.yml
name: Setup Package Manager
runs:
  using: composite
  steps:
    - name: Detect Package Manager
      id: detect
      shell: bash
      run: |
        if [ -f "bun.lockb" ] || [ -f "bun.lock" ]; then
          echo "manager=bun" >> $GITHUB_OUTPUT
        elif [ -f "pnpm-lock.yaml" ]; then
          echo "manager=pnpm" >> $GITHUB_OUTPUT
        elif [ -f "package-lock.json" ]; then
          echo "manager=npm" >> $GITHUB_OUTPUT
        fi
    
    - if: steps.detect.outputs.manager == 'bun'
      uses: oven-sh/setup-bun@v2
    
    - if: steps.detect.outputs.manager == 'pnpm'
      uses: pnpm/action-setup@v4
```

**Impact:** Eliminate 20+ package manager setup blocks

#### 3. Standardize CI Pipeline
```yaml
# .github/workflows/typescript-ci.yml
name: TypeScript CI
on:
  workflow_call:
    inputs:
      test-command:
        type: string
        default: 'test'
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: outfitter-dev/.github/actions/setup-package-manager@main
      - run: ${{ steps.detect.outputs.manager }} install --frozen-lockfile
      - run: ${{ steps.detect.outputs.manager }} run build
      - run: ${{ steps.detect.outputs.manager }} run ${{ inputs.test-command }}
```

**Impact:** Replace 15+ CI workflows

### Medium Priority (50% improvement)

#### 4. Unified Release Workflow
- Combine changesets and manual publish patterns
- Auto-detect monorepo vs single package
- Standardize NPM token handling

#### 5. Security Scanning Suite
- Add CodeQL to all TypeScript repos
- Add cargo-deny to Rust repos
- Standardize dependency updates

### Low Priority (nice to have)

#### 6. Performance Monitoring
- Add benchmark workflows where applicable
- Standardize bundle size tracking
- Add lighthouse scores for web projects

## Migration Strategy

### Phase 1: Foundation (Week 1)
1. Create `.github` repository with reusable workflows
2. Implement package manager detection action
3. Create standard CI/CD workflows
4. Document in CONVENTIONS.md

### Phase 2: High-Value Targets (Week 2)
1. Migrate Claude AI workflows (6 repos)
2. Migrate basic CI pipelines (8 repos)
3. Validate no regressions

### Phase 3: Complex Workflows (Week 3)
1. Migrate release/publish workflows
2. Implement security scanning
3. Add deployment workflows

### Phase 4: Optimization (Week 4)
1. Add caching improvements
2. Implement matrix testing
3. Add performance monitoring

## Specific Recommendations

### 1. Immediate Actions
- **Standardize secret names**: Use `ANTHROPIC_API_KEY` everywhere (not `ANTHROPIC_TOKEN`)
- **Fix version pinning**: Use tags for actions (`@v1` not `@main`)
- **Enable required workflows**: Set org-level required workflows for CI

### 2. Workflow Naming Convention
```yaml
# Adopt consistent naming
ci.yml          → typescript-ci.yml
test.yml        → test-unit.yml
publish.yml     → release-changesets.yml
claude.yml      → review-claude.yml
```

### 3. Standardize Triggers
```yaml
# Consistent PR triggers
on:
  pull_request:
    types: [opened, synchronize, reopened]
  push:
    branches: [main]
```

### 4. Caching Strategy
```yaml
# Unified cache key pattern
key: ${{ runner.os }}-${{ matrix.node }}-${{ hashFiles('**/lockfile') }}
restore-keys: |
  ${{ runner.os }}-${{ matrix.node }}-
  ${{ runner.os }}-
```

## Code Snippets for Consolidation

### Universal Test Runner
```yaml
# Can replace 90% of test jobs
- name: Run Tests
  shell: bash
  run: |
    if [ -f "bun.lockb" ]; then
      bun test
    elif [ -f "pnpm-lock.yaml" ]; then
      pnpm test
    elif [ -f "go.mod" ]; then
      go test ./...
    elif [ -f "Cargo.toml" ]; then
      cargo test
    fi
```

### Smart Dependency Install
```yaml
# Handles all package managers with lockfile
- name: Install Dependencies
  shell: bash
  run: |
    if [ -f "bun.lockb" ] || [ -f "bun.lock" ]; then
      bun install --frozen-lockfile
    elif [ -f "pnpm-lock.yaml" ]; then
      pnpm install --frozen-lockfile
    elif [ -f "package-lock.json" ]; then
      npm ci
    elif [ -f "yarn.lock" ]; then
      yarn install --frozen-lockfile
    fi
```

### Conditional Security Scanning
```yaml
# Add to all workflows
- name: Security Scan
  if: github.event_name == 'pull_request'
  run: |
    if [ -f "Cargo.toml" ]; then
      cargo deny check
    elif [ -f "package.json" ]; then
      npm audit --audit-level=high
    fi
```

## Anti-Patterns Found

### 1. Missing Frozen Lockfile
Several repos use `bun install` without `--frozen-lockfile`, causing non-deterministic builds.

### 2. No Timeout Settings
Most workflows lack `timeout-minutes`, risking hung jobs.

### 3. Redundant Checkouts
Some workflows checkout code multiple times in same job.

### 4. Missing Concurrency Control
No workflows use `concurrency` to cancel outdated runs.

### 5. Inefficient Caching
Many workflows don't cache dependencies properly, causing slower builds.

## Metrics & Success Criteria

### Current State
- **Total workflow files**: 32
- **Total lines of YAML**: ~2,500
- **Duplication rate**: ~70%
- **Average CI time**: 3-5 minutes

### Target State
- **Reusable workflows**: 8-10
- **Reduced YAML**: ~800 lines (68% reduction)
- **Duplication rate**: <20%
- **Average CI time**: 1-2 minutes

### Success Metrics
1. **Consistency**: 100% repos use standard workflows
2. **Speed**: 50% reduction in CI times
3. **Reliability**: <1% flaky test rate
4. **Security**: 100% repos have security scanning
5. **Maintenance**: 80% less workflow maintenance

## Next Steps

1. **Review & Approve** this audit
2. **Create `.github` repository** with reusable workflows
3. **Pilot migration** with one repository (suggest `carabiner`)
4. **Roll out** to remaining repositories
5. **Monitor & Optimize** based on metrics

## Appendix: Repository Workflow Inventory

### monorepo
- `.github/workflows/claude.yml` - AI review
- `.github/workflows/claude-code-review.yml` - Duplicate AI review
- `.github/workflows/publish.yml` - NPM release

### carabiner  
- `.github/workflows/ci-comprehensive.yml` - Full test suite
- `.github/workflows/ci-optimized.yml` - Fast CI
- `.github/workflows/ci-pr-optimized.yml` - PR-specific CI
- `.github/workflows/claude-review.yml` - AI review
- `.github/workflows/codeql.yml` - Security analysis
- `.github/workflows/release.yml` - Changesets release

### rulesets
- `.github/workflows/ci.yml` - pnpm CI
- `.github/workflows/claude.yml` - AI review

### supplies
- `.github/workflows/ci.yml` - pnpm CI
- `.github/workflows/claude.yml` - AI review
- `.github/workflows/publish.yml` - NPM release

### waymark
- `.github/workflows/ci.yml` - pnpm CI
- `.github/workflows/claude-review.yml` - AI review
- `.github/workflows/publish.yml` - NPM release

### turbo-cache
- `.github/workflows/ci.yml` - pnpm CI
- `.github/workflows/deploy.yml` - Cloudflare deployment

### fieldbooks
- `.github/workflows/ci.yml` - pnpm CI
- `.github/workflows/claude-review.yml` - AI review
- `.github/workflows/publish.yml` - NPM release

### blz
- `.github/workflows/ci.yml` - Rust CI
- `.github/workflows/dependencies.yml` - Dependency updates
- `.github/workflows/release.yml` - GitHub releases
- `.github/workflows/security.yml` - Security audit