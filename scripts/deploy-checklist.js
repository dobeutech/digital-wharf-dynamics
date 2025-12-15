#!/usr/bin/env node

/**
 * Interactive deployment checklist
 * Helps ensure all steps are completed before deployment
 */

import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

const checklist = [
  {
    category: "Environment",
    items: [
      "Environment variables configured",
      "Secrets stored securely",
      "Environment validation passes",
    ],
  },
  {
    category: "Database",
    items: [
      "Migrations applied",
      "Rate limits table exists",
      "Backups table exists",
      "RLS policies verified",
    ],
  },
  {
    category: "Edge Functions",
    items: [
      "backup-database function deployed",
      "rate-limiter function deployed",
      "Function secrets configured",
    ],
  },
  {
    category: "Code Quality",
    items: [
      "All tests pass",
      "Linting passes",
      "Build succeeds",
      "No TypeScript errors",
    ],
  },
  {
    category: "Security",
    items: [
      "Security headers configured",
      "CSP not blocking resources",
      "CSRF protection enabled",
    ],
  },
  {
    category: "Monitoring",
    items: [
      "Error tracking configured",
      "Uptime monitoring set up",
      "Alerts configured",
    ],
  },
];

async function runChecklist() {
  console.log("📋 Deployment Checklist\n");
  console.log('Answer "y" for yes, "n" for no, or "s" to skip\n');

  let completed = 0;
  let total = 0;
  const issues = [];

  for (const section of checklist) {
    console.log(`\n${section.category}:`);
    console.log("─".repeat(40));

    for (const item of section.items) {
      total++;
      const answer = await question(`  [ ] ${item} (y/n/s): `);

      if (answer.toLowerCase() === "y") {
        completed++;
        console.log(`  ✅ ${item}`);
      } else if (answer.toLowerCase() === "n") {
        issues.push(`${section.category}: ${item}`);
        console.log(`  ❌ ${item} - NEEDS ATTENTION`);
      } else {
        console.log(`  ⏭️  ${item} - SKIPPED`);
      }
    }
  }

  rl.close();

  console.log("\n" + "=".repeat(50));
  console.log("📊 Checklist Summary");
  console.log("=".repeat(50));
  console.log(`✅ Completed: ${completed}/${total}`);
  console.log(`❌ Issues: ${issues.length}`);

  if (issues.length > 0) {
    console.log("\n⚠️  Items needing attention:");
    issues.forEach((issue) => console.log(`   - ${issue}`));
    console.log("\n⚠️  Please address these items before deploying!");
    process.exit(1);
  } else {
    console.log("\n🎉 All checklist items completed!");
    console.log("✅ Ready for deployment");
    process.exit(0);
  }
}

runChecklist().catch((error) => {
  console.error("Error:", error);
  rl.close();
  process.exit(1);
});
