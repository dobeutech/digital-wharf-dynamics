import type { Handler, HandlerEvent } from '@netlify/functions';
import { ObjectId } from 'mongodb';
import { errorResponse, jsonResponse, readJson } from './_http';
import { getMongoDb } from './_mongo';

type CCPARequestDoc = {
  _id: ObjectId;
  reference_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  request_types: string[];
  additional_info: string | null;
  response_deadline: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
};

// Rate limiting: Track requests per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 3; // 3 requests per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

// Valid request types
const VALID_REQUEST_TYPES = ['opt-out', 'delete', 'access', 'correction'];

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

function generateReferenceId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CCPA-${timestamp}-${random}`;
}

function getClientIp(event: HandlerEvent): string | null {
  const raw = event.headers?.['x-forwarded-for'] || event.headers?.['X-Forwarded-For'];
  if (!raw) return null;
  return String(raw).split(',')[0]?.trim() || null;
}

function validateInput(data: unknown): { valid: boolean; errors: string[]; sanitized?: Record<string, unknown> } {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid request body'] };
  }
  
  const input = data as Record<string, unknown>;
  
  // Validate fullName
  if (typeof input.fullName !== 'string' || input.fullName.trim().length < 2) {
    errors.push('Full name must be at least 2 characters');
  } else if (input.fullName.trim().length > 100) {
    errors.push('Full name must be less than 100 characters');
  }
  
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof input.email !== 'string' || !emailRegex.test(input.email.trim())) {
    errors.push('Please enter a valid email address');
  } else if (input.email.trim().length > 255) {
    errors.push('Email must be less than 255 characters');
  }
  
  // Validate phone (optional)
  if (input.phone !== undefined && input.phone !== null && input.phone !== '') {
    if (typeof input.phone !== 'string' || input.phone.trim().length > 20) {
      errors.push('Phone must be less than 20 characters');
    }
  }
  
  // Validate address (optional)
  if (input.address !== undefined && input.address !== null && input.address !== '') {
    if (typeof input.address !== 'string' || input.address.trim().length > 500) {
      errors.push('Address must be less than 500 characters');
    }
  }
  
  // Validate requestTypes
  if (!Array.isArray(input.requestTypes) || input.requestTypes.length === 0) {
    errors.push('At least one request type must be selected');
  } else {
    const invalidTypes = input.requestTypes.filter(t => !VALID_REQUEST_TYPES.includes(t));
    if (invalidTypes.length > 0) {
      errors.push('Invalid request type selected');
    }
  }
  
  // Validate additionalInfo (optional)
  if (input.additionalInfo !== undefined && input.additionalInfo !== null && input.additionalInfo !== '') {
    if (typeof input.additionalInfo !== 'string' || input.additionalInfo.trim().length > 1000) {
      errors.push('Additional information must be less than 1000 characters');
    }
  }
  
  // Validate confirmIdentity
  if (input.confirmIdentity !== true) {
    errors.push('You must confirm your identity');
  }
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  // Sanitize inputs
  const sanitized = {
    fullName: (input.fullName as string).trim(),
    email: (input.email as string).trim().toLowerCase(),
    phone: input.phone ? (input.phone as string).trim() : null,
    address: input.address ? (input.address as string).trim() : null,
    requestTypes: input.requestTypes as string[],
    additionalInfo: input.additionalInfo ? (input.additionalInfo as string).trim() : null,
  };
  
  return { valid: true, errors: [], sanitized };
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return jsonResponse(200, {}, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      });
    }

    if (event.httpMethod !== 'POST') {
      return errorResponse(405, 'Method not allowed');
    }

    // Get client IP for rate limiting
    const clientIP = getClientIp(event) || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return errorResponse(429, 'Too many requests. Please try again later.');
    }

    // Parse and validate input
    const body = await readJson(event);
    const validation = validateInput(body);
    
    if (!validation.valid) {
      return errorResponse(400, validation.errors.join(', '));
    }

    const { sanitized } = validation;
    
    // Generate reference ID and calculate response deadline (45 days per CCPA)
    const referenceId = generateReferenceId();
    const responseDeadline = new Date();
    responseDeadline.setDate(responseDeadline.getDate() + 45);

    const db = await getMongoDb();
    const col = db.collection<CCPARequestDoc>('ccpa_requests');

    const now = new Date().toISOString();
    const doc: CCPARequestDoc = {
      _id: new ObjectId(),
      reference_id: referenceId,
      full_name: sanitized!.fullName,
      email: sanitized!.email,
      phone: sanitized!.phone,
      address: sanitized!.address,
      request_types: sanitized!.requestTypes,
      additional_info: sanitized!.additionalInfo,
      response_deadline: responseDeadline.toISOString(),
      status: 'pending',
      ip_address: clientIP,
      user_agent: event.headers?.['user-agent'] || event.headers?.['User-Agent'] || null,
      created_at: now,
      updated_at: now,
    };

    await col.insertOne(doc);

    return jsonResponse(200, { 
      success: true, 
      referenceId,
      message: 'Your CCPA request has been submitted successfully.',
      responseDeadline: responseDeadline.toISOString()
    });
  } catch (err) {
    return errorResponse(500, 'Internal error', err instanceof Error ? err.message : String(err));
  }
};

