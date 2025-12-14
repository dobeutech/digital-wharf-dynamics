import type { Handler } from '@netlify/functions';
import { ObjectId } from 'mongodb';
import { errorResponse, jsonResponse } from './_http';
import { requireAuth, requirePermission } from './_auth0';
import { getMongoDb } from './_mongo';
import { getGridFsBucket } from './_gridfs';

type ClientFileDoc = {
  _id: ObjectId;
  user_id: string; // Auth0 subject
  file_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
  expires_at: string;
  project_id: string | null;
  gridfs_id: ObjectId;
};

function toClientFile(d: ClientFileDoc) {
  return {
    id: d._id.toHexString(),
    user_id: d.user_id,
    file_name: d.file_name,
    file_type: d.file_type,
    file_size: d.file_size,
    created_at: d.created_at,
    expires_at: d.expires_at,
    project_id: d.project_id,
  };
}

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export const handler: Handler = async (event) => {
  try {
    const claims = await requireAuth(event);
    const db = await getMongoDb();
    const col = db.collection<ClientFileDoc>('client_files');

    const id = event.queryStringParameters?.id?.trim();
    const download = event.queryStringParameters?.download === 'true';
    const userIdParam = event.queryStringParameters?.user_id?.trim();

    if (event.httpMethod !== 'GET') return errorResponse(405, 'Method not allowed');

    if (!id) {
      // List files (user can only list their own; admin can list any user if user_id passed)
      let userId = claims.sub;
      if (userIdParam && userIdParam !== claims.sub) {
        requirePermission(claims, 'admin:access');
        userId = userIdParam;
      }

      const docs = await col.find({ user_id: userId }).sort({ created_at: -1 }).toArray();
      return jsonResponse(200, docs.map(toClientFile));
    }

    const doc = await col.findOne({ _id: new ObjectId(id) });
    if (!doc) return errorResponse(404, 'Not found');
    const isOwner = doc.user_id === claims.sub;
    const isAdmin = (claims.permissions || []).includes('admin:access');
    if (!isOwner && !isAdmin) return errorResponse(403, 'Forbidden');

    if (!download) {
      return jsonResponse(200, toClientFile(doc));
    }

    // Download file bytes from GridFS.
    const bucket = await getGridFsBucket();
    const stream = bucket.openDownloadStream(doc.gridfs_id);
    const buf = await streamToBuffer(stream);

    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: {
        'Content-Type': doc.file_type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(doc.file_name)}"`,
        'Cache-Control': 'private, max-age=0, must-revalidate',
      },
      body: buf.toString('base64'),
    };
  } catch (err) {
    return errorResponse(500, 'Internal error', err instanceof Error ? err.message : String(err));
  }
};


