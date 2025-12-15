#!/usr/bin/env node

/**
 * Pre-deployment validation script
 * Ensures code quality and build success before deployment
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const REQUIRED_LIGHTHOUSE_SCORES = {
  performance: 90,
  accessibility: 90,
  bestPractices: 80,
  seo: 95,
  pwa: 80,
};

let exitCode = 0;

function log(message, type = "info") {
  const colors = {
    info: "\x1b[36m",
    success: "\x1b[32m",
    error: "\x1b[31m",
    warning: "\x1b[33m",
  };
  const reset = "\x1b[0m";
  console.log(`${colors[type]}${message}${reset}`);
}

function runCommand(command, description) {
  log(`\n▶ ${description}...`, "info");
  try {
    execSync(command, { stdio: "inherit" });
    log(`✓ ${description} passed`, "success");
    return true;
  } catch (error) {
    log(`✗ ${description} failed`, "error");
    exitCode = 1;
    return false;
  }
}

function checkFile(filePath, description) {
  log(`\n▶ Checking ${description}...`, "info");
  if (fs.existsSync(filePath)) {
    log(`✓ ${description} exists`, "success");
    return true;
  } else {
    log(`✗ ${description} missing`, "error");
    exitCode = 1;
    return false;
  }
}

log("\n═══════════════════════════════════════════════════════", "info");
log("         PRE-DEPLOYMENT VALIDATION", "info");
log("═══════════════════════════════════════════════════════\n", "info");

// 1. TypeScript type checking
runCommand("npx tsc --noEmit", "TypeScript type checking");

// 2. ESLint
runCommand("npm run lint", "ESLint code quality");

// 3. Unit tests
runCommand("npm run test:ci", "Unit tests");

// 4. Build verification
runCommand("npm run build", "Production build");

// 5. Check critical files
checkFile("dist/index.html", "Built index.html");
checkFile("dist/assets", "Built assets directory");
checkFile("public/sitemap.xml", "Sitemap");
checkFile("public/robots.txt", "Robots.txt");

// 6. Check environment variables
log("\n▶ Checking environment variables...", "info");
const requiredEnvVars = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"];

let envVarsValid = true;
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    log(`✗ Missing environment variable: ${varName}`, "error");
    envVarsValid = false;
    exitCode = 1;
  }
});

if (envVarsValid) {
  log("✓ All required environment variables present", "success");
}

// 7. Check bundle size
log("\n▶ Checking bundle size...", "info");
const distPath = path.join(process.cwd(), "dist");
if (fs.existsSync(distPath)) {
  const stats = execSync(`du -sh ${distPath}`).toString().trim();
  log(`  Bundle size: ${stats.split("\t")[0]}`, "info");
  log("✓ Bundle size check complete", "success");
}

// 8. Validate package.json
log("\n▶ Validating package.json...", "info");
const packageJson = require("../package.json");
if (!packageJson.scripts.build) {
  log("✗ Missing build script in package.json", "error");
  exitCode = 1;
} else {
  log("✓ package.json is valid", "success");
}

// Summary
log("\n═══════════════════════════════════════════════════════", "info");
if (exitCode === 0) {
  log("         ✓ ALL CHECKS PASSED", "success");
  log("         Ready for deployment", "success");
} else {
  log("         ✗ VALIDATION FAILED", "error");
  log("         Fix errors before deploying", "error");
}
log("═══════════════════════════════════════════════════════\n", "info");

process.exit(exitCode);
