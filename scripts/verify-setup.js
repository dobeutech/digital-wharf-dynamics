#!/usr/bin/env node

/**
 * Verification script to check if setup is complete
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const checks = [];
let passed = 0;
let failed = 0;

function check(name, condition, message) {
  checks.push({ name, condition, message });
  if (condition) {
    console.log(`✅ ${name}`);
    passed++;
  } else {
    console.log(`❌ ${name}: ${message}`);
    failed++;
  }
}

console.log('🔍 Verifying setup...\n');

// Check environment file
check(
  'Environment file exists',
  existsSync(join(rootDir, '.env')) || existsSync(join(rootDir, '.env.local')),
  'Create .env file with required variables (see SETUP_GUIDE.md)'
);

// Check package.json
try {
  const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf-8'));
  
  check(
    'Test scripts exist',
    packageJson.scripts?.test && packageJson.scripts?.['test:e2e'],
    'Test scripts should be in package.json'
  );
  
  check(
    'Testing dependencies installed',
    packageJson.devDependencies?.vitest && packageJson.devDependencies?.['@playwright/test'],
    'Install testing dependencies: npm install'
  );
} catch (error) {
  check('package.json readable', false, error.message);
}

// Check key files
const requiredFiles = [
  'src/config/env.ts',
  'src/components/ErrorBoundary.tsx',
  'src/lib/error-handler.ts',
  'vite.config.ts',
  'vitest.config.ts',
  'playwright.config.ts',
  'public/manifest.json',
  'public/sw.js',
];

requiredFiles.forEach(file => {
  check(
    `${file} exists`,
    existsSync(join(rootDir, file)),
    `File ${file} is missing`
  );
});

// Check migrations
const migrationsDir = join(rootDir, 'supabase', 'migrations');
if (existsSync(migrationsDir)) {
  const migrations = [
    '20251204000000_rate_limits_table.sql',
    '20251204000001_database_backups_table.sql',
  ];
  
  migrations.forEach(migration => {
    check(
      `Migration ${migration} exists`,
      existsSync(join(migrationsDir, migration)),
      `Migration ${migration} is missing`
    );
  });
}

// Check GitHub workflows
const workflowsDir = join(rootDir, '.github', 'workflows');
if (existsSync(workflowsDir)) {
  check(
    'CI workflow exists',
    existsSync(join(workflowsDir, 'ci.yml')),
    'CI workflow is missing'
  );
  
  check(
    'Security scan workflow exists',
    existsSync(join(workflowsDir, 'security-scan.yml')),
    'Security scan workflow is missing'
  );
}

console.log('\n📊 Summary:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📝 Total: ${checks.length}`);

if (failed === 0) {
  console.log('\n🎉 All checks passed! Setup looks good.');
  process.exit(0);
} else {
  console.log('\n⚠️  Some checks failed. Please review the messages above.');
  console.log('📖 See SETUP_GUIDE.md for detailed setup instructions.');
  process.exit(1);
}

