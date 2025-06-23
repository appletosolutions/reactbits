# 🤖 Automated NPM Publishing & Version Control Setup

This guide explains how to set up automated version control, changelog generation, and NPM publishing for ReactBits.

## 🎯 What This Automation Does

### ✅ **Automated Workflow**
1. **Commit with conventional format** → Triggers version bump
2. **Automated testing** → Ensures code quality
3. **Changelog generation** → Updates CHANGELOG.md automatically
4. **Version bumping** → Updates package.json and package-lock.json
5. **Git tagging** → Creates release tags
6. **NPM publishing** → Publishes to NPM registry
7. **GitHub releases** → Creates GitHub releases with notes

### 🔄 **Continuous Integration**
- Tests on multiple Node.js versions (16, 18, 20)
- Bundle size monitoring
- Security vulnerability scanning
- TypeScript type checking
- React compatibility testing

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
# Install automation dependencies
npm install --save-dev @commitlint/cli @commitlint/config-conventional husky lint-staged standard-version

# Initialize Husky (Git hooks)
npx husky install
```

### 2. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

**Required Secrets:**
- `NPM_TOKEN` - Your NPM authentication token
- `GITHUB_TOKEN` - Automatically provided by GitHub

**How to get NPM_TOKEN:**
```bash
# Login to NPM
npm login

# Generate access token
npm token create --read-only=false
```

Copy the token and add it as `NPM_TOKEN` in GitHub secrets.

### 3. Set File Permissions

```bash
# Make scripts executable
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
chmod +x scripts/release.js
```

### 4. Configure Git

```bash
# Set up Git user (if not already done)
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## 📝 How to Use

### **Conventional Commits**

Use conventional commit format for automatic version bumping:

```bash
# Patch version (1.0.0 → 1.0.1)
git commit -m "fix: resolve animation timing issue"
git commit -m "perf: optimize canvas rendering"

# Minor version (1.0.0 → 1.1.0)  
git commit -m "feat: add new particle animation component"
git commit -m "feat(text): add scramble text animation"

# Major version (1.0.0 → 2.0.0)
git commit -m "feat!: redesign API for better performance"
git commit -m "feat: remove deprecated components

BREAKING CHANGE: Removed old animation components"
```

### **Commit Types**

| Type | Description | Version Bump |
|------|-------------|--------------|
| `feat` | New feature | Minor |
| `fix` | Bug fix | Patch |
| `perf` | Performance improvement | Patch |
| `refactor` | Code refactoring | Patch |
| `docs` | Documentation | Patch |
| `style` | Code style changes | Patch |
| `test` | Tests | Patch |
| `build` | Build system | Patch |
| `ci` | CI/CD changes | Patch |
| `chore` | Maintenance | No bump |

### **Release Process**

#### **Automatic Release (Recommended)**
Just push to main branch with conventional commits:

```bash
git add .
git commit -m "feat: add new 3D animation component"
git push origin main
```

The GitHub Action will automatically:
- Run tests
- Generate changelog
- Bump version
- Create git tag
- Publish to NPM
- Create GitHub release

#### **Manual Release**
If you prefer manual control:

```bash
# Dry run to see what would happen
npm run release:dry

# Create patch release
npm run release:patch

# Create minor release  
npm run release:minor

# Create major release
npm run release:major
```

#### **Local Release Script**
For complete local control:

```bash
# Run the full release process locally
npm run release
```

This will:
1. Check git status and branch
2. Run tests and build
3. Generate changelog
4. Commit, tag, and push
5. Publish to NPM

## 🔍 Monitoring & Debugging

### **Check Workflow Status**
- Go to GitHub → Actions tab
- Monitor release workflow progress
- Check for any failures

### **Common Issues**

**❌ NPM_TOKEN Invalid**
```
Error: 401 Unauthorized
```
**Solution:** Regenerate NPM token and update GitHub secret

**❌ Tests Failing**
```
Error: Tests failed
```
**Solution:** Fix failing tests before pushing

**❌ Bundle Too Large**
```
Error: Bundle size exceeds maximum
```
**Solution:** Optimize bundle size or adjust threshold in CI

**❌ Conventional Commit Format**
```
Error: Commit message doesn't follow conventional format
```
**Solution:** Use proper commit format (see examples above)

### **Debug Commands**

```bash
# Check current version
npm version

# View recent commits
git log --oneline -10

# Check NPM login status
npm whoami

# Test build locally
npm run build

# Run tests locally
npm test

# Check bundle size
ls -lh dist/
```

## 📊 Workflow Files

### **`.github/workflows/release.yml`**
- Automated release workflow
- Runs on push to main branch
- Handles testing, building, and publishing

### **`.github/workflows/ci.yml`**
- Continuous integration
- Runs on all branches and PRs
- Multi-version testing and security checks

### **Configuration Files**
- `.versionrc.json` - Standard-version configuration
- `.commitlintrc.json` - Commit message linting
- `.husky/` - Git hooks configuration

## 🎯 Best Practices

### **Commit Messages**
```bash
# ✅ Good
git commit -m "feat(text): add blur animation component"
git commit -m "fix: resolve memory leak in particle system"
git commit -m "docs: update installation instructions"

# ❌ Bad
git commit -m "added stuff"
git commit -m "fix bug"
git commit -m "update"
```

### **Release Strategy**
- **Patch releases** (1.0.x) - Bug fixes, small improvements
- **Minor releases** (1.x.0) - New features, non-breaking changes
- **Major releases** (x.0.0) - Breaking changes, API redesigns

### **Branch Protection**
Consider enabling branch protection rules:
- Require status checks to pass
- Require up-to-date branches
- Require review from code owners

## 🚀 Next Steps

1. **Test the setup** with a small commit
2. **Monitor first automated release**
3. **Adjust configuration** as needed
4. **Document any custom workflows**
5. **Train team members** on conventional commits

## 📞 Support

If you encounter issues:
1. Check GitHub Actions logs
2. Verify all secrets are set correctly
3. Ensure file permissions are correct
4. Test commands locally first

The automation is designed to be robust and handle most scenarios automatically. Happy releasing! 🎉
