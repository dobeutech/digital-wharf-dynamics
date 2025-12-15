import type { Handler } from "@netlify/functions";
import { errorResponse, jsonResponse, readJson } from "./_http";
import { requireAuth } from "./_auth0";
import { getMongoDb } from "./_mongo";
import { ObjectId } from "mongodb";

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

const CODE_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 5;

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
    const db = await getMongoDb();
    const verificationCodes = db.collection<VerificationCodeDoc>(
      "sms_verification_codes",
    );
    const profiles = db.collection("profiles");

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
    const existingProfile = await profiles.findOne({
      auth_user_id: claims.sub,
    });
    if (
      existingProfile?.phone_verified &&
      existingProfile?.phone === normalizedPhone
    ) {
      return errorResponse(400, "This phone number is already verified");
    }

    // Check for recent code (rate limiting)
    const recentCode = await verificationCodes.findOne({
      user_id: claims.sub,
      phone: normalizedPhone,
      verified: false,
      expires_at: { $gt: new Date().toISOString() },
    });

    if (recentCode) {
      const expiresAt = new Date(recentCode.expires_at);
      const now = new Date();
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

    // Generate verification code
    const code = generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + CODE_EXPIRY_MINUTES);

    // Store code in database
    const codeDoc: VerificationCodeDoc = {
      _id: new ObjectId(),
      user_id: claims.sub,
      phone: normalizedPhone,
      code,
      expires_at: expiresAt.toISOString(),
      verified: false,
      attempts: 0,
      created_at: new Date().toISOString(),
    };

    await verificationCodes.insertOne(codeDoc);

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
      await profiles.updateOne(
        { auth_user_id: claims.sub },
        {
          $set: {
            phone: normalizedPhone,
            phone_verified: false,
            updated_at: new Date().toISOString(),
          },
          $setOnInsert: {
            _id: new ObjectId(),
            auth_user_id: claims.sub,
            username: claims.sub.split("|")[1] || "user",
            created_at: new Date().toISOString(),
          },
        },
        { upsert: true },
      );

      return jsonResponse(200, {
        success: true,
        message: "Verification code sent successfully",
        expires_in: CODE_EXPIRY_MINUTES * 60, // seconds
      });
    } catch (twilioError) {
      console.error("Twilio error:", twilioError);
      // Remove the code doc if SMS failed
      await verificationCodes.deleteOne({ _id: codeDoc._id });

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
