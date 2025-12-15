import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Simple rate limiting using in-memory store (resets on function restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 3; // 3 requests per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return false;
  }

  if (record.count >= RATE_LIMIT) {
    return true;
  }

  record.count++;
  return false;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !email ||
      typeof email !== "string" ||
      !emailRegex.test(email) ||
      email.length > 255
    ) {
      return new Response(JSON.stringify({ error: "Invalid email address" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limiting by email
    if (isRateLimited(email.toLowerCase())) {
      console.log(`Rate limit exceeded for email: ${email.substring(0, 3)}***`);
      // Return success anyway to prevent email enumeration
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Get the origin from the request headers
    const origin = req.headers.get("origin") || "https://dobeu.net";

    // Generate password reset link using Supabase Admin API
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: email.toLowerCase(),
      options: {
        redirectTo: `${origin}/reset-password`,
      },
    });

    if (error) {
      console.error("Error generating reset link:", error);
      // Return success anyway to prevent email enumeration
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send reset email via Resend
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    const { error: emailError } = await resend.emails.send({
      from: "Dobeu Tech Solutions <onboarding@resend.dev>",
      to: [email],
      subject: "Reset Your Password - Dobeu Tech Solutions",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f5;">
          <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h1 style="color: #18181b; margin: 0 0 16px; font-size: 24px;">Password Reset Request</h1>
            <p style="color: #52525b; line-height: 1.6; margin: 0 0 24px;">
              We received a request to reset your password for your Dobeu Tech Solutions account.
            </p>
            <a href="${data.properties.action_link}" 
               style="display: inline-block; background-color: #eab308; color: #18181b; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; margin-bottom: 24px;">
              Reset Password
            </a>
            <p style="color: #71717a; font-size: 14px; line-height: 1.6; margin: 24px 0 0;">
              This link will expire in 1 hour. If you didn't request this password reset, you can safely ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 24px 0;">
            <p style="color: #a1a1aa; font-size: 12px; margin: 0;">
              Dobeu Tech Solutions<br>
              This is an automated message, please do not reply.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (emailError) {
      console.error("Error sending reset email:", emailError);
    } else {
      console.log(`Password reset email sent to: ${email.substring(0, 3)}***`);
    }

    // Always return success to prevent email enumeration
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return new Response(
      JSON.stringify({ success: true }), // Return success to prevent enumeration
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
