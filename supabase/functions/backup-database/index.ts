/**
 * Database backup automation function
 * This function can be scheduled to run daily via Supabase cron or external scheduler
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BackupConfig {
  tables: string[];
  retentionDays: number;
}

const BACKUP_CONFIG: BackupConfig = {
  tables: [
    "profiles",
    "user_roles",
    "services",
    "projects",
    "project_tasks",
    "purchases",
    "client_files",
    "newsletter_posts",
    "newsletter_subscribers",
    "contact_submissions",
    "ccpa_requests",
    "audit_logs",
  ],
  retentionDays: 30, // Keep backups for 30 days
};

/**
 * Create a backup record in the database
 */
async function createBackupRecord(
  supabase: ReturnType<typeof createClient>,
  backupData: Record<string, unknown[]>,
  metadata: { timestamp: string; recordCount: number },
) {
  const { error } = await supabase.from("database_backups").insert({
    backup_data: backupData,
    metadata: metadata,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Failed to create backup record:", error);
    throw error;
  }
}

/**
 * Clean up old backups
 */
async function cleanupOldBackups(
  supabase: ReturnType<typeof createClient>,
  retentionDays: number,
) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

  const { error } = await supabase
    .from("database_backups")
    .delete()
    .lt("created_at", cutoffDate.toISOString());

  if (error) {
    console.error("Failed to cleanup old backups:", error);
    // Don't throw - this is not critical
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify this is an authorized request (e.g., from cron or admin)
    const authHeader = req.headers.get("authorization");
    const expectedToken = Deno.env.get("BACKUP_SECRET_TOKEN");

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const backupData: Record<string, unknown[]> = {};
    const metadata = {
      timestamp: new Date().toISOString(),
      recordCount: 0,
    };

    // Backup each table
    for (const table of BACKUP_CONFIG.tables) {
      try {
        const { data, error } = await supabase.from(table).select("*");

        if (error) {
          console.error(`Failed to backup table ${table}:`, error);
          continue; // Skip this table but continue with others
        }

        if (data) {
          backupData[table] = data;
          metadata.recordCount += data.length;
        }
      } catch (error) {
        console.error(`Error backing up table ${table}:`, error);
        // Continue with other tables
      }
    }

    // Create backup record
    await createBackupRecord(supabase, backupData, metadata);

    // Cleanup old backups
    await cleanupOldBackups(supabase, BACKUP_CONFIG.retentionDays);

    console.log(
      `Backup completed: ${metadata.recordCount} records from ${BACKUP_CONFIG.tables.length} tables`,
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Backup completed successfully",
        metadata,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Backup error:", error);
    return new Response(
      JSON.stringify({
        error: "Backup failed",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
