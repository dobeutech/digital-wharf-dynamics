import type { Handler } from '@netlify/functions';
import { errorResponse, jsonResponse, readJson } from './_http';
import { requireAuth } from './_auth0';
import { getMongoDb } from './_mongo';
import { ObjectId } from 'mongodb';

type VerificationCodeDoc = {
  _id: ObjectId;
  user_id: string;
  phone: string;
  code: string;
  expires_at: string;
  verified: boolean;
  attempts: number;
  created_at: string;
};

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return jsonResponse(200, {}, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      });
    }

    if (event.httpMethod !== 'POST') {
      return errorResponse(405, 'Method not allowed');
    }

    const claims = await requireAuth(event);
    const db = await getMongoDb();
    const verificationCodes = db.collection<VerificationCodeDoc>('sms_verification_codes');
    const profiles = db.collection('profiles');

    const body = await readJson<{ code?: string }>(event);
    const code = body.code?.trim();

    if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
      return errorResponse(400, 'Invalid verification code format');
    }

    // Find the most recent unverified code for this user
    const codeDoc = await verificationCodes.findOne({
      user_id: claims.sub,
      verified: false,
      expires_at: { $gt: new Date().toISOString() },
    }, {
      sort: { created_at: -1 },
    });

    if (!codeDoc) {
      return errorResponse(400, 'No valid verification code found. Please request a new code.');
    }

    // Check if code has expired
    if (new Date(codeDoc.expires_at) < new Date()) {
      return errorResponse(400, 'Verification code has expired. Please request a new code.');
    }

    // Check attempts
    if (codeDoc.attempts >= 5) {
      return errorResponse(429, 'Too many verification attempts. Please request a new code.');
    }

    // Verify code
    if (codeDoc.code !== code) {
      // Increment attempts
      await verificationCodes.updateOne(
        { _id: codeDoc._id },
        { $inc: { attempts: 1 } }
      );

      const remainingAttempts = 5 - (codeDoc.attempts + 1);
      return errorResponse(400, `Invalid verification code. ${remainingAttempts} attempt(s) remaining.`);
    }

    // Code is correct - mark as verified
    await verificationCodes.updateOne(
      { _id: codeDoc._id },
      { $set: { verified: true } }
    );

    // Update profile to mark phone as verified
    await profiles.updateOne(
      { auth_user_id: claims.sub },
      {
        $set: {
          phone: codeDoc.phone,
          phone_verified: true,
          phone_verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      }
    );

    // Invalidate other unverified codes for this user
    await verificationCodes.updateMany(
      {
        user_id: claims.sub,
        verified: false,
        _id: { $ne: codeDoc._id },
      },
      {
        $set: { verified: true }, // Mark as "used" to prevent reuse
      }
    );

    return jsonResponse(200, {
      success: true,
      message: 'Phone number verified successfully',
    });
  } catch (err) {
    console.error('Verify SMS code error:', err);
    if (err instanceof Error && err.message.includes('Missing Authorization')) {
      return errorResponse(401, 'Authentication required');
    }
    return errorResponse(500, 'Internal server error');
  }
};

