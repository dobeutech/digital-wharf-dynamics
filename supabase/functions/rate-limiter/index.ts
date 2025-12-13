/**
 * Shared rate limiter utility for Supabase Edge Functions
 * Uses database for persistent rate limiting across function instances
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  identifier: string; // IP address or user ID
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

/**
 * Check rate limit using database for persistence
 */
export async function checkRateLimit(
  supabase: ReturnType<typeof createClient>,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const { maxRequests, windowMs, identifier } = config;
  const now = Date.now();
  const windowStart = now - windowMs;

  try {
    // Get or create rate limit record
    const { data: existing, error: fetchError } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('identifier', identifier)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // Error other than "not found" - allow request but log error
      console.error('Rate limit check error:', fetchError);
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs,
      };
    }

    if (!existing || existing.window_start < windowStart) {
      // New window or expired - reset
      const resetTime = now + windowMs;
      
      await supabase
        .from('rate_limits')
        .upsert({
          identifier,
          count: 1,
          window_start: now,
          reset_time: new Date(resetTime).toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'identifier',
        });

      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime,
      };
    }

    // Existing window - check count
    if (existing.count >= maxRequests) {
      const retryAfter = Math.ceil((existing.reset_time ? new Date(existing.reset_time).getTime() - now : windowMs) / 1000);
      return {
        allowed: false,
        remaining: 0,
        resetTime: existing.reset_time ? new Date(existing.reset_time).getTime() : now + windowMs,
        retryAfter: retryAfter > 0 ? retryAfter : undefined,
      };
    }

    // Increment count
    const newCount = existing.count + 1;
    await supabase
      .from('rate_limits')
      .update({
        count: newCount,
        updated_at: new Date().toISOString(),
      })
      .eq('identifier', identifier);

    return {
      allowed: true,
      remaining: maxRequests - newCount,
      resetTime: existing.reset_time ? new Date(existing.reset_time).getTime() : now + windowMs,
    };
  } catch (error) {
    console.error('Rate limit error:', error);
    // On error, allow request (fail open)
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
    };
  }
}

/**
 * Clean up old rate limit records (should be called periodically)
 */
export async function cleanupRateLimits(
  supabase: ReturnType<typeof createClient>,
  maxAgeMs: number = 24 * 60 * 60 * 1000 // 24 hours
): Promise<void> {
  const cutoff = new Date(Date.now() - maxAgeMs).toISOString();
  
  await supabase
    .from('rate_limits')
    .delete()
    .lt('updated_at', cutoff);
}

