import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting: Track requests per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // 5 requests per 15 minutes
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes in ms

// Duplicate detection window
const DUPLICATE_WINDOW = 5 * 60 * 1000; // 5 minutes in ms

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

// Sanitize input to prevent XSS
function sanitizeString(str: string): string {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

function validateInput(data: unknown): { valid: boolean; errors: string[]; sanitized?: Record<string, unknown> } {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid request body'] };
  }
  
  const input = data as Record<string, unknown>;
  
  // Validate name
  if (typeof input.name !== 'string' || input.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  } else if (input.name.trim().length > 100) {
    errors.push('Name must be less than 100 characters');
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
    if (typeof input.phone !== 'string') {
      errors.push('Invalid phone format');
    } else if (input.phone.trim().length > 20) {
      errors.push('Phone must be less than 20 characters');
    }
  }
  
  // Validate message
  if (typeof input.message !== 'string' || input.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  } else if (input.message.trim().length > 2000) {
    errors.push('Message must be less than 2000 characters');
  }
  
  // Validate smsConsent - required if phone is provided
  const hasPhone = input.phone && typeof input.phone === 'string' && input.phone.trim().length > 0;
  if (hasPhone && input.smsConsent !== true) {
    errors.push('SMS consent is required when providing a phone number');
  }
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  // Sanitize inputs
  const sanitized = {
    name: sanitizeString(input.name as string),
    email: (input.email as string).trim().toLowerCase(),
    phone: input.phone ? sanitizeString(input.phone as string) : null,
    message: sanitizeString(input.message as string),
    smsConsent: Boolean(input.smsConsent),
    marketingConsent: Boolean(input.marketingConsent),
  };
  
  return { valid: true, errors: [], sanitized };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP.substring(0, 8)}...`);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate input
    const body = await req.json();
    const validation = validateInput(body);
    
    if (!validation.valid) {
      console.log('Validation failed:', validation.errors);
      return new Response(
        JSON.stringify({ error: validation.errors.join(', ') }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { sanitized } = validation;
    
    // Initialize Supabase client with service role for inserting
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check for duplicate submissions (same email + message within 5 minutes)
    const duplicateCheckTime = new Date(Date.now() - DUPLICATE_WINDOW).toISOString();
    const { data: existingSubmissions } = await supabase
      .from('contact_submissions')
      .select('id')
      .eq('email', sanitized!.email)
      .eq('message', sanitized!.message)
      .gte('submitted_at', duplicateCheckTime)
      .limit(1);

    if (existingSubmissions && existingSubmissions.length > 0) {
      console.log('Duplicate submission detected');
      return new Response(
        JSON.stringify({ error: 'This message was already submitted. Please wait before submitting again.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert contact submission
    const { error: insertError } = await supabase
      .from('contact_submissions')
      .insert({
        name: sanitized!.name,
        email: sanitized!.email,
        phone: sanitized!.phone,
        message: sanitized!.message,
        sms_consent: sanitized!.smsConsent,
        marketing_consent: sanitized!.marketingConsent,
        ip_address: clientIP,
        user_agent: req.headers.get('user-agent') || null,
      });

    if (insertError) {
      console.error('Database insert error:', insertError.message);
      return new Response(
        JSON.stringify({ error: 'Failed to submit message. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Contact form submitted successfully from: ${sanitized!.email}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Thank you for your message! We will get back to you soon.'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing contact submission:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
