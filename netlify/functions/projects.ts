import type { Handler } from "@netlify/functions";
import { ObjectId } from "mongodb";
import { errorResponse, jsonResponse, readJson } from "./_http";
import { requireAuth, requirePermission } from "./_auth0";
import { getMongoDb } from "./_mongo";

type ProjectDoc = {
  _id: ObjectId;
  user_id: string; // Auth0 subject
  title: string;
  description: string | null;
  status: string;
  progress_percentage: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
};

function toProject(d: ProjectDoc) {
  return {
    id: d._id.toHexString(),
    user_id: d.user_id,
    title: d.title,
    description: d.description,
    status: d.status,
    progress_percentage: d.progress_percentage,
    start_date: d.start_date,
    end_date: d.end_date,
    created_at: d.created_at,
    updated_at: d.updated_at,
  };
}

export const handler: Handler = async (event) => {
  try {
    const db = await getMongoDb();
    const col = db.collection<ProjectDoc>("projects");

    const claims = await requireAuth(event);

    const id = event.queryStringParameters?.id?.trim();
    const all = event.queryStringParameters?.all === "true";

    if (event.httpMethod === "GET") {
      if (id) {
        const doc = await col.findOne({ _id: new ObjectId(id) });
        if (!doc) return errorResponse(404, "Not found");
        // user can only read own project unless admin
        const isOwner = doc.user_id === claims.sub;
        const isAdmin = (claims.permissions || []).includes("admin:access");
        if (!isOwner && !isAdmin) return errorResponse(403, "Forbidden");
        return jsonResponse(200, toProject(doc));
      }

      if (all) {
        requirePermission(claims, "admin:access");
        const docs = await col.find({}).sort({ created_at: -1 }).toArray();
        return jsonResponse(200, docs.map(toProject));
      }

      const docs = await col
        .find({ user_id: claims.sub })
        .sort({ created_at: -1 })
        .toArray();
      return jsonResponse(200, docs.map(toProject));
    }

    // Create/update/delete: admin only for now
    requirePermission(claims, "admin:access");

    if (event.httpMethod === "POST") {
      const body = await readJson<
        Partial<ProjectDoc> & { user_id?: string; title?: string }
      >(event);
      if (!body.user_id || !body.title)
        return errorResponse(400, "Missing required fields: user_id, title");
      const now = new Date().toISOString();
      const doc: ProjectDoc = {
        _id: new ObjectId(),
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
      };
      await col.insertOne(doc);
      return jsonResponse(201, toProject(doc));
    }

    if (event.httpMethod === "PATCH" || event.httpMethod === "PUT") {
      if (!id) return errorResponse(400, "Missing id");
      const body = await readJson<Partial<ProjectDoc>>(event);
      const now = new Date().toISOString();
      const update: Record<string, unknown> = { ...body, updated_at: now };
      delete update._id;
      const res = await col.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: update },
        { returnDocument: "after" },
      );
      // @ts-expect-error driver response typing differs across versions
      const doc = (res?.value ?? res) as ProjectDoc | undefined;
      if (!doc) return errorResponse(404, "Not found");
      return jsonResponse(200, toProject(doc));
    }

    if (event.httpMethod === "DELETE") {
      if (!id) return errorResponse(400, "Missing id");
      const res = await col.deleteOne({ _id: new ObjectId(id) });
      return jsonResponse(200, { deleted: res.deletedCount === 1 });
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
