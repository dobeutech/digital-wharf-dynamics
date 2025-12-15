#!/usr/bin/env node

/**
 * MongoDB Optimization Script
 *
 * Implements cost-saving optimizations for MongoDB Atlas:
 * - Creates indexes for better query performance
 * - Adds TTL indexes for automatic data cleanup
 * - Analyzes collection sizes and suggests optimizations
 */

import { MongoClient } from "mongodb";
import { config } from "dotenv";

config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || "app";

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI environment variable is required");
  process.exit(1);
}

async function main() {
  console.log("🚀 MongoDB Optimization Script\n");

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB\n");

    const db = client.db(DB_NAME);

    // 1. Create Indexes
    await createIndexes(db);

    // 2. Add TTL Indexes
    await addTTLIndexes(db);

    // 3. Analyze Collections
    await analyzeCollections(db);

    // 4. Check for Missing Indexes
    await checkMissingIndexes(db);

    console.log("\n✅ Optimization complete!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

async function createIndexes(db) {
  console.log("📊 Creating Indexes...\n");

  const indexes = [
    // Users collection
    {
      collection: "users",
      indexes: [
        { key: { email: 1 }, options: { unique: true, name: "email_unique" } },
        { key: { createdAt: -1 }, options: { name: "created_at_desc" } },
      ],
    },

    // Projects collection
    {
      collection: "projects",
      indexes: [
        {
          key: { userId: 1, createdAt: -1 },
          options: { name: "user_created" },
        },
        { key: { status: 1 }, options: { name: "status" } },
      ],
    },

    // Project Tasks collection
    {
      collection: "project_tasks",
      indexes: [
        {
          key: { projectId: 1, status: 1 },
          options: { name: "project_status" },
        },
        { key: { dueDate: 1 }, options: { name: "due_date" } },
      ],
    },

    // Services collection
    {
      collection: "services",
      indexes: [
        { key: { active: 1 }, options: { name: "active" } },
        { key: { createdAt: -1 }, options: { name: "created_at_desc" } },
      ],
    },

    // Contact Submissions collection
    {
      collection: "contact_submissions",
      indexes: [
        { key: { email: 1 }, options: { name: "email" } },
        { key: { createdAt: -1 }, options: { name: "created_at_desc" } },
      ],
    },

    // Newsletter Subscribers collection
    {
      collection: "newsletter_subscribers",
      indexes: [
        { key: { email: 1 }, options: { unique: true, name: "email_unique" } },
        { key: { active: 1 }, options: { name: "active" } },
      ],
    },

    // News collection
    {
      collection: "news",
      indexes: [
        { key: { publishedAt: -1 }, options: { name: "published_at_desc" } },
        { key: { author: 1 }, options: { name: "author" } },
      ],
    },

    // Audit Logs collection
    {
      collection: "audit_logs",
      indexes: [
        {
          key: { userId: 1, createdAt: -1 },
          options: { name: "user_created" },
        },
        { key: { action: 1 }, options: { name: "action" } },
        { key: { resource: 1 }, options: { name: "resource" } },
      ],
    },

    // CCPA Requests collection
    {
      collection: "ccpa_requests",
      indexes: [
        { key: { userId: 1 }, options: { name: "user_id" } },
        { key: { status: 1 }, options: { name: "status" } },
        { key: { createdAt: -1 }, options: { name: "created_at_desc" } },
      ],
    },
  ];

  for (const { collection, indexes: collectionIndexes } of indexes) {
    try {
      const coll = db.collection(collection);

      for (const { key, options } of collectionIndexes) {
        try {
          await coll.createIndex(key, options);
          console.log(`  ✅ Created index "${options.name}" on ${collection}`);
        } catch (error) {
          if (error.code === 85 || error.code === 86) {
            // Index already exists or duplicate key
            console.log(
              `  ℹ️  Index "${options.name}" already exists on ${collection}`,
            );
          } else {
            console.error(
              `  ❌ Failed to create index "${options.name}" on ${collection}:`,
              error.message,
            );
          }
        }
      }
    } catch (error) {
      console.error(`  ⚠️  Collection ${collection} may not exist yet`);
    }
  }

  console.log();
}

async function addTTLIndexes(db) {
  console.log("⏰ Adding TTL Indexes for Auto-Cleanup...\n");

  const ttlIndexes = [
    // Audit logs - keep for 30 days
    {
      collection: "audit_logs",
      field: "createdAt",
      expireAfterSeconds: 30 * 24 * 60 * 60, // 30 days
      name: "ttl_30_days",
    },

    // Contact submissions - keep for 90 days
    {
      collection: "contact_submissions",
      field: "createdAt",
      expireAfterSeconds: 90 * 24 * 60 * 60, // 90 days
      name: "ttl_90_days",
    },
  ];

  for (const { collection, field, expireAfterSeconds, name } of ttlIndexes) {
    try {
      const coll = db.collection(collection);
      await coll.createIndex({ [field]: 1 }, { expireAfterSeconds, name });
      console.log(
        `  ✅ Created TTL index on ${collection}.${field} (${expireAfterSeconds / 86400} days)`,
      );
    } catch (error) {
      if (error.code === 85 || error.code === 86) {
        console.log(`  ℹ️  TTL index already exists on ${collection}.${field}`);
      } else {
        console.error(
          `  ❌ Failed to create TTL index on ${collection}:`,
          error.message,
        );
      }
    }
  }

  console.log();
}

async function analyzeCollections(db) {
  console.log("📈 Analyzing Collections...\n");

  const collections = await db.listCollections().toArray();

  let totalSize = 0;
  let totalDocuments = 0;

  for (const collInfo of collections) {
    try {
      const coll = db.collection(collInfo.name);
      const stats = await coll.stats();

      const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
      const avgDocSize =
        stats.count > 0 ? (stats.size / stats.count).toFixed(0) : 0;

      totalSize += stats.size;
      totalDocuments += stats.count;

      console.log(`  📦 ${collInfo.name}`);
      console.log(`     Documents: ${stats.count.toLocaleString()}`);
      console.log(`     Size: ${sizeMB} MB`);
      console.log(`     Avg Doc Size: ${avgDocSize} bytes`);
      console.log(`     Indexes: ${stats.nindexes}`);
      console.log();
    } catch (error) {
      console.error(`  ⚠️  Could not analyze ${collInfo.name}:`, error.message);
    }
  }

  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
  console.log(`  📊 Total Database Size: ${totalSizeMB} MB`);
  console.log(`  📄 Total Documents: ${totalDocuments.toLocaleString()}`);
  console.log();

  // Recommendations based on size
  if (totalSize < 100 * 1024 * 1024) {
    console.log("  💡 Recommendation: M0 (Free) tier is sufficient");
  } else if (totalSize < 500 * 1024 * 1024) {
    console.log("  💡 Recommendation: M0 (Free) or M2 ($9/month) tier");
  } else if (totalSize < 2 * 1024 * 1024 * 1024) {
    console.log("  💡 Recommendation: M2 ($9/month) or M5 ($25/month) tier");
  } else if (totalSize < 5 * 1024 * 1024 * 1024) {
    console.log("  💡 Recommendation: M5 ($25/month) or M10 ($57/month) tier");
  } else {
    console.log("  💡 Recommendation: M10+ tier with backups");
  }

  console.log();
}

async function checkMissingIndexes(db) {
  console.log("🔍 Checking for Missing Indexes...\n");

  // Check for collections without indexes
  const collections = await db.listCollections().toArray();

  for (const collInfo of collections) {
    try {
      const coll = db.collection(collInfo.name);
      const indexes = await coll.indexes();

      if (indexes.length === 1) {
        // Only has _id index
        console.log(`  ⚠️  ${collInfo.name} has no custom indexes`);
      }
    } catch (error) {
      // Ignore
    }
  }

  console.log();
}

// Run the script
main().catch(console.error);
