import type { Handler } from '@netlify/functions';
import { ObjectId } from 'mongodb';
import { errorResponse, jsonResponse, readJson } from './_http';
import { requireAuth, requirePermission } from './_auth0';
import { getMongoDb } from './_mongo';

type ServiceDoc = {
  _id: ObjectId;
  name: string;
  category: string;
  description?: string;
  base_price: number;
  features?: unknown;
  add_ons?: unknown;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

function toService(d: ServiceDoc) {
  return {
    id: d._id.toHexString(),
    name: d.name,
    category: d.category,
    description: d.description ?? '',
    base_price: d.base_price,
    features: d.features ?? null,
    add_ons: d.add_ons ?? null,
    is_active: d.is_active,
    created_at: d.created_at,
    updated_at: d.updated_at,
  };
}

export const handler: Handler = async (event) => {
  try {
    const db = await getMongoDb();
    const col = db.collection<ServiceDoc>('services');

    const id = event.queryStringParameters?.id?.trim();
    const onlyActive = event.queryStringParameters?.active === 'true';

    if (event.httpMethod === 'GET') {
      if (id) {
        let objectId: ObjectId;
        try {
          objectId = new ObjectId(id);
        } catch {
          return errorResponse(400, 'Invalid id');
        }
        const doc = await col.findOne({ _id: objectId });
        if (!doc) return errorResponse(404, 'Not found');
        return jsonResponse(200, toService(doc));
      }

      const cursor = col
        .find(onlyActive ? { is_active: true } : {})
        .sort({ category: 1, name: 1 });
      const docs = await cursor.toArray();
      return jsonResponse(200, docs.map(toService));
    }

    // Mutations require admin permission
    const claims = await requireAuth(event);
    requirePermission(claims, 'admin:access');

    if (event.httpMethod === 'POST') {
      const body = await readJson<Partial<ServiceDoc> & { name?: string; category?: string; base_price?: number }>(
        event
      );
      if (!body.name || !body.category || typeof body.base_price !== 'number') {
        return errorResponse(400, 'Missing required fields: name, category, base_price');
      }

      const now = new Date().toISOString();
      const doc = {
        _id: new ObjectId(),
        name: body.name,
        category: body.category,
        description: body.description ?? '',
        base_price: body.base_price,
        features: body.features ?? null,
        add_ons: body.add_ons ?? null,
        is_active: body.is_active ?? true,
        created_at: now,
        updated_at: now,
      } satisfies ServiceDoc;

      await col.insertOne(doc);
      return jsonResponse(201, toService(doc));
    }

    if (event.httpMethod === 'PUT' || event.httpMethod === 'PATCH') {
      if (!id) return errorResponse(400, 'Missing id');
      const body = await readJson<Partial<ServiceDoc>>(event);
      const now = new Date().toISOString();
      const update: Record<string, unknown> = { ...body, updated_at: now };
      delete update._id;

      const res = await col.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: update },
        { returnDocument: 'after' }
      );
      if (!res) return errorResponse(404, 'Not found');
      // mongodb driver returns { value } in older versions; in v6 it's { value }? keep compatible:
      // @ts-expect-error driver typing differs across versions
      const doc = (res.value ?? res) as ServiceDoc;
      return jsonResponse(200, toService(doc));
    }

    if (event.httpMethod === 'DELETE') {
      if (!id) return errorResponse(400, 'Missing id');
      let objectId: ObjectId;
      try {
        objectId = new ObjectId(id);
      } catch {
        return errorResponse(400, 'Invalid id');
      }
      const res = await col.deleteOne({ _id: objectId });
      return jsonResponse(200, { deleted: res.deletedCount === 1 });
    }

    return errorResponse(405, 'Method not allowed');
  } catch (err) {
    return errorResponse(500, 'Internal error', err instanceof Error ? err.message : String(err));
  }
};


