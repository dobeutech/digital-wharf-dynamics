import type { Handler } from "@netlify/functions";
import { errorResponse, jsonResponse, readJson } from "./_http";
import { requireAuth } from "./_auth0";
import { getSupabaseClient } from "./_supabase";

// Twilio client setup
function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials not configured");
  }

  // Dynamic import to avoid bundling issues
  return import("twilio").then((twilio) => {
    return twilio.default(accountSid, authToken);
  });
}

const CODE_EXPIRY_MINUTES = 10;

function generateVerificationCode(): string {
  // Generate 6-digit code
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function normalizePhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // If starts with 1, remove it (US country code)
  if (digits.length === 11 && digits.startsWith("1")) {
    return digits.substring(1);
  }

  // If 10 digits, return as is
  if (digits.length === 10) {
    return digits;
  }

  throw new Error("Invalid phone number format");
}

function formatPhoneForTwilio(phone: string): string {
  const normalized = normalizePhoneNumber(phone);
  return `+1${normalized}`; // US format
}

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

    const body = await readJson<{ phone?: string }>(event);
    const phone = body.phone?.trim();

    if (!phone) {
      return errorResponse(400, "Phone number is required");
    }

    // Validate phone number format
    let normalizedPhone: string;
    try {
      normalizedPhone = normalizePhoneNumber(phone);
    } catch (err) {
      return errorResponse(
        400,
        "Invalid phone number format. Please use a valid US phone number.",
      );
    }

    // Check if user already has verified phone
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", claims.sub)
      .maybeSingle();

    if (
      existingProfile?.phone_verified &&
      existingProfile?.phone === normalizedPhone
    ) {
      return errorResponse(400, "This phone number is already verified");
    }

    // Check for recent code (rate limiting) - using KV store
    const codeKey = `sms_code:${claims.sub}:${normalizedPhone}`;
    const { data: recentCode } = await supabase
      .from("kv_store_050eebdd")
      .select("*")
      .eq("key", codeKey)
      .maybeSingle();

    if (recentCode) {
      const codeData = recentCode.value as {
        code: string;
        expires_at: string;
        verified: boolean;
        attempts: number;
      };
      const expiresAt = new Date(codeData.expires_at);
      const now = new Date();

      if (!codeData.verified && expiresAt > now) {
        const minutesRemaining = Math.ceil(
          (expiresAt.getTime() - now.getTime()) / (1000 * 60),
        );

        if (minutesRemaining > 0) {
          return errorResponse(
            429,
            `Please wait ${minutesRemaining} minute(s) before requesting a new code`,
          );
        }
      }
    }

    // Generate verification code
    const code = generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + CODE_EXPIRY_MINUTES);

    // Store code in KV store
    const codeData = {
      code,
      phone: normalizedPhone,
      expires_at: expiresAt.toISOString(),
      verified: false,
      attempts: 0,
      created_at: new Date().toISOString(),
    };

    const { error: upsertError } = await supabase
      .from("kv_store_050eebdd")
      .upsert({ key: codeKey, value: codeData }, { onConflict: "key" });

    if (upsertError) {
      return errorResponse(500, "Failed to store verification code");
    }

    // Send SMS via Twilio
    try {
      const twilio = await getTwilioClient();
      const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

      if (!twilioPhoneNumber) {
        throw new Error("TWILIO_PHONE_NUMBER not configured");
      }

      const formattedPhone = formatPhoneForTwilio(normalizedPhone);
      const message = `Your DOBEU verification code is: ${code}. This code expires in ${CODE_EXPIRY_MINUTES} minutes.`;

      await twilio.messages.create({
        body: message,
        from: twilioPhoneNumber,
        to: formattedPhone,
      });

      // Update profile with phone (not verified yet)
      const now = new Date().toISOString();
      await supabase.from("profiles").upsert(
        {
          auth_user_id: claims.sub,
          phone: normalizedPhone,
          phone_verified: false,
          username: claims.sub.split("|")[1] || "user",
          created_at: now,
        },
        { onConflict: "auth_user_id" },
      );

      return jsonResponse(200, {
        success: true,
        message: "Verification code sent successfully",
        expires_in: CODE_EXPIRY_MINUTES * 60, // seconds
      });
    } catch (twilioError) {
      console.error("Twilio error:", twilioError);
      // Remove the code if SMS failed
      await supabase.from("kv_store_050eebdd").delete().eq("key", codeKey);

      return errorResponse(
        500,
        "Failed to send verification code. Please try again later.",
      );
    }
  } catch (err) {
    console.error("Send SMS verification error:", err);
    if (err instanceof Error && err.message.includes("Missing Authorization")) {
      return errorResponse(401, "Authentication required");
    }
    return errorResponse(500, "Internal server error");
  }
};
