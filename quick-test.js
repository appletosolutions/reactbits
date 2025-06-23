#!/usr/bin/env node

/**
 * Quick ReactBits Package Test
 * 
 * This script performs a fast verification that the package can be installed
 * and imported without dependency resolution errors.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PACKAGE_FILE = 'appletosolutions-reactbits-1.0.1.tgz';
const TEST_DIR = 'quick-test-app';

function log(message, type = 'info') {
  const prefix = {
    info: '📋',
    success: '✅',
    error: '❌',
    warning: '⚠️'
  }[type];
  console.log(`${prefix} ${message}`);
}

function runCommand(command, cwd = process.cwd()) {
  try {
    log(`Running: ${command}`);
    const result = execSync(command, { 
      cwd, 
      stdio: 'pipe',
      encoding: 'utf8'
    });
    return result;
  } catch (error) {
    throw new Error(`Command failed: ${command}\n${error.message}`);
  }
}

async function quickTest() {
  log('Starting quick package test...');
  
  try {
    // Check if package file exists
    if (!fs.existsSync(PACKAGE_FILE)) {
      throw new Error(`Package file ${PACKAGE_FILE} not found. Run 'npm pack' first.`);
    }
    
    // Clean up any existing test directory
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
    
    // Create a simple React app
    log('Creating test React app...');
    runCommand(`npx create-react-app ${TEST_DIR} --template typescript`);
    
    // Install our package
    log('Installing ReactBits package...');
    const packagePath = path.resolve(PACKAGE_FILE);
    runCommand(`npm install ${packagePath}`, TEST_DIR);
    
    // Install basic peer dependencies
    log('Installing peer dependencies...');
    runCommand('npm install gsap', TEST_DIR);
    
    // Create a test component
    log('Creating test component...');
    const testComponent = `
import React from 'react';
import { Bounce, ClickSpark } from '@appletosolutions/reactbits';

function TestComponent() {
  return (
    <div>
      <Bounce>
        <h1>ReactBits Test</h1>
      </Bounce>
      <ClickSpark sparkColor="#ff6b6b">
        <button>Test Button</button>
      </ClickSpark>
    </div>
  );
}

export default TestComponent;
    `;
    
    fs.writeFileSync(
      path.join(TEST_DIR, 'src', 'TestComponent.tsx'), 
      testComponent
    );
    
    // Update App.tsx
    const appContent = `
import React from 'react';
import TestComponent from './TestComponent';

function App() {
  return <TestComponent />;
}

export default App;
    `;
    
    fs.writeFileSync(
      path.join(TEST_DIR, 'src', 'App.tsx'), 
      appContent
    );
    
    // Test TypeScript compilation
    log('Testing TypeScript compilation...');
    runCommand('npx tsc --noEmit', TEST_DIR);
    
    // Test build
    log('Testing build process...');
    runCommand('npm run build', TEST_DIR);
    
    // Check bundle size
    const buildDir = path.join(TEST_DIR, 'build', 'static', 'js');
    if (fs.existsSync(buildDir)) {
      const jsFiles = fs.readdirSync(buildDir).filter(f => f.endsWith('.js'));
      const totalSize = jsFiles.reduce((size, file) => {
        const filePath = path.join(buildDir, file);
        return size + fs.statSync(filePath).size;
      }, 0);
      
      log(`Bundle size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    }
    
    log('All tests passed! ✅', 'success');
    log('Package is ready for publishing 🎉', 'success');
    
    // Clean up
    log('Cleaning up test files...');
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
    
  } catch (error) {
    log(`Test failed: ${error.message}`, 'error');
    
    // Clean up on failure
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
    
    process.exit(1);
  }
}

// Run test if this script is executed directly
if (require.main === module) {
  quickTest();
}

module.exports = { quickTest };
