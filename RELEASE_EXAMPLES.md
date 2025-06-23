# 🚀 Release Examples & Workflows

This document shows practical examples of how to use the automated release system for ReactBits.

## 📝 Conventional Commit Examples

### **Feature Releases (Minor Version Bump)**

```bash
# Adding new components
git commit -m "feat: add liquid chrome background animation"
git commit -m "feat(text): add typewriter effect component"
git commit -m "feat(3d): add interactive sphere component"

# Adding new features to existing components
git commit -m "feat(click-spark): add custom easing options"
git commit -m "feat: add dark mode support to all components"
```

### **Bug Fixes (Patch Version Bump)**

```bash
# Fixing bugs
git commit -m "fix: resolve memory leak in particle system"
git commit -m "fix(aurora): correct color interpolation on Safari"
git commit -m "fix: prevent infinite loop in scroll animations"

# Performance improvements
git commit -m "perf: optimize canvas rendering for mobile devices"
git commit -m "perf(webgl): reduce shader compilation time"
```

### **Breaking Changes (Major Version Bump)**

```bash
# API changes
git commit -m "feat!: redesign animation API for better performance

BREAKING CHANGE: All animation components now use a unified props interface.
Migration guide available in MIGRATION.md"

# Removing deprecated features
git commit -m "feat: remove deprecated bounce animation

BREAKING CHANGE: The old Bounce component has been removed.
Use the new BounceEffect component instead."
```

### **Documentation & Maintenance**

```bash
# Documentation updates (patch bump)
git commit -m "docs: add examples for 3D components"
git commit -m "docs: update installation instructions"

# Code style and refactoring (patch bump)
git commit -m "style: format code with prettier"
git commit -m "refactor: extract common animation utilities"

# Tests (patch bump)
git commit -m "test: add unit tests for text animations"
git commit -m "test: improve coverage for WebGL components"

# Build and CI changes (patch bump)
git commit -m "build: update rollup configuration"
git commit -m "ci: add bundle size monitoring"

# Maintenance (no version bump)
git commit -m "chore: update dependencies"
git commit -m "chore: clean up unused files"
```

## 🔄 Release Workflows

### **Workflow 1: Automatic Release (Recommended)**

This is the simplest workflow - just push to main with conventional commits:

```bash
# 1. Make your changes
# ... edit files ...

# 2. Commit with conventional format
git add .
git commit -m "feat: add new particle trail animation"

# 3. Push to main branch
git push origin main

# 4. GitHub Actions automatically:
#    - Runs tests
#    - Bumps version (1.2.0 → 1.3.0)
#    - Generates changelog
#    - Creates git tag (v1.3.0)
#    - Publishes to NPM
#    - Creates GitHub release
```

### **Workflow 2: Batch Multiple Changes**

When you have multiple related changes:

```bash
# 1. Make multiple commits
git commit -m "feat: add glow effect component"
git commit -m "feat: add pulse animation component"
git commit -m "docs: update component showcase"
git commit -m "test: add tests for new components"

# 2. Push all at once
git push origin main

# Result: Single release with all changes (1.2.0 → 1.3.0)
```

### **Workflow 3: Manual Release Control**

For more control over the release process:

```bash
# 1. Make changes and commit
git commit -m "feat: add new animation components"

# 2. Preview what the release would look like
npm run release:dry

# 3. Create the release manually
npm run release:minor  # or release:patch, release:major

# 4. The script handles everything automatically
```

### **Workflow 4: Hotfix Release**

For urgent bug fixes:

```bash
# 1. Create hotfix branch (optional)
git checkout -b hotfix/memory-leak

# 2. Fix the issue
git commit -m "fix: resolve critical memory leak in particle system"

# 3. Merge to main
git checkout main
git merge hotfix/memory-leak

# 4. Push to trigger release
git push origin main

# Result: Patch release (1.2.3 → 1.2.4)
```

## 📊 Version Bump Examples

### **Starting Version: 1.2.3**

| Commit Type | Example | New Version |
|-------------|---------|-------------|
| `fix:` | `fix: resolve animation timing` | 1.2.4 |
| `perf:` | `perf: optimize rendering` | 1.2.4 |
| `feat:` | `feat: add new component` | 1.3.0 |
| `feat!:` | `feat!: redesign API` | 2.0.0 |
| `docs:` | `docs: update readme` | 1.2.4 |
| `chore:` | `chore: update deps` | No bump |

## 🎯 Real-World Scenarios

### **Scenario 1: New Component Release**

```bash
# Week 1: Development
git commit -m "feat: add liquid metal animation component"
git commit -m "test: add tests for liquid metal component"
git commit -m "docs: add liquid metal examples"

# Push when ready
git push origin main
# → Version 1.5.0 released automatically
```

### **Scenario 2: Bug Fix Release**

```bash
# Critical bug discovered
git commit -m "fix: prevent crash on mobile Safari"
git push origin main
# → Version 1.5.1 released automatically
```

### **Scenario 3: Major API Redesign**

```bash
# Breaking changes
git commit -m "feat!: redesign animation props API

BREAKING CHANGE: All components now use consistent prop names.
- duration → animationDuration  
- delay → animationDelay
- easing → animationEasing

See MIGRATION.md for full migration guide."

git push origin main
# → Version 2.0.0 released automatically
```

### **Scenario 4: Multiple Features**

```bash
# Sprint completion with multiple features
git commit -m "feat: add 5 new text animation components"
git commit -m "feat: add WebGL particle system"
git commit -m "feat: add 3D model viewer enhancements"
git commit -m "perf: optimize bundle size by 20%"
git commit -m "docs: comprehensive API documentation update"

git push origin main
# → Version 1.6.0 released with all features
```

## 🔍 Monitoring Releases

### **Check Release Status**

```bash
# View recent releases
git tag --sort=-version:refname | head -5

# Check current version
npm version

# View changelog
cat CHANGELOG.md | head -50
```

### **GitHub Actions Monitoring**

1. Go to GitHub → Actions tab
2. Monitor "Release and Publish" workflow
3. Check for any failures or warnings
4. View detailed logs if needed

### **NPM Package Verification**

```bash
# Check if package was published
npm view @appletosolutions/reactbits version

# View package info
npm view @appletosolutions/reactbits

# Test installation
npm install @appletosolutions/reactbits@latest
```

## 🚨 Troubleshooting

### **Release Failed**

```bash
# Check workflow logs in GitHub Actions
# Common issues:
# 1. Tests failed → Fix tests and push again
# 2. NPM token expired → Update GitHub secret
# 3. Version conflict → Manual intervention needed
```

### **Wrong Version Bump**

```bash
# If wrong version was released, create corrective release
git commit -m "chore: correct version numbering"
# Then manually adjust version if needed
```

### **Missing Changelog Entry**

```bash
# Regenerate changelog
npm run changelog
git add CHANGELOG.md
git commit -m "docs: update changelog"
git push origin main
```

## 💡 Best Practices

### **Commit Message Tips**

```bash
# ✅ Good - Clear and specific
git commit -m "feat(text): add scramble animation with custom charset"
git commit -m "fix(webgl): resolve shader compilation on older GPUs"

# ❌ Bad - Vague and unclear  
git commit -m "add stuff"
git commit -m "fix bug"
```

### **Release Timing**

- **Patch releases**: Anytime (bug fixes)
- **Minor releases**: Weekly/bi-weekly (new features)
- **Major releases**: Monthly/quarterly (breaking changes)

### **Testing Before Release**

```bash
# Always test locally before pushing
npm test
npm run build
npm run lint

# Test in example project
cd ../test-project
npm install ../reactbits
# Test components work correctly
```

This automation system ensures consistent, reliable releases while maintaining high code quality! 🎉
