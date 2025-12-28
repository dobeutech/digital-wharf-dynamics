import type { Handler } from "@netlify/functions";
import { errorResponse, jsonResponse, readJson } from "./_http";
import { requireAuth, requirePermission } from "./_auth0";
import { getSupabaseClient } from "./_supabase";

export const handler: Handler = async (event) => {
  try {
    const supabase = getSupabaseClient();
    const claims = await requireAuth(event);

    const id = event.queryStringParameters?.id?.trim();
    const all = event.queryStringParameters?.all === "true";

    if (event.httpMethod === "GET") {
      if (id) {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            return errorResponse(404, "Not found");
          }
          return errorResponse(500, "Failed to fetch project", error.message);
        }

        // user can only read own project unless admin
        const isOwner = data.user_id === claims.sub;
        const isAdmin = (claims.permissions || []).includes("admin:access");
        if (!isOwner && !isAdmin) return errorResponse(403, "Forbidden");

        return jsonResponse(200, data);
      }

      if (all) {
        requirePermission(claims, "admin:access");
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          return errorResponse(500, "Failed to fetch projects", error.message);
        }

        return jsonResponse(200, data);
      }

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", claims.sub)
        .order("created_at", { ascending: false });

      if (error) {
        return errorResponse(500, "Failed to fetch projects", error.message);
      }

      return jsonResponse(200, data);
    }

    // Create/update/delete: admin only for now
    requirePermission(claims, "admin:access");

    if (event.httpMethod === "POST") {
      const body = await readJson<{
        user_id?: string;
        title?: string;
        description?: string | null;
        status?: string;
        progress_percentage?: number;
        start_date?: string | null;
        end_date?: string | null;
      }>(event);

      if (!body.user_id || !body.title)
        return errorResponse(400, "Missing required fields: user_id, title");

      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("projects")
        .insert({
          user_id: body.user_id,
          title: body.title,
          description: body.description ?? null,
          status: body.status ?? "not_started",
          progress_percentage:
            typeof body.progress_percentage === "number"
              ? body.progress_percentage
              : 0,
          start_date: body.start_date ?? null,
          end_date: body.end_date ?? null,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (error) {
        return errorResponse(500, "Failed to create project", error.message);
      }

      return jsonResponse(201, data);
    }

    if (event.httpMethod === "PATCH" || event.httpMethod === "PUT") {
      if (!id) return errorResponse(400, "Missing id");

      const body = await readJson<{
        title?: string;
        description?: string | null;
        status?: string;
        progress_percentage?: number;
        start_date?: string | null;
        end_date?: string | null;
      }>(event);

      const now = new Date().toISOString();
      const update: Record<string, unknown> = { updated_at: now };

      if (body.title !== undefined) update.title = body.title;
      if (body.description !== undefined) update.description = body.description;
      if (body.status !== undefined) update.status = body.status;
      if (body.progress_percentage !== undefined)
        update.progress_percentage = body.progress_percentage;
      if (body.start_date !== undefined) update.start_date = body.start_date;
      if (body.end_date !== undefined) update.end_date = body.end_date;

      const { data, error } = await supabase
        .from("projects")
        .update(update)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return errorResponse(404, "Not found");
        }
        return errorResponse(500, "Failed to update project", error.message);
      }

      return jsonResponse(200, data);
    }

    if (event.httpMethod === "DELETE") {
      if (!id) return errorResponse(400, "Missing id");

      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) {
        return errorResponse(500, "Failed to delete project", error.message);
      }

      return jsonResponse(200, { deleted: true });
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
