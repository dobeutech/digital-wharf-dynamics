import type { Handler } from '@netlify/functions';
import { errorResponse, jsonResponse, readJson } from './_http';
import { getMongoDb } from './_mongo';

type NewsletterSubscriberDoc = {
  _id: string;
  email: string;
  opted_in_marketing: boolean;
  is_active: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
};

// Simple in-memory rate limiting (resets on function restart)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(identifier, { count: 1, timestamp: now });
    return false;
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  record.count++;
  return false;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function getClientIp(event: any): string {
  const raw = event.headers?.['x-forwarded-for'] || event.headers?.['X-Forwarded-For'];
  if (!raw) return 'unknown';
  return String(raw).split(',')[0]?.trim() || 'unknown';
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return errorResponse(405, 'Method not allowed');
    }

    // Get client IP for rate limiting
    const clientIp = getClientIp(event);
    
    if (isRateLimited(clientIp)) {
      return errorResponse(429, 'Too many requests. Please try again later.');
    }

    const body = await readJson<{ email?: string; marketingConsent?: boolean }>(event);
    const { email, marketingConsent } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return errorResponse(400, 'Email is required');
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!validateEmail(trimmedEmail)) {
      return errorResponse(400, 'Invalid email format');
    }

    // Validate marketing consent
    if (marketingConsent !== true) {
      return errorResponse(400, 'Marketing consent is required');
    }

    const db = await getMongoDb();
    const col = db.collection<NewsletterSubscriberDoc>('newsletter_subscribers');

    // Check if email already exists
    const existing = await col.findOne({ email: trimmedEmail });

    if (existing) {
      if (existing.is_active) {
        return errorResponse(409, 'This email is already subscribed');
      }
      
      // Reactivate existing subscription
      const now = new Date().toISOString();
      await col.updateOne(
        { _id: existing._id },
        { 
          $set: { 
            is_active: true, 
            opted_in_marketing: true,
            unsubscribed_at: null,
            updated_at: now
          } 
        }
      );

      return jsonResponse(200, { success: true, message: 'Subscription reactivated successfully' });
    }

    // Insert new subscription
    const now = new Date().toISOString();
    const doc: NewsletterSubscriberDoc = {
      _id: trimmedEmail, // Use email as ID for simplicity
      email: trimmedEmail,
      opted_in_marketing: true,
      is_active: true,
      subscribed_at: now,
      unsubscribed_at: null,
      created_at: now,
      updated_at: now,
    };

    await col.insertOne(doc);

    return jsonResponse(200, { success: true, message: 'Subscribed successfully' });
  } catch (err) {
    // Do not expose internal error details to clients
    return errorResponse(500, 'Internal error');
  }
};

