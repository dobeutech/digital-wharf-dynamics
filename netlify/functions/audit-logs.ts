import type { Handler } from "@netlify/functions";
import { ObjectId } from "mongodb";
import { errorResponse, jsonResponse, readJson } from "./_http";
import { requireAuth, requirePermission } from "./_auth0";
import { getMongoDb } from "./_mongo";

type AuditLogDoc = {
  _id: ObjectId;
  user_id: string; // Auth0 subject
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_values: unknown | null;
  new_values: unknown | null;
  user_agent: string | null;
  created_at: string;
};

function toAuditLog(d: AuditLogDoc) {
  return {
    id: d._id.toHexString(),
    user_id: d.user_id,
    action: d.action,
    entity_type: d.entity_type,
    entity_id: d.entity_id,
    old_values: d.old_values,
    new_values: d.new_values,
    user_agent: d.user_agent,
    created_at: d.created_at,
  };
}

export const handler: Handler = async (event) => {
  try {
    const db = await getMongoDb();
    const col = db.collection<AuditLogDoc>("audit_logs");
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
      const doc: AuditLogDoc = {
        _id: new ObjectId(),
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
      };
      await col.insertOne(doc);
      return jsonResponse(201, toAuditLog(doc));
    }

    // Admin-only read access
    requirePermission(claims, "admin:access");

    if (event.httpMethod === "GET") {
      const action = event.queryStringParameters?.action;
      const entityType = event.queryStringParameters?.entity_type;
      const limitRaw = event.queryStringParameters?.limit;

      const limit = Math.min(Number(limitRaw || 100), 500);
      const q: Record<string, unknown> = {};
      if (action && action !== "all") q.action = action;
      if (entityType && entityType !== "all") q.entity_type = entityType;

      const docs = await col
        .find(q)
        .sort({ created_at: -1 })
        .limit(limit)
        .toArray();
      return jsonResponse(200, docs.map(toAuditLog));
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
