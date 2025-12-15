import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { create, getNumericDate } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type IntercomJwtResponse =
  | { token: string; expires_in: number }
  | { error: string };

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const intercomSecret = Deno.env.get(
      "INTERCOM_IDENTITY_VERIFICATION_SECRET",
    );
    if (!intercomSecret) {
      console.error("INTERCOM_IDENTITY_VERIFICATION_SECRET not configured");
      return new Response(
        JSON.stringify({
          error: "Intercom identity verification is not configured",
        } satisfies IntercomJwtResponse),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Get user from auth header (verify_jwt enabled in config.toml)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({
          error: "Authentication required",
        } satisfies IntercomJwtResponse),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User auth error:", userError);
      return new Response(
        JSON.stringify({
          error: "Authentication required",
        } satisfies IntercomJwtResponse),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Intercom Secure Mode payload
    // https://developers.intercom.com/docs/references/web/messenger/#identity-verification-for-web
    const expiresInSeconds = 60 * 60; // 1 hour

    const payload: Record<string, unknown> = {
      user_id: user.id,
      ...(user.email ? { email: user.email } : {}),
      iat: getNumericDate(0),
      exp: getNumericDate(expiresInSeconds),
    };

    // HS256 signing
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(intercomSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );

    const token = await create({ alg: "HS256", typ: "JWT" }, payload, key);

    return new Response(
      JSON.stringify({
        token,
        expires_in: expiresInSeconds,
      } satisfies IntercomJwtResponse),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("intercom-jwt error:", error);
    return new Response(
      JSON.stringify({ error: message } satisfies IntercomJwtResponse),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
