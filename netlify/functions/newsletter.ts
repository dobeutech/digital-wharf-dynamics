import type { Handler } from '@netlify/functions';
import { ObjectId } from 'mongodb';
import { errorResponse, jsonResponse, readJson } from './_http';
import { requireAuth, requirePermission } from './_auth0';
import { getMongoDb } from './_mongo';

type NewsletterPostDoc = {
  _id: ObjectId;
  title: string;
  excerpt: string | null;
  content: string;
  slug: string;
  published_at: string | null;
  is_published: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

function toPost(d: NewsletterPostDoc) {
  return {
    id: d._id.toHexString(),
    title: d.title,
    excerpt: d.excerpt,
    content: d.content,
    slug: d.slug,
    published_at: d.published_at,
    is_published: d.is_published,
    is_public: d.is_public,
    created_at: d.created_at,
    updated_at: d.updated_at,
  };
}

export const handler: Handler = async (event) => {
  try {
    const db = await getMongoDb();
    const col = db.collection<NewsletterPostDoc>('newsletter_posts');
    const claims = await requireAuth(event);

    const id = event.queryStringParameters?.id?.trim();

    if (event.httpMethod === 'GET') {
      // Members-only feed: published posts (public or not)
      const q: Record<string, unknown> = { is_published: true };
      if (id) q._id = new ObjectId(id);
      const docs = await col.find(q).sort({ published_at: -1 }).toArray();
      return jsonResponse(200, docs.map(toPost));
    }

    // Admin manage posts
    requirePermission(claims, 'admin:access');

    if (event.httpMethod === 'POST') {
      const body = await readJson<Partial<NewsletterPostDoc> & { title?: string; content?: string; slug?: string }>(
        event
      );
      if (!body.title || !body.content || !body.slug) return errorResponse(400, 'Missing required fields: title, content, slug');
      const now = new Date().toISOString();
      const doc: NewsletterPostDoc = {
        _id: new ObjectId(),
        title: body.title,
        excerpt: body.excerpt ?? null,
        content: body.content,
        slug: body.slug,
        published_at: body.published_at ?? null,
        is_published: body.is_published ?? false,
        is_public: body.is_public ?? false,
        created_at: now,
        updated_at: now,
      };
      await col.insertOne(doc);
      return jsonResponse(201, toPost(doc));
    }

    if (event.httpMethod === 'PATCH' || event.httpMethod === 'PUT') {
      if (!id) return errorResponse(400, 'Missing id');
      const body = await readJson<Partial<NewsletterPostDoc>>(event);
      const now = new Date().toISOString();
      const update: Record<string, unknown> = { ...body, updated_at: now };
      delete update._id;
      const res = await col.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: update },
        { returnDocument: 'after' }
      );
      // @ts-expect-error driver response typing differs across versions
      const doc = (res?.value ?? res) as NewsletterPostDoc | undefined;
      if (!doc) return errorResponse(404, 'Not found');
      return jsonResponse(200, toPost(doc));
    }

    if (event.httpMethod === 'DELETE') {
      if (!id) return errorResponse(400, 'Missing id');
      const res = await col.deleteOne({ _id: new ObjectId(id) });
      return jsonResponse(200, { deleted: res.deletedCount === 1 });
    }

    return errorResponse(405, 'Method not allowed');
  } catch (err) {
    return errorResponse(500, 'Internal error', err instanceof Error ? err.message : String(err));
  }
};


