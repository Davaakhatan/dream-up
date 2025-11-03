#!/usr/bin/env node

/**
 * Validation script to test project structure and code
 */

import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

async function runTests() {
  console.log('🧪 Running DreamUp QA Pipeline Validation Tests\n');
  console.log('═'.repeat(60));
  
  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${name}`);
      console.log(`   Error: ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  
  if (failed === 0) {
    console.log('✅ All validation tests passed!\n');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed. Please fix the issues above.\n');
    process.exit(1);
  }
}

// Test 1: Check package.json exists
test('package.json exists', async () => {
  if (!existsSync('package.json')) {
    throw new Error('package.json not found');
  }
  const pkg = JSON.parse(await readFile('package.json', 'utf-8'));
  if (!pkg.name || !pkg.version) {
    throw new Error('package.json missing required fields');
  }
});

// Test 2: Check tsconfig.json exists
test('tsconfig.json exists and valid', async () => {
  if (!existsSync('tsconfig.json')) {
    throw new Error('tsconfig.json not found');
  }
  const tsconfig = JSON.parse(await readFile('tsconfig.json', 'utf-8'));
  if (!tsconfig.compilerOptions) {
    throw new Error('tsconfig.json missing compilerOptions');
  }
});

// Test 3: Check source directory structure
test('Source directory structure', async () => {
  const requiredDirs = [
    'src/agent',
    'src/browser',
    'src/config',
    'src/types',
    'src/utils',
    'src/dashboard',
    'src/dashboard/public',
  ];
  
  for (const dir of requiredDirs) {
    if (!existsSync(dir)) {
      throw new Error(`Required directory missing: ${dir}`);
    }
  }
});

// Test 4: Check required TypeScript files
test('Required TypeScript files exist', async () => {
  const requiredFiles = [
    'src/index.ts',
    'src/cli.ts',
    'src/agent/qa-agent.ts',
    'src/agent/interaction-engine.ts',
    'src/agent/evidence-capture.ts',
    'src/agent/evaluator.ts',
    'src/browser/browserbase-provider.ts',
    'src/config/config-loader.ts',
    'src/config/default-config.ts',
    'src/types/config.ts',
    'src/types/report.ts',
    'src/types/browser.ts',
    'src/utils/cli-ui.ts',
    'src/dashboard/server.ts',
  ];
  
  for (const file of requiredFiles) {
    if (!existsSync(file)) {
      throw new Error(`Required file missing: ${file}`);
    }
  }
});

// Test 5: Check dashboard HTML exists
test('Dashboard HTML exists', async () => {
  if (!existsSync('src/dashboard/public/index.html')) {
    throw new Error('Dashboard HTML file missing');
  }
});

// Test 6: Validate package.json dependencies
test('Package.json dependencies', async () => {
  const pkg = JSON.parse(await readFile('package.json', 'utf-8'));
  const requiredDeps = [
    '@browserbasehq/sdk',
    'chalk',
    'commander',
    'express',
    'openai',
    'ora',
  ];
  
  for (const dep of requiredDeps) {
    if (!pkg.dependencies || !pkg.dependencies[dep]) {
      throw new Error(`Missing dependency: ${dep}`);
    }
  }
});

// Test 7: Check configuration example exists
test('Configuration example exists', async () => {
  if (!existsSync('config.example.json')) {
    throw new Error('config.example.json not found');
  }
  const config = JSON.parse(await readFile('config.example.json', 'utf-8'));
  if (!config.actions || !config.timeouts) {
    throw new Error('Invalid config.example.json structure');
  }
});

// Test 8: Validate TypeScript file syntax (basic check)
test('TypeScript files have valid structure', async () => {
  const srcFiles = [
    'src/index.ts',
    'src/cli.ts',
  ];
  
  for (const file of srcFiles) {
    const content = await readFile(file, 'utf-8');
    
    // Basic checks
    if (!content.includes('import') && !content.includes('export')) {
      throw new Error(`File ${file} seems invalid (no imports/exports)`);
    }
    
    // Check for common syntax errors
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    if (Math.abs(openBraces - closeBraces) > 2) { // Allow some variance
      throw new Error(`File ${file} has mismatched braces`);
    }
  }
});

// Test 9: Check README exists
test('README.md exists', async () => {
  if (!existsSync('README.md')) {
    throw new Error('README.md not found');
  }
  const readme = await readFile('README.md', 'utf-8');
  if (readme.length < 100) {
    throw new Error('README.md seems too short');
  }
});

// Test 10: Validate exports in index.ts
test('index.ts exports required modules', async () => {
  const content = await readFile('src/index.ts', 'utf-8');
  const requiredExports = [
    'QAAgent',
    'BrowserbaseProvider',
    'EvidenceCapture',
    'Evaluator',
  ];
  
  for (const exp of requiredExports) {
    if (!content.includes(`export { ${exp} }`) && !content.includes(`export {${exp}}`)) {
      throw new Error(`Missing export: ${exp}`);
    }
  }
});

// Test 11: Check CLI has test and dashboard commands
test('CLI has required commands', async () => {
  const content = await readFile('src/cli.ts', 'utf-8');
  if (!content.includes('.command(\'test\')')) {
    throw new Error('CLI missing test command');
  }
  if (!content.includes('.command(\'dashboard\')')) {
    throw new Error('CLI missing dashboard command');
  }
});

// Test 12: Validate dashboard server structure
test('Dashboard server has required endpoints', async () => {
  const content = await readFile('src/dashboard/server.ts', 'utf-8');
  if (!content.includes('/api/reports')) {
    throw new Error('Dashboard missing /api/reports endpoint');
  }
  if (!content.includes('/api/screenshots')) {
    throw new Error('Dashboard missing /api/screenshots endpoint');
  }
});

runTests();

