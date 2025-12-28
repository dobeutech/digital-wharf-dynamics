import type { Handler } from "@netlify/functions";
import { errorResponse, jsonResponse, readJson } from "./_http";
import { requireAuth, requirePermission } from "./_auth0";
import { getSupabaseClient } from "./_supabase";

export const handler: Handler = async (event) => {
  try {
    const supabase = getSupabaseClient();

    const id = event.queryStringParameters?.id?.trim();
    const slug = event.queryStringParameters?.slug?.trim();

    if (event.httpMethod === "GET") {
      let query = supabase
        .from("newsletter_posts")
        .select("*")
        .eq("is_published", true)
        .eq("is_public", true)
        .order("published_at", { ascending: false });

      if (id) {
        query = query.eq("id", id);
      }
      if (slug) {
        query = query.eq("slug", slug);
      }

      const { data, error } = await query;

      if (error) {
        return errorResponse(500, "Failed to fetch posts", error.message);
      }

      return jsonResponse(200, data);
    }

    // Admin write ops
    const claims = await requireAuth(event);
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
          is_public: body.is_public ?? true,
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

    return errorResponse(405, "Method not allowed");
  } catch (err) {
    return errorResponse(
      500,
      "Internal error",
      err instanceof Error ? err.message : String(err),
    );
  }
};
