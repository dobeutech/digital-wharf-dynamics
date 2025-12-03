import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";
import { Resend } from "https://esm.sh/resend@2.0.0";

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

async function sendEmails(resend: Resend, sanitized: Record<string, unknown>) {
  try {
    // Send confirmation email to submitter
    await resend.emails.send({
      from: 'Dobeu Tech Solutions <hello@updates.dobeu.cloud>',
      to: [sanitized.email as string],
      subject: 'We received your message - Dobeu Tech Solutions',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #EAB308;">Thank You for Reaching Out!</h1>
          <p>Dear ${sanitized.name},</p>
          <p>We have received your message and appreciate you contacting Dobeu Tech Solutions. Our team will review your inquiry and get back to you as soon as possible.</p>
          <div style="background: #f4f4f4; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>Your Message:</strong></p>
            <p style="margin: 8px 0; white-space: pre-wrap;">${sanitized.message}</p>
          </div>
          <p>In the meantime, feel free to explore our <a href="https://dobeu.cloud/services" style="color: #EAB308;">services</a> or check out our latest <a href="https://dobeu.cloud/news" style="color: #EAB308;">news and updates</a>.</p>
          <p>Best regards,<br><strong>The Dobeu Team</strong></p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">Dobeu Tech Solutions<br>This is an automated message. Please do not reply directly to this email.</p>
        </body>
        </html>
      `,
    });
    console.log(`Confirmation email sent to ${sanitized.email}`);

    // Send admin notification
    await resend.emails.send({
      from: 'Dobeu System <system@updates.dobeu.cloud>',
      to: ['contact@dobeu.cloud'],
      subject: `New Contact Form Submission from ${sanitized.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #EAB308;">New Contact Form Submission</h1>
          <div style="background: #f4f4f4; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>Name:</strong> ${sanitized.name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${sanitized.email}">${sanitized.email}</a></p>
            <p style="margin: 8px 0;"><strong>Phone:</strong> ${sanitized.phone || 'Not provided'}</p>
            <p style="margin: 8px 0;"><strong>SMS Consent:</strong> ${sanitized.smsConsent ? 'Yes' : 'No'}</p>
            <p style="margin: 8px 0;"><strong>Marketing Consent:</strong> ${sanitized.marketingConsent ? 'Yes' : 'No'}</p>
          </div>
          <div style="background: #fff; border: 1px solid #ddd; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Message:</strong></p>
            <p style="margin: 0; white-space: pre-wrap;">${sanitized.message}</p>
          </div>
          <p><a href="https://dobeu.cloud/admin/contacts" style="display: inline-block; background: #EAB308; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View in Admin Dashboard</a></p>
          <p><a href="mailto:${sanitized.email}?subject=Re: Your inquiry to Dobeu Tech Solutions" style="display: inline-block; background: #333; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-left: 8px;">Reply Directly</a></p>
        </body>
        </html>
      `,
    });
    console.log(`Admin notification sent for contact from ${sanitized.email}`);
  } catch (emailError) {
    console.error('Error sending emails:', emailError);
    // Don't fail the request if emails fail - the DB record is already created
  }
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

    // Send email notifications
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      await sendEmails(resend, sanitized!);
    } else {
      console.warn('RESEND_API_KEY not configured - skipping email notifications');
    }

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
