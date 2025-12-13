import type { Handler } from '@netlify/functions';
import { ObjectId } from 'mongodb';
import { errorResponse, jsonResponse, readJson } from './_http';
import { requireAuth, requirePermission } from './_auth0';
import { getMongoDb } from './_mongo';

type TaskDoc = {
  _id: ObjectId;
  project_id: string; // projects._id hex string
  title: string;
  description: string | null;
  is_completed: boolean;
  completed_at: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
};

function toTask(d: TaskDoc) {
  return {
    id: d._id.toHexString(),
    project_id: d.project_id,
    title: d.title,
    description: d.description,
    is_completed: d.is_completed,
    completed_at: d.completed_at,
    order_index: d.order_index,
    created_at: d.created_at,
    updated_at: d.updated_at,
  };
}

export const handler: Handler = async (event) => {
  try {
    const db = await getMongoDb();
    const tasks = db.collection<TaskDoc>('project_tasks');
    const projects = db.collection<{ _id: ObjectId; user_id: string }>('projects');

    const claims = await requireAuth(event);
    const id = event.queryStringParameters?.id?.trim();
    const projectId = event.queryStringParameters?.project_id?.trim();

    if (event.httpMethod === 'GET') {
      if (!projectId) return errorResponse(400, 'Missing project_id');
      const proj = await projects.findOne({ _id: new ObjectId(projectId) });
      if (!proj) return errorResponse(404, 'Project not found');
      const isOwner = proj.user_id === claims.sub;
      const isAdmin = (claims.permissions || []).includes('admin:access');
      if (!isOwner && !isAdmin) return errorResponse(403, 'Forbidden');

      const docs = await tasks.find({ project_id: projectId }).sort({ order_index: 1 }).toArray();
      return jsonResponse(200, docs.map(toTask));
    }

    if (event.httpMethod === 'PATCH') {
      if (!id) return errorResponse(400, 'Missing id');
      const body = await readJson<Partial<TaskDoc>>(event);

      // User can toggle completion for tasks on their own project; admin can do anything.
      const existing = await tasks.findOne({ _id: new ObjectId(id) });
      if (!existing) return errorResponse(404, 'Not found');
      const proj = await projects.findOne({ _id: new ObjectId(existing.project_id) });
      if (!proj) return errorResponse(404, 'Project not found');
      const isOwner = proj.user_id === claims.sub;
      const isAdmin = (claims.permissions || []).includes('admin:access');
      if (!isOwner && !isAdmin) return errorResponse(403, 'Forbidden');

      const now = new Date().toISOString();
      const update: Record<string, unknown> = { updated_at: now };

      if (typeof body.is_completed === 'boolean') {
        update.is_completed = body.is_completed;
        update.completed_at = body.is_completed ? now : null;
      }

      if (isAdmin) {
        if (typeof body.title === 'string') update.title = body.title;
        if (body.description === null || typeof body.description === 'string') update.description = body.description;
        if (typeof body.order_index === 'number') update.order_index = body.order_index;
      }

      const res = await tasks.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: update },
        { returnDocument: 'after' }
      );
      // @ts-expect-error driver response typing differs across versions
      const doc = (res?.value ?? res) as TaskDoc | undefined;
      if (!doc) return errorResponse(404, 'Not found');
      return jsonResponse(200, toTask(doc));
    }

    // Admin-only for create/delete
    requirePermission(claims, 'admin:access');

    if (event.httpMethod === 'POST') {
      const body = await readJson<Partial<TaskDoc> & { project_id?: string; title?: string }>(event);
      if (!body.project_id || !body.title) return errorResponse(400, 'Missing required fields: project_id, title');
      const now = new Date().toISOString();
      const doc: TaskDoc = {
        _id: new ObjectId(),
        project_id: body.project_id,
        title: body.title,
        description: body.description ?? null,
        is_completed: body.is_completed ?? false,
        completed_at: null,
        order_index: typeof body.order_index === 'number' ? body.order_index : 0,
        created_at: now,
        updated_at: now,
      };
      await tasks.insertOne(doc);
      return jsonResponse(201, toTask(doc));
    }

    if (event.httpMethod === 'DELETE') {
      if (!id) return errorResponse(400, 'Missing id');
      const res = await tasks.deleteOne({ _id: new ObjectId(id) });
      return jsonResponse(200, { deleted: res.deletedCount === 1 });
    }

    return errorResponse(405, 'Method not allowed');
  } catch (err) {
    return errorResponse(500, 'Internal error', err instanceof Error ? err.message : String(err));
  }
};


