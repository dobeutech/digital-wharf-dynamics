import type { Handler } from '@netlify/functions';
import { errorResponse, jsonResponse } from './_http';
import { requireAuth } from './_auth0';
import { getMongoDb } from './_mongo';

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return jsonResponse(200, {}, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      });
    }

    if (event.httpMethod !== 'GET') {
      return errorResponse(405, 'Method not allowed');
    }

    const claims = await requireAuth(event);
    const db = await getMongoDb();
    const profiles = db.collection('profiles');

    const profile = await profiles.findOne({ auth_user_id: claims.sub });

    if (!profile) {
      // New user - needs phone verification
      return jsonResponse(200, {
        phone_verified: false,
        phone: null,
        is_new_user: true,
      });
    }

    return jsonResponse(200, {
      phone_verified: profile.phone_verified === true,
      phone: profile.phone || null,
      is_new_user: false,
    });
  } catch (err) {
    console.error('Check phone verification error:', err);
    if (err instanceof Error && err.message.includes('Missing Authorization')) {
      return errorResponse(401, 'Authentication required');
    }
    return errorResponse(500, 'Internal server error');
  }
};

