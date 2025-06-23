#!/usr/bin/env node

/**
 * Setup script for ReactBits automation
 * Initializes Git hooks, installs dependencies, and configures automation
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
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
    throw error;
  }
}

function checkPrerequisites() {
  log('🔍 Checking prerequisites...', 'yellow');
  
  // Check if we're in a git repository
  try {
    exec('git status', { stdio: 'pipe' });
  } catch (error) {
    log('❌ Not in a git repository. Run: git init', 'red');
    process.exit(1);
  }
  
  // Check if package.json exists
  if (!fs.existsSync('package.json')) {
    log('❌ package.json not found', 'red');
    process.exit(1);
  }
  
  log('✅ Prerequisites check passed', 'green');
}

function installDependencies() {
  log('📦 Installing automation dependencies...', 'yellow');
  
  const devDeps = [
    '@commitlint/cli',
    '@commitlint/config-conventional',
    'husky',
    'lint-staged',
    'standard-version'
  ];
  
  exec(`npm install --save-dev ${devDeps.join(' ')}`);
  log('✅ Dependencies installed', 'green');
}

function setupHusky() {
  log('🪝 Setting up Git hooks...', 'yellow');
  
  try {
    exec('npx husky install');
    
    // Make hook files executable
    const hookFiles = [
      '.husky/pre-commit',
      '.husky/commit-msg',
      '.husky/_/husky.sh'
    ];
    
    hookFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.chmodSync(file, '755');
      }
    });
    
    log('✅ Git hooks configured', 'green');
  } catch (error) {
    log('⚠️ Husky setup failed, but continuing...', 'yellow');
  }
}

function checkNpmLogin() {
  log('🔐 Checking NPM authentication...', 'yellow');
  
  try {
    const whoami = execSync('npm whoami', { encoding: 'utf8', stdio: 'pipe' });
    log(`✅ Logged in to NPM as: ${whoami.trim()}`, 'green');
  } catch (error) {
    log('⚠️ Not logged in to NPM. Run: npm login', 'yellow');
    log('   This is required for automated publishing', 'yellow');
  }
}

function checkGitConfig() {
  log('⚙️ Checking Git configuration...', 'yellow');
  
  try {
    const name = execSync('git config user.name', { encoding: 'utf8', stdio: 'pipe' }).trim();
    const email = execSync('git config user.email', { encoding: 'utf8', stdio: 'pipe' }).trim();
    
    if (name && email) {
      log(`✅ Git configured: ${name} <${email}>`, 'green');
    } else {
      log('⚠️ Git user not configured. Run:', 'yellow');
      log('   git config user.name "Your Name"', 'yellow');
      log('   git config user.email "your.email@example.com"', 'yellow');
    }
  } catch (error) {
    log('⚠️ Git configuration incomplete', 'yellow');
  }
}

function createInitialChangelog() {
  log('📝 Creating initial changelog...', 'yellow');
  
  if (!fs.existsSync('CHANGELOG.md')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const initialChangelog = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [${packageJson.version}] - ${new Date().toISOString().split('T')[0]}

### Added
- Initial release of ReactBits
- 80+ React animation components
- TypeScript support
- Automated release workflow
`;
    
    fs.writeFileSync('CHANGELOG.md', initialChangelog);
    log('✅ Initial changelog created', 'green');
  } else {
    log('✅ Changelog already exists', 'green');
  }
}

function showNextSteps() {
  log('\n🎉 Automation setup completed!', 'bright');
  log('\n📋 Next steps:', 'cyan');
  log('1. Set up GitHub secrets:', 'yellow');
  log('   • Go to GitHub → Settings → Secrets → Actions', 'yellow');
  log('   • Add NPM_TOKEN with your NPM access token', 'yellow');
  log('\n2. Test the setup:', 'yellow');
  log('   git add .', 'cyan');
  log('   git commit -m "feat: setup automated releases"', 'cyan');
  log('   git push origin main', 'cyan');
  log('\n3. Monitor the release:', 'yellow');
  log('   • Check GitHub Actions tab for workflow progress', 'yellow');
  log('   • Verify NPM package is published', 'yellow');
  log('   • Check GitHub releases for new release', 'yellow');
  log('\n📖 For detailed instructions, see AUTOMATION_SETUP.md', 'blue');
  log('\n🚀 Happy releasing!', 'green');
}

function showCommitExamples() {
  log('\n💡 Commit message examples:', 'cyan');
  log('feat: add new particle animation component', 'yellow');
  log('fix: resolve memory leak in canvas animations', 'yellow');
  log('perf: optimize WebGL shader performance', 'yellow');
  log('docs: update installation instructions', 'yellow');
  log('feat!: redesign animation API (BREAKING CHANGE)', 'yellow');
}

// Main setup process
async function main() {
  log('🚀 Setting up ReactBits automation...', 'bright');
  
  try {
    checkPrerequisites();
    installDependencies();
    setupHusky();
    checkNpmLogin();
    checkGitConfig();
    createInitialChangelog();
    showCommitExamples();
    showNextSteps();
  } catch (error) {
    log(`❌ Setup failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  log('ReactBits Automation Setup', 'bright');
  log('Usage: node scripts/setup-automation.js', 'cyan');
  log('\nThis script will:', 'yellow');
  log('  • Install required dependencies', 'yellow');
  log('  • Configure Git hooks', 'yellow');
  log('  • Set up automation files', 'yellow');
  log('  • Create initial changelog', 'yellow');
  log('  • Show next steps', 'yellow');
  process.exit(0);
}

if (require.main === module) {
  main();
}
