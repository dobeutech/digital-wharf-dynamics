import type { Handler, HandlerEvent } from "@netlify/functions";
import { ObjectId } from "mongodb";
import { errorResponse, jsonResponse, readJson } from "./_http";
import { requireAuth, requirePermission } from "./_auth0";
import { getMongoDb } from "./_mongo";

type ContactSubmissionDoc = {
  _id: ObjectId;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  sms_consent: boolean;
  marketing_consent: boolean;
  status: "new" | "read" | "responded" | "archived";
  notes: string | null;
  ip_address: string | null;
  user_agent: string | null;
  submitted_at: string;
  responded_at: string | null;
  created_at: string;
  updated_at: string;
};

function toSubmission(d: ContactSubmissionDoc) {
  return {
    id: d._id.toHexString(),
    name: d.name,
    email: d.email,
    phone: d.phone,
    message: d.message,
    sms_consent: d.sms_consent,
    marketing_consent: d.marketing_consent,
    status: d.status,
    notes: d.notes,
    ip_address: d.ip_address,
    user_agent: d.user_agent,
    submitted_at: d.submitted_at,
    responded_at: d.responded_at,
  };
}

function getClientIp(event: HandlerEvent): string | null {
  const raw =
    event.headers?.["x-forwarded-for"] || event.headers?.["X-Forwarded-For"];
  if (!raw) return null;
  return String(raw).split(",")[0]?.trim() || null;
}

export const handler: Handler = async (event) => {
  try {
    const db = await getMongoDb();
    const col = db.collection<ContactSubmissionDoc>("contact_submissions");

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
      const doc: ContactSubmissionDoc = {
        _id: new ObjectId(),
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
        updated_at: now,
      };

      await col.insertOne(doc);
      return jsonResponse(200, {
        success: true,
        submission: toSubmission(doc),
      });
    }

    // Admin endpoints
    const claims = await requireAuth(event);
    requirePermission(claims, "admin:access");

    if (event.httpMethod === "GET") {
      const status = event.queryStringParameters?.status;
      const q: Record<string, unknown> = {};
      if (status && status !== "all") q.status = status;
      const docs = await col.find(q).sort({ submitted_at: -1 }).toArray();
      return jsonResponse(200, docs.map(toSubmission));
    }

    if (event.httpMethod === "PATCH") {
      if (!id) return errorResponse(400, "Missing id");
      const body = await readJson<
        Partial<ContactSubmissionDoc> & { status?: string }
      >(event);
      const now = new Date().toISOString();
      const update: Record<string, unknown> = { updated_at: now };

      if (typeof body.notes === "string" || body.notes === null)
        update.notes = body.notes;
      if (typeof body.status === "string") {
        update.status = body.status;
        if (body.status === "responded") update.responded_at = now;
      }

      const res = await col.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: update },
        { returnDocument: "after" },
      );
      // @ts-expect-error driver response typing differs across versions
      const doc = (res?.value ?? res) as ContactSubmissionDoc | undefined;
      if (!doc) return errorResponse(404, "Not found");
      return jsonResponse(200, toSubmission(doc));
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
