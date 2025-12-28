import type { Handler } from "@netlify/functions";
import { errorResponse, jsonResponse, readJson } from "./_http";
import { requireAuth, requirePermission } from "./_auth0";
import { getSupabaseClient } from "./_supabase";

export const handler: Handler = async (event) => {
  try {
    const supabase = getSupabaseClient();
    const claims = await requireAuth(event);

    if (event.httpMethod === "POST") {
      // Any authenticated user can write audit logs for themselves.
      const body = await readJson<{
        action?: string;
        entity_type?: string;
        entity_id?: string | null;
        old_values?: unknown;
        new_values?: unknown;
        user_agent?: string | null;
      }>(event);

      if (!body.action || !body.entity_type)
        return errorResponse(
          400,
          "Missing required fields: action, entity_type",
        );

      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("audit_logs")
        .insert({
          user_id: claims.sub,
          action: body.action,
          entity_type: body.entity_type,
          entity_id: body.entity_id ?? null,
          old_values: body.old_values ?? null,
          new_values: body.new_values ?? null,
          user_agent:
            body.user_agent ??
            (event.headers["user-agent"] || event.headers["User-Agent"] || null),
          created_at: now,
        })
        .select()
        .single();

      if (error) {
        return errorResponse(500, "Failed to create audit log", error.message);
      }

      return jsonResponse(201, data);
    }

    // Admin-only read access
    requirePermission(claims, "admin:access");

    if (event.httpMethod === "GET") {
      const action = event.queryStringParameters?.action;
      const entityType = event.queryStringParameters?.entity_type;
      const limitRaw = event.queryStringParameters?.limit;

      const limit = Math.min(Number(limitRaw || 100), 500);

      let query = supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (action && action !== "all") {
        query = query.eq("action", action);
      }
      if (entityType && entityType !== "all") {
        query = query.eq("entity_type", entityType);
      }

      const { data, error } = await query;

      if (error) {
        return errorResponse(500, "Failed to fetch audit logs", error.message);
      }

      return jsonResponse(200, data);
    }

    return errorResponse(405, "Method not allowed");
  } catch (err) {
    return errorResponse(
      500,
      "Internal error",
      err instanceof Error ? err.message : String(err),
    );
  }
};
