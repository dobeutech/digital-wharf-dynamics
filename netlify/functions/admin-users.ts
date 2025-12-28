import type { Handler } from "@netlify/functions";
import { errorResponse, jsonResponse, readJson } from "./_http";
import { requireAuth, requirePermission } from "./_auth0";
import { getSupabaseClient } from "./_supabase";

export const handler: Handler = async (event) => {
  try {
    const claims = await requireAuth(event);
    requirePermission(claims, "admin:access");

    const supabase = getSupabaseClient();

    if (event.httpMethod === "GET") {
      const [profilesResult, rolesResult] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role"),
      ]);

      if (profilesResult.error) {
        return errorResponse(
          500,
          "Failed to fetch profiles",
          profilesResult.error.message,
        );
      }

      if (rolesResult.error) {
        return errorResponse(
          500,
          "Failed to fetch roles",
          rolesResult.error.message,
        );
      }

      return jsonResponse(200, {
        profiles: profilesResult.data,
        roles: rolesResult.data,
      });
    }

    if (event.httpMethod === "POST") {
      // Toggle role assignment (idempotent-ish).
      const rawBody = await readJson<unknown>(event);
      if (!rawBody || typeof rawBody !== "object") {
        return errorResponse(400, "Invalid JSON body");
      }
      const body = rawBody as {
        user_id?: string;
        role?: "admin" | "moderator" | "user";
        enabled?: boolean;
      };
      if (!body.user_id || !body.role)
        return errorResponse(400, "Missing user_id or role");
      const enabled = body.enabled !== false;

      if (!enabled) {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", body.user_id)
          .eq("role", body.role);

        if (error) {
          return errorResponse(500, "Failed to remove role", error.message);
        }

        return jsonResponse(200, {
          user_id: body.user_id,
          role: body.role,
          enabled: false,
        });
      }

      // Upsert role
      const now = new Date().toISOString();
      const { error } = await supabase.from("user_roles").upsert(
        {
          user_id: body.user_id,
          role: body.role,
          created_at: now,
        },
        {
          onConflict: "user_id,role",
          ignoreDuplicates: true,
        },
      );

      if (error) {
        return errorResponse(500, "Failed to add role", error.message);
      }

      return jsonResponse(200, {
        user_id: body.user_id,
        role: body.role,
        enabled: true,
      });
    }

    return errorResponse(405, "Method not allowed");
  } catch (err) {
    return errorResponse(500, "Internal error");
  }
};
