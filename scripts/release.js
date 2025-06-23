#!/usr/bin/env node

/**
 * Release script for ReactBits
 * Handles version bumping, changelog generation, and publishing
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    return execSync(command, { 
      stdio: 'inherit', 
      encoding: 'utf8',
      ...options 
    });
  } catch (error) {
    log(`❌ Command failed: ${command}`, 'red');
    process.exit(1);
  }
}

function checkGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      log('❌ Working directory is not clean. Please commit or stash changes.', 'red');
      process.exit(1);
    }
  } catch (error) {
    log('❌ Failed to check git status', 'red');
    process.exit(1);
  }
}

function getCurrentBranch() {
  try {
    return execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  } catch (error) {
    log('❌ Failed to get current branch', 'red');
    process.exit(1);
  }
}

function checkBranch() {
  const branch = getCurrentBranch();
  const allowedBranches = ['main', 'master'];
  
  if (!allowedBranches.includes(branch)) {
    log(`❌ Releases can only be made from main/master branch. Current: ${branch}`, 'red');
    process.exit(1);
  }
  
  log(`✅ On ${branch} branch`, 'green');
}

function runTests() {
  log('🧪 Running tests...', 'yellow');
  exec('npm test');
  log('✅ Tests passed', 'green');
}

function buildPackage() {
  log('🏗️ Building package...', 'yellow');
  exec('npm run build');
  log('✅ Build completed', 'green');
}

function checkPackageSize() {
  log('📦 Checking bundle size...', 'yellow');
  
  const distPath = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distPath)) {
    log('❌ Dist folder not found. Run build first.', 'red');
    process.exit(1);
  }
  
  const files = fs.readdirSync(distPath);
  let totalSize = 0;
  
  files.forEach(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    totalSize += stats.size;
    log(`  ${file}: ${(stats.size / 1024).toFixed(2)}KB`, 'cyan');
  });
  
  log(`📊 Total bundle size: ${(totalSize / 1024).toFixed(2)}KB`, 'blue');
  
  // Warn if bundle is too large
  const maxSize = 1024 * 1024; // 1MB
  if (totalSize > maxSize) {
    log(`⚠️ Bundle size (${(totalSize / 1024).toFixed(2)}KB) is quite large`, 'yellow');
  }
}

function generateChangelog() {
  log('📝 Generating changelog...', 'yellow');
  exec('npx standard-version --skip.commit --skip.tag');
  log('✅ Changelog generated', 'green');
}

function getNewVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return packageJson.version;
}

function commitAndTag() {
  const version = getNewVersion();
  log(`🏷️ Creating commit and tag for v${version}...`, 'yellow');
  
  exec('git add .');
  exec(`git commit -m "chore(release): ${version}"`);
  exec(`git tag "v${version}"`);
  
  log(`✅ Created commit and tag v${version}`, 'green');
}

function pushChanges() {
  log('🚀 Pushing changes...', 'yellow');
  exec('git push origin --follow-tags');
  log('✅ Changes pushed', 'green');
}

function publishToNpm() {
  log('📦 Publishing to NPM...', 'yellow');
  
  // Check if user is logged in
  try {
    exec('npm whoami', { stdio: 'pipe' });
  } catch (error) {
    log('❌ Not logged in to NPM. Run: npm login', 'red');
    process.exit(1);
  }
  
  exec('npm publish --access public');
  log('✅ Published to NPM', 'green');
}

function showSuccess() {
  const version = getNewVersion();
  const packageName = JSON.parse(fs.readFileSync('package.json', 'utf8')).name;
  
  log('\n🎉 Release completed successfully!', 'green');
  log(`📦 Version: ${version}`, 'cyan');
  log(`🔗 NPM: https://www.npmjs.com/package/${packageName}`, 'cyan');
  log(`🏷️ GitHub: https://github.com/appletosolutions/reactbits/releases/tag/v${version}`, 'cyan');
  log('\n📢 Don\'t forget to:', 'yellow');
  log('  • Announce on social media', 'yellow');
  log('  • Update documentation if needed', 'yellow');
  log('  • Notify users of breaking changes', 'yellow');
}

// Main release process
async function main() {
  log('🚀 Starting ReactBits release process...', 'bright');
  
  try {
    checkGitStatus();
    checkBranch();
    runTests();
    buildPackage();
    checkPackageSize();
    generateChangelog();
    commitAndTag();
    pushChanges();
    publishToNpm();
    showSuccess();
  } catch (error) {
    log(`❌ Release failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  log('ReactBits Release Script', 'bright');
  log('Usage: npm run release', 'cyan');
  log('\nThis script will:', 'yellow');
  log('  • Check git status and branch', 'yellow');
  log('  • Run tests and build', 'yellow');
  log('  • Generate changelog', 'yellow');
  log('  • Commit, tag, and push', 'yellow');
  log('  • Publish to NPM', 'yellow');
  process.exit(0);
}

// Run main function if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
