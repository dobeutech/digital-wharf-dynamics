import type { Handler, HandlerEvent } from "@netlify/functions";
import { errorResponse, jsonResponse, readJson } from "./_http";
import { requireAuth, requirePermission } from "./_auth0";
import { getSupabaseClient } from "./_supabase";

function getClientIp(event: HandlerEvent): string | null {
  const raw =
    event.headers?.["x-forwarded-for"] || event.headers?.["X-Forwarded-For"];
  if (!raw) return null;
  return String(raw).split(",")[0]?.trim() || null;
}

export const handler: Handler = async (event) => {
  try {
    const supabase = getSupabaseClient();
    const id = event.queryStringParameters?.id?.trim();

    if (event.httpMethod === "POST") {
      // Public endpoint for website contact form. (Auth not required)
      const body = await readJson<{
        name?: string;
        email?: string;
        phone?: string | null;
        message?: string;
        smsConsent?: boolean;
        marketingConsent?: boolean;
      }>(event);

      const name = (body.name || "").trim();
      const email = (body.email || "").trim().toLowerCase();
      const message = (body.message || "").trim();
      const phone = body.phone ? String(body.phone).trim() : null;

      if (name.length < 2)
        return errorResponse(400, "Name must be at least 2 characters");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return errorResponse(400, "Please enter a valid email address");
      if (message.length < 10)
        return errorResponse(400, "Message must be at least 10 characters");
      if (phone && phone.length > 20)
        return errorResponse(400, "Phone must be less than 20 characters");

      const smsConsent = Boolean(body.smsConsent);
      if (phone && !smsConsent)
        return errorResponse(
          400,
          "SMS consent is required when providing a phone number",
        );

      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("contact_submissions")
        .insert({
          name,
          email,
          phone,
          message,
          sms_consent: smsConsent,
          marketing_consent: Boolean(body.marketingConsent),
          status: "new",
          notes: null,
          ip_address: getClientIp(event),
          user_agent:
            event.headers?.["user-agent"] ||
            event.headers?.["User-Agent"] ||
            null,
          submitted_at: now,
          responded_at: null,
          created_at: now,
        })
        .select()
        .single();

      if (error) {
        return errorResponse(500, "Failed to save submission", error.message);
      }

      return jsonResponse(200, {
        success: true,
        submission: data,
      });
    }

    // Admin endpoints
    const claims = await requireAuth(event);
    requirePermission(claims, "admin:access");

    if (event.httpMethod === "GET") {
      const status = event.queryStringParameters?.status;

      let query = supabase
        .from("contact_submissions")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (status && status !== "all") {
        query = query.eq("status", status);
      }

      const { data, error } = await query;

      if (error) {
        return errorResponse(500, "Failed to fetch submissions", error.message);
      }

      return jsonResponse(200, data);
    }

    if (event.httpMethod === "PATCH") {
      if (!id) return errorResponse(400, "Missing id");

      const body = await readJson<{
        notes?: string | null;
        status?: string;
      }>(event);

      const now = new Date().toISOString();
      const update: Record<string, unknown> = { updated_at: now };

      if (typeof body.notes === "string" || body.notes === null)
        update.notes = body.notes;
      if (typeof body.status === "string") {
        update.status = body.status;
        if (body.status === "responded") update.responded_at = now;
      }

      const { data, error } = await supabase
        .from("contact_submissions")
        .update(update)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return errorResponse(404, "Not found");
        }
        return errorResponse(500, "Failed to update submission", error.message);
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
