import type { Handler, HandlerEvent } from "@netlify/functions";
import { errorResponse, jsonResponse, readJson } from "./_http";
import { requireAuth, requirePermission } from "./_auth0";
import { getSupabaseClient } from "./_supabase";

type CCPARequest = {
  id: string;
  reference_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  request_types: string[];
  additional_info: string | null;
  response_deadline: string;
  status: "pending" | "in_progress" | "completed" | "rejected";
  notes: string | null;
  processed_at: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
};

// Rate limiting: Track requests per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 3; // 3 requests per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

// Valid request types
const VALID_REQUEST_TYPES = ["opt-out", "delete", "access", "correction"];

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

function generateReferenceId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CCPA-${timestamp}-${random}`;
}

function getClientIp(event: HandlerEvent): string | null {
  const raw =
    event.headers?.["x-forwarded-for"] || event.headers?.["X-Forwarded-For"];
  if (!raw) return null;
  return String(raw).split(",")[0]?.trim() || null;
}

function validateInput(data: unknown): {
  valid: boolean;
  errors: string[];
  sanitized?: Record<string, unknown>;
} {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Invalid request body"] };
  }

  const input = data as Record<string, unknown>;

  // Validate fullName
  if (typeof input.fullName !== "string" || input.fullName.trim().length < 2) {
    errors.push("Full name must be at least 2 characters");
  } else if (input.fullName.trim().length > 100) {
    errors.push("Full name must be less than 100 characters");
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof input.email !== "string" || !emailRegex.test(input.email.trim())) {
    errors.push("Please enter a valid email address");
  } else if (input.email.trim().length > 255) {
    errors.push("Email must be less than 255 characters");
  }

  // Validate phone (optional)
  if (input.phone !== undefined && input.phone !== null && input.phone !== "") {
    if (typeof input.phone !== "string" || input.phone.trim().length > 20) {
      errors.push("Phone must be less than 20 characters");
    }
  }

  // Validate address (optional)
  if (
    input.address !== undefined &&
    input.address !== null &&
    input.address !== ""
  ) {
    if (
      typeof input.address !== "string" ||
      input.address.trim().length > 500
    ) {
      errors.push("Address must be less than 500 characters");
    }
  }

  // Validate requestTypes
  if (!Array.isArray(input.requestTypes) || input.requestTypes.length === 0) {
    errors.push("At least one request type must be selected");
  } else {
    const invalidTypes = input.requestTypes.filter(
      (t) => !VALID_REQUEST_TYPES.includes(t),
    );
    if (invalidTypes.length > 0) {
      errors.push("Invalid request type selected");
    }
  }

  // Validate additionalInfo (optional)
  if (
    input.additionalInfo !== undefined &&
    input.additionalInfo !== null &&
    input.additionalInfo !== ""
  ) {
    if (
      typeof input.additionalInfo !== "string" ||
      input.additionalInfo.trim().length > 1000
    ) {
      errors.push("Additional information must be less than 1000 characters");
    }
  }

  // Validate confirmIdentity
  if (input.confirmIdentity !== true) {
    errors.push("You must confirm your identity");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Sanitize inputs
  const sanitized = {
    fullName: (input.fullName as string).trim(),
    email: (input.email as string).trim().toLowerCase(),
    phone: input.phone ? (input.phone as string).trim() : null,
    address: input.address ? (input.address as string).trim() : null,
    requestTypes: input.requestTypes as string[],
    additionalInfo: input.additionalInfo
      ? (input.additionalInfo as string).trim()
      : null,
  };

  return { valid: true, errors: [], sanitized };
}

function toResponse(d: CCPARequest) {
  return {
    id: d.id,
    reference_id: d.reference_id,
    full_name: d.full_name,
    email: d.email,
    phone: d.phone,
    address: d.address,
    request_types: d.request_types,
    additional_info: d.additional_info,
    status: d.status,
    notes: d.notes,
    response_deadline: d.response_deadline,
    processed_at: d.processed_at,
    submitted_at: d.created_at,
  };
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return jsonResponse(
        200,
        {},
        {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "authorization, content-type",
        },
      );
    }

    const supabase = getSupabaseClient();

    if (event.httpMethod === "POST") {
      // Get client IP for rate limiting
      const clientIP = getClientIp(event) || "unknown";

      // Check rate limit
      if (!checkRateLimit(clientIP)) {
        return errorResponse(429, "Too many requests. Please try again later.");
      }

      // Parse and validate input
      const body = await readJson(event);
      const validation = validateInput(body);

      if (!validation.valid) {
        return errorResponse(400, validation.errors.join(", "));
      }

      const { sanitized } = validation;

      // Generate reference ID and calculate response deadline (45 days per CCPA)
      const referenceId = generateReferenceId();
      const responseDeadline = new Date();
      responseDeadline.setDate(responseDeadline.getDate() + 45);

      const { error: insertError } = await supabase
        .from("ccpa_requests")
        .insert({
          reference_id: referenceId,
          full_name: sanitized!.fullName,
          email: sanitized!.email,
          phone: sanitized!.phone,
          address: sanitized!.address,
          request_types: sanitized!.requestTypes,
          additional_info: sanitized!.additionalInfo,
          response_deadline: responseDeadline.toISOString(),
          ip_address: clientIP,
          user_agent:
            event.headers?.["user-agent"] ||
            event.headers?.["User-Agent"] ||
            null,
        });

      if (insertError) {
        console.error("Database insert error:", insertError.message);
        return errorResponse(500, "Failed to submit request. Please try again.");
      }

      return jsonResponse(200, {
        success: true,
        referenceId,
        message: "Your CCPA request has been submitted successfully.",
        responseDeadline: responseDeadline.toISOString(),
      });
    }

    // Admin endpoints
    const claims = await requireAuth(event);
    requirePermission(claims, "admin:access");

    if (event.httpMethod === "GET") {
      const status = event.queryStringParameters?.status;

      let query = supabase
        .from("ccpa_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (status && status !== "all") {
        query = query.eq("status", status);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Database query error:", error.message);
        return errorResponse(500, "Failed to fetch requests");
      }

      return jsonResponse(200, (data || []).map(toResponse));
    }

    if (event.httpMethod === "PATCH") {
      const id = event.queryStringParameters?.id?.trim();
      if (!id) return errorResponse(400, "Missing id");

      const body = await readJson<
        Partial<CCPARequest> & { status?: string }
      >(event);

      const now = new Date().toISOString();
      const update: Record<string, unknown> = { updated_at: now };

      if (typeof body.notes === "string" || body.notes === null)
        update.notes = body.notes;

      if (typeof body.status === "string") {
        update.status = body.status;
        if (body.status === "completed" || body.status === "rejected") {
          update.processed_at = now;
        }
      }

      if (body.processed_at) {
        update.processed_at = body.processed_at;
      }

      const { data, error } = await supabase
        .from("ccpa_requests")
        .update(update)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Database update error:", error.message);
        return errorResponse(404, "Not found");
      }

      return jsonResponse(200, toResponse(data as CCPARequest));
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
