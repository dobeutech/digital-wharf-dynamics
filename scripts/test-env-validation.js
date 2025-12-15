#!/usr/bin/env node

/**
 * Test environment variable validation
 * This script simulates what happens when the app starts
 */

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync, existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

console.log("🧪 Testing Environment Variable Validation\n");

// Mock import.meta.env
const mockEnv = {
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || "",
  VITE_SUPABASE_PUBLISHABLE_KEY:
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "",
  DEV: process.env.NODE_ENV !== "production",
  PROD: process.env.NODE_ENV === "production",
  MODE: process.env.NODE_ENV || "development",
};

// Read and evaluate the env.ts file
try {
  const envFile = readFileSync(join(rootDir, "src/config/env.ts"), "utf-8");

  // Create a mock module context
  const mockImportMeta = {
    env: mockEnv,
  };

  console.log("📋 Environment Variables Status:");
  console.log("─".repeat(50));

  const requiredVars = ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"];

  let allPresent = true;

  requiredVars.forEach((varName) => {
    const value = mockEnv[varName];
    if (value && value.trim() !== "") {
      // Mask sensitive values
      const displayValue =
        varName.includes("KEY") || varName.includes("SECRET")
          ? value.substring(0, 10) + "..." + value.substring(value.length - 4)
          : value;
      console.log(`✅ ${varName}: ${displayValue}`);
    } else {
      console.log(`❌ ${varName}: NOT SET`);
      allPresent = false;
    }
  });

  console.log("─".repeat(50));

  if (allPresent) {
    console.log("\n✅ All required environment variables are set!");
    console.log("💡 The app will validate these on startup.");
  } else {
    console.log("\n⚠️  Missing required environment variables!");
    console.log("📝 Create a .env file with:");
    console.log("   VITE_SUPABASE_URL=https://your-project.supabase.co");
    console.log("   VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key");
    process.exit(1);
  }

  // Check .env file exists
  const envFileExists =
    existsSync(join(rootDir, ".env")) ||
    existsSync(join(rootDir, ".env.local"));
  if (envFileExists) {
    console.log("✅ .env file found");
  } else {
    console.log("⚠️  .env file not found (using system environment variables)");
  }
} catch (error) {
  console.error("❌ Error reading env.ts:", error.message);
  process.exit(1);
}
