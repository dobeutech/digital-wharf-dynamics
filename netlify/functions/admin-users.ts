import type { Handler } from '@netlify/functions';
import { ObjectId } from 'mongodb';
import { errorResponse, jsonResponse, readJson } from './_http';
import { requireAuth, requirePermission } from './_auth0';
import { getMongoDb } from './_mongo';

type ProfileDoc = {
  _id: ObjectId;
  auth_user_id: string; // Auth0 subject
  username: string;
  created_at: string;
};

type UserRoleDoc = {
  _id: ObjectId;
  user_id: string; // Auth0 subject
  role: 'admin' | 'moderator' | 'user';
  created_at: string;
};

function toProfile(d: ProfileDoc) {
  return {
    id: d._id.toHexString(),
    auth_user_id: d.auth_user_id,
    username: d.username,
    created_at: d.created_at,
  };
}

export const handler: Handler = async (event) => {
  try {
    const claims = await requireAuth(event);
    requirePermission(claims, 'admin:access');

    const db = await getMongoDb();
    const profiles = db.collection<ProfileDoc>('profiles');
    const roles = db.collection<UserRoleDoc>('user_roles');

    if (event.httpMethod === 'GET') {
      const [profilesDocs, rolesDocs] = await Promise.all([
        profiles.find({}).sort({ created_at: -1 }).toArray(),
        roles.find({}).toArray(),
      ]);

      return jsonResponse(200, {
        profiles: profilesDocs.map(toProfile),
        roles: rolesDocs.map((r) => ({ user_id: r.user_id, role: r.role })),
      });
    }

    if (event.httpMethod === 'POST') {
      // Toggle role assignment (idempotent-ish).
      const rawBody = await readJson<unknown>(event);
      if (!rawBody || typeof rawBody !== 'object') {
        return errorResponse(400, 'Invalid JSON body');
      }
      const body = rawBody as { user_id?: string; role?: 'admin' | 'moderator' | 'user'; enabled?: boolean };
      if (!body.user_id || !body.role) return errorResponse(400, 'Missing user_id or role');
      const enabled = body.enabled !== false;
      const now = new Date().toISOString();

      if (!enabled) {
        await roles.deleteOne({ user_id: body.user_id, role: body.role });
        return jsonResponse(200, { user_id: body.user_id, role: body.role, enabled: false });
      }

      await roles.updateOne(
        { user_id: body.user_id, role: body.role },
        { $setOnInsert: { _id: new ObjectId(), user_id: body.user_id, role: body.role, created_at: now } },
        { upsert: true }
      );
      return jsonResponse(200, { user_id: body.user_id, role: body.role, enabled: true });
    }

    return errorResponse(405, 'Method not allowed');
  } catch (err) {
    return errorResponse(500, 'Internal error');
  }
};


