import type { Handler } from "@netlify/functions";
import { errorResponse, jsonResponse } from "./_http";
import { requireAuth, requirePermission } from "./_auth0";
import { getSupabaseClient } from "./_supabase";

const STORAGE_BUCKET = "client-files";

export const handler: Handler = async (event) => {
  try {
    const claims = await requireAuth(event);
    const supabase = getSupabaseClient();

    const id = event.queryStringParameters?.id?.trim();
    const download = event.queryStringParameters?.download === "true";
    const userIdParam = event.queryStringParameters?.user_id?.trim();

    if (event.httpMethod !== "GET")
      return errorResponse(405, "Method not allowed");

    if (!id) {
      // List files (user can only list their own; admin can list any user if user_id passed)
      let userId = claims.sub;
      if (userIdParam && userIdParam !== claims.sub) {
        requirePermission(claims, "admin:access");
        userId = userIdParam;
      }

      const { data, error } = await supabase
        .from("client_files")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        return errorResponse(500, "Failed to fetch files", error.message);
      }

      return jsonResponse(200, data);
    }

    // Get single file
    const { data: file, error: fileError } = await supabase
      .from("client_files")
      .select("*")
      .eq("id", id)
      .single();

    if (fileError) {
      if (fileError.code === "PGRST116") {
        return errorResponse(404, "Not found");
      }
      return errorResponse(500, "Failed to fetch file", fileError.message);
    }

    const isOwner = file.user_id === claims.sub;
    const isAdmin = (claims.permissions || []).includes("admin:access");
    if (!isOwner && !isAdmin) return errorResponse(403, "Forbidden");

    if (!download) {
      return jsonResponse(200, file);
    }

    // Download file bytes from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(file.file_path);

    if (downloadError) {
      return errorResponse(
        500,
        "Failed to download file",
        downloadError.message,
      );
    }

    const arrayBuffer = await fileData.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);

    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: {
        "Content-Type": file.file_type || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(file.file_name)}"`,
        "Cache-Control": "private, max-age=0, must-revalidate",
      },
      body: buf.toString("base64"),
    };
  } catch (err) {
    return errorResponse(
      500,
      "Internal error",
      err instanceof Error ? err.message : String(err),
    );
  }
};
