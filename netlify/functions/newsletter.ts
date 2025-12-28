import type { Handler } from "@netlify/functions";
import { errorResponse, jsonResponse, readJson } from "./_http";
import { requireAuth, requirePermission } from "./_auth0";
import { getSupabaseClient } from "./_supabase";

export const handler: Handler = async (event) => {
  try {
    const supabase = getSupabaseClient();
    const claims = await requireAuth(event);

    const id = event.queryStringParameters?.id?.trim();

    if (event.httpMethod === "GET") {
      // Members-only feed: published posts (public or not)
      let query = supabase
        .from("newsletter_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (id) {
        query = query.eq("id", id);
      }

      const { data, error } = await query;

      if (error) {
        return errorResponse(500, "Failed to fetch posts", error.message);
      }

      return jsonResponse(200, data);
    }

    // Admin manage posts
    requirePermission(claims, "admin:access");

    if (event.httpMethod === "POST") {
      const body = await readJson<{
        title?: string;
        excerpt?: string | null;
        content?: string;
        slug?: string;
        published_at?: string | null;
        is_published?: boolean;
        is_public?: boolean;
      }>(event);

      if (!body.title || !body.content || !body.slug)
        return errorResponse(
          400,
          "Missing required fields: title, content, slug",
        );

      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("newsletter_posts")
        .insert({
          title: body.title,
          excerpt: body.excerpt ?? null,
          content: body.content,
          slug: body.slug,
          published_at: body.published_at ?? null,
          is_published: body.is_published ?? false,
          is_public: body.is_public ?? false,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (error) {
        return errorResponse(500, "Failed to create post", error.message);
      }

      return jsonResponse(201, data);
    }

    if (event.httpMethod === "PATCH" || event.httpMethod === "PUT") {
      if (!id) return errorResponse(400, "Missing id");

      const body = await readJson<{
        title?: string;
        excerpt?: string | null;
        content?: string;
        slug?: string;
        published_at?: string | null;
        is_published?: boolean;
        is_public?: boolean;
      }>(event);

      const now = new Date().toISOString();
      const update: Record<string, unknown> = { updated_at: now };

      if (body.title !== undefined) update.title = body.title;
      if (body.excerpt !== undefined) update.excerpt = body.excerpt;
      if (body.content !== undefined) update.content = body.content;
      if (body.slug !== undefined) update.slug = body.slug;
      if (body.published_at !== undefined)
        update.published_at = body.published_at;
      if (body.is_published !== undefined)
        update.is_published = body.is_published;
      if (body.is_public !== undefined) update.is_public = body.is_public;

      const { data, error } = await supabase
        .from("newsletter_posts")
        .update(update)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return errorResponse(404, "Not found");
        }
        return errorResponse(500, "Failed to update post", error.message);
      }

      return jsonResponse(200, data);
    }

    if (event.httpMethod === "DELETE") {
      if (!id) return errorResponse(400, "Missing id");

      const { error } = await supabase
        .from("newsletter_posts")
        .delete()
        .eq("id", id);

      if (error) {
        return errorResponse(500, "Failed to delete post", error.message);
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
