#!/usr/bin/env node

/**
 * Comprehensive ReactBits Package Testing Script
 * 
 * This script creates multiple test environments to verify that the ReactBits package
 * installs and works correctly without dependency resolution errors.
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const PACKAGE_NAME = '@appletosolutions/reactbits';
const PACKAGE_FILE = 'appletosolutions-reactbits-1.0.1.tgz';

// Test configurations for different bundlers and React versions
const TEST_CONFIGS = [
  {
    name: 'create-react-app-typescript',
    command: 'npx create-react-app test-cra --template typescript',
    bundler: 'webpack',
    reactVersion: '18'
  },
  {
    name: 'vite-react-typescript',
    command: 'npm create vite@latest test-vite -- --template react-ts',
    bundler: 'vite',
    reactVersion: '18'
  },
  {
    name: 'next-js-typescript',
    command: 'npx create-next-app@latest test-nextjs --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"',
    bundler: 'webpack',
    reactVersion: '18'
  }
];

// Test component to verify basic functionality
const TEST_COMPONENT = `
import React from 'react';
import { Bounce, ClickSpark, StarBorder, FadeContent } from '${PACKAGE_NAME}';

function TestReactBits() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>ReactBits Package Test</h1>
      
      {/* Test basic animation */}
      <Bounce>
        <h2>✅ Bounce Animation Working</h2>
      </Bounce>

      {/* Test interactive component */}
      <ClickSpark sparkColor="#ff6b6b" sparkCount={8}>
        <button style={{ padding: '10px 20px', margin: '10px' }}>
          ✅ Click Spark Working
        </button>
      </ClickSpark>

      {/* Test border animation */}
      <StarBorder color="#00d4ff" speed="2s">
        <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
          ✅ Star Border Working
        </div>
      </StarBorder>

      {/* Test fade animation */}
      <FadeContent duration={1000}>
        <p>✅ Fade Content Working</p>
      </FadeContent>
    </div>
  );
}

export default TestReactBits;
`;

class PackageTester {
  constructor() {
    this.testResults = [];
    this.currentDir = process.cwd();
    this.testDir = path.join(this.currentDir, 'package-tests');
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️'
    }[type];
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async setupTestEnvironment() {
    this.log('Setting up test environment...');
    
    // Create test directory
    if (fs.existsSync(this.testDir)) {
      fs.rmSync(this.testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(this.testDir, { recursive: true });
    
    // Copy package file to test directory
    const packagePath = path.join(this.currentDir, PACKAGE_FILE);
    const testPackagePath = path.join(this.testDir, PACKAGE_FILE);
    
    if (!fs.existsSync(packagePath)) {
      throw new Error(`Package file ${PACKAGE_FILE} not found. Run 'npm pack' first.`);
    }
    
    fs.copyFileSync(packagePath, testPackagePath);
    this.log('Test environment ready', 'success');
  }

  async runCommand(command, cwd, timeout = 300000) {
    return new Promise((resolve, reject) => {
      this.log(`Running: ${command}`);
      
      const child = spawn(command, [], {
        shell: true,
        cwd,
        stdio: 'pipe'
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      const timer = setTimeout(() => {
        child.kill();
        reject(new Error(`Command timed out after ${timeout}ms`));
      }, timeout);

      child.on('close', (code) => {
        clearTimeout(timer);
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(new Error(`Command failed with code ${code}: ${stderr}`));
        }
      });
    });
  }

  async testConfiguration(config) {
    const testName = config.name;
    const testPath = path.join(this.testDir, testName);
    
    this.log(`Testing ${testName}...`);
    
    try {
      // Create test app
      await this.runCommand(config.command, this.testDir);
      
      // Install our package
      const packagePath = path.join(this.testDir, PACKAGE_FILE);
      await this.runCommand(`npm install ${packagePath}`, testPath);
      
      // Install peer dependencies for basic test
      await this.runCommand('npm install gsap', testPath);
      
      // Create test component
      const testComponentPath = path.join(testPath, 'src', 'TestReactBits.tsx');
      fs.writeFileSync(testComponentPath, TEST_COMPONENT);
      
      // Update main App component
      const appPath = path.join(testPath, 'src', 'App.tsx');
      const appContent = `
import React from 'react';
import TestReactBits from './TestReactBits';

function App() {
  return <TestReactBits />;
}

export default App;
      `;
      fs.writeFileSync(appPath, appContent);
      
      // Test build
      await this.runCommand('npm run build', testPath);
      
      this.testResults.push({
        name: testName,
        status: 'success',
        bundler: config.bundler,
        reactVersion: config.reactVersion
      });
      
      this.log(`${testName} test passed`, 'success');
      
    } catch (error) {
      this.testResults.push({
        name: testName,
        status: 'failed',
        error: error.message,
        bundler: config.bundler,
        reactVersion: config.reactVersion
      });
      
      this.log(`${testName} test failed: ${error.message}`, 'error');
    }
  }

  async runAllTests() {
    this.log('Starting comprehensive package tests...');
    
    await this.setupTestEnvironment();
    
    for (const config of TEST_CONFIGS) {
      await this.testConfiguration(config);
    }
    
    this.generateReport();
  }

  generateReport() {
    this.log('Generating test report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      package: PACKAGE_NAME,
      packageFile: PACKAGE_FILE,
      totalTests: this.testResults.length,
      passed: this.testResults.filter(r => r.status === 'success').length,
      failed: this.testResults.filter(r => r.status === 'failed').length,
      results: this.testResults
    };
    
    // Write report to file
    const reportPath = path.join(this.testDir, 'test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Display summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 PACKAGE TEST REPORT');
    console.log('='.repeat(60));
    console.log(`Package: ${PACKAGE_NAME}`);
    console.log(`Total Tests: ${report.totalTests}`);
    console.log(`Passed: ${report.passed} ✅`);
    console.log(`Failed: ${report.failed} ${report.failed > 0 ? '❌' : '✅'}`);
    console.log('='.repeat(60));
    
    this.testResults.forEach(result => {
      const status = result.status === 'success' ? '✅' : '❌';
      console.log(`${status} ${result.name} (${result.bundler})`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });
    
    console.log('='.repeat(60));
    console.log(`Full report saved to: ${reportPath}`);
    
    if (report.failed === 0) {
      this.log('All tests passed! Package is ready for publishing 🎉', 'success');
    } else {
      this.log(`${report.failed} tests failed. Please fix issues before publishing.`, 'error');
      process.exit(1);
    }
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const tester = new PackageTester();
  tester.runAllTests().catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = PackageTester;
