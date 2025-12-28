import type { Handler } from "@netlify/functions";
import { errorResponse, jsonResponse, readJson } from "./_http";
import { requireAuth, requirePermission } from "./_auth0";
import { getSupabaseClient } from "./_supabase";

export const handler: Handler = async (event) => {
  try {
    const supabase = getSupabaseClient();
    const claims = await requireAuth(event);

    const id = event.queryStringParameters?.id?.trim();
    const projectId = event.queryStringParameters?.project_id?.trim();

    if (event.httpMethod === "GET") {
      if (!projectId) return errorResponse(400, "Missing project_id");

      // Check project ownership
      const { data: proj, error: projError } = await supabase
        .from("projects")
        .select("id, user_id")
        .eq("id", projectId)
        .single();

      if (projError) {
        if (projError.code === "PGRST116") {
          return errorResponse(404, "Project not found");
        }
        return errorResponse(500, "Failed to fetch project", projError.message);
      }

      const isOwner = proj.user_id === claims.sub;
      const isAdmin = (claims.permissions || []).includes("admin:access");
      if (!isOwner && !isAdmin) return errorResponse(403, "Forbidden");

      const { data, error } = await supabase
        .from("project_tasks")
        .select("*")
        .eq("project_id", projectId)
        .order("order_index", { ascending: true });

      if (error) {
        return errorResponse(500, "Failed to fetch tasks", error.message);
      }

      return jsonResponse(200, data);
    }

    if (event.httpMethod === "PATCH") {
      if (!id) return errorResponse(400, "Missing id");

      const body = await readJson<{
        is_completed?: boolean;
        title?: string;
        description?: string | null;
        order_index?: number;
      }>(event);

      // Get existing task and check ownership
      const { data: existing, error: existingError } = await supabase
        .from("project_tasks")
        .select("*, projects!inner(user_id)")
        .eq("id", id)
        .single();

      if (existingError) {
        if (existingError.code === "PGRST116") {
          return errorResponse(404, "Not found");
        }
        return errorResponse(500, "Failed to fetch task", existingError.message);
      }

      const isOwner = existing.projects.user_id === claims.sub;
      const isAdmin = (claims.permissions || []).includes("admin:access");
      if (!isOwner && !isAdmin) return errorResponse(403, "Forbidden");

      const now = new Date().toISOString();
      const update: Record<string, unknown> = { updated_at: now };

      if (typeof body.is_completed === "boolean") {
        update.is_completed = body.is_completed;
        update.completed_at = body.is_completed ? now : null;
      }

      if (isAdmin) {
        if (typeof body.title === "string") update.title = body.title;
        if (body.description === null || typeof body.description === "string")
          update.description = body.description;
        if (typeof body.order_index === "number")
          update.order_index = body.order_index;
      }

      const { data, error } = await supabase
        .from("project_tasks")
        .update(update)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return errorResponse(500, "Failed to update task", error.message);
      }

      return jsonResponse(200, data);
    }

    // Admin-only for create/delete
    requirePermission(claims, "admin:access");

    if (event.httpMethod === "POST") {
      const body = await readJson<{
        project_id?: string;
        title?: string;
        description?: string | null;
        is_completed?: boolean;
        order_index?: number;
      }>(event);

      if (!body.project_id || !body.title)
        return errorResponse(400, "Missing required fields: project_id, title");

      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("project_tasks")
        .insert({
          project_id: body.project_id,
          title: body.title,
          description: body.description ?? null,
          is_completed: body.is_completed ?? false,
          completed_at: null,
          order_index:
            typeof body.order_index === "number" ? body.order_index : 0,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (error) {
        return errorResponse(500, "Failed to create task", error.message);
      }

      return jsonResponse(201, data);
    }

    if (event.httpMethod === "DELETE") {
      if (!id) return errorResponse(400, "Missing id");

      const { error } = await supabase
        .from("project_tasks")
        .delete()
        .eq("id", id);

      if (error) {
        return errorResponse(500, "Failed to delete task", error.message);
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
