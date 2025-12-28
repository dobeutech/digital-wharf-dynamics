import type { Handler } from "@netlify/functions";
import { errorResponse, jsonResponse, readJson } from "./_http";
import { requireAuth } from "./_auth0";
import { getSupabaseClient } from "./_supabase";

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return jsonResponse(
        200,
        {},
        {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "authorization, content-type",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
        },
      );
    }

    if (event.httpMethod !== "POST") {
      return errorResponse(405, "Method not allowed");
    }

    const claims = await requireAuth(event);
    const supabase = getSupabaseClient();

    const body = await readJson<{ code?: string }>(event);
    const code = body.code?.trim();

    if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
      return errorResponse(400, "Invalid verification code format");
    }

    // Get user's profile to find the phone number
    const { data: profile } = await supabase
      .from("profiles")
      .select("phone")
      .eq("auth_user_id", claims.sub)
      .maybeSingle();

    if (!profile?.phone) {
      return errorResponse(
        400,
        "No phone number found. Please request a new code.",
      );
    }

    // Find the verification code in KV store
    const codeKey = `sms_code:${claims.sub}:${profile.phone}`;
    const { data: storedCode, error: fetchError } = await supabase
      .from("kv_store_050eebdd")
      .select("*")
      .eq("key", codeKey)
      .maybeSingle();

    if (fetchError || !storedCode) {
      return errorResponse(
        400,
        "No valid verification code found. Please request a new code.",
      );
    }

    const codeData = storedCode.value as {
      code: string;
      phone: string;
      expires_at: string;
      verified: boolean;
      attempts: number;
    };

    // Check if code has been verified already
    if (codeData.verified) {
      return errorResponse(
        400,
        "Code has already been used. Please request a new code.",
      );
    }

    // Check if code has expired
    if (new Date(codeData.expires_at) < new Date()) {
      return errorResponse(
        400,
        "Verification code has expired. Please request a new code.",
      );
    }

    // Check attempts
    if (codeData.attempts >= 5) {
      return errorResponse(
        429,
        "Too many verification attempts. Please request a new code.",
      );
    }

    // Verify code
    if (codeData.code !== code) {
      // Increment attempts
      const updatedData = { ...codeData, attempts: codeData.attempts + 1 };
      await supabase
        .from("kv_store_050eebdd")
        .update({ value: updatedData })
        .eq("key", codeKey);

      const remainingAttempts = 5 - (codeData.attempts + 1);
      return errorResponse(
        400,
        `Invalid verification code. ${remainingAttempts} attempt(s) remaining.`,
      );
    }

    // Code is correct - mark as verified
    const verifiedData = { ...codeData, verified: true };
    await supabase
      .from("kv_store_050eebdd")
      .update({ value: verifiedData })
      .eq("key", codeKey);

    // Update profile to mark phone as verified
    const now = new Date().toISOString();
    await supabase
      .from("profiles")
      .update({
        phone: codeData.phone,
        phone_verified: true,
        phone_verified_at: now,
      })
      .eq("auth_user_id", claims.sub);

    return jsonResponse(200, {
      success: true,
      message: "Phone number verified successfully",
    });
  } catch (err) {
    console.error("Verify SMS code error:", err);
    if (err instanceof Error && err.message.includes("Missing Authorization")) {
      return errorResponse(401, "Authentication required");
    }
    return errorResponse(500, "Internal server error");
  }
};
