import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { logError, ErrorSeverity, ErrorCategory } from "@/lib/error-handler";

/**
 * Performance-optimized admin status hook with reliability improvements
 * 
 * Optimizations:
 * 1. Caches admin status in memory to avoid repeated DB queries
 * 2. Uses maybeSingle() instead of single() to avoid errors when no role exists
 * 3. Implements cleanup to prevent state updates on unmounted components
 * 
 * Reliability improvements:
 * 1. Comprehensive error handling with categorization
 * 2. Defensive null/undefined checks
 * 3. Cache invalidation on errors
 * 4. Timeout protection for long-running queries
 * 5. Structured logging with context
 */

// In-memory cache for admin status (survives component remounts)
const adminCache = new Map<string, { status: boolean; timestamp: number }>();

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

// Query timeout in milliseconds (10 seconds)
const QUERY_TIMEOUT = 10 * 1000;

/**
 * Clears expired cache entries to prevent memory leaks
 */
function cleanExpiredCache(): void {
  const now = Date.now();
  for (const [userId, entry] of adminCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      adminCache.delete(userId);
    }
  }
}

/**
 * Creates a promise that rejects after a timeout
 */
function createTimeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Query timeout after ${ms}ms`)), ms);
  });
}

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const checkAdminStatus = async () => {
      // Defensive check: Ensure user object exists and has required properties
      if (!user || !user.id) {
        if (isMountedRef.current) {
          setIsAdmin(false);
          setLoading(false);
          setError(null);
        }
        return;
      }

      // Validate user ID format (UUID)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(user.id)) {
        const validationError = new Error(`Invalid user ID format: ${user.id}`);
        logError(validationError, {
          severity: ErrorSeverity.HIGH,
          category: ErrorCategory.VALIDATION,
          context: { userId: user.id, hook: 'useAdmin' },
        });
        
        if (isMountedRef.current) {
          setIsAdmin(false);
          setLoading(false);
          setError(validationError);
        }
        return;
      }

      try {
        // Clean expired cache entries periodically
        cleanExpiredCache();

        // Check cache first to avoid unnecessary DB query
        const cachedEntry = adminCache.get(user.id);
        if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL) {
          if (isMountedRef.current) {
            setIsAdmin(cachedEntry.status);
            setLoading(false);
            setError(null);
          }
          return;
        }

        // Race between query and timeout to prevent hanging
        const queryPromise = supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        const { data, error: queryError } = await Promise.race([
          queryPromise,
          createTimeout(QUERY_TIMEOUT),
        ]);

        // Check if component is still mounted before updating state
        if (!isMountedRef.current) return;

        if (queryError) {
          // Log error with full context for debugging
          logError(queryError, {
            severity: ErrorSeverity.MEDIUM,
            category: ErrorCategory.DATABASE,
            context: {
              userId: user.id,
              hook: 'useAdmin',
              operation: 'checkAdminStatus',
              errorCode: queryError.code,
              errorDetails: queryError.details,
            },
          });

          // On error, assume not admin for security (fail closed)
          setIsAdmin(false);
          setError(queryError);
          
          // Cache negative result briefly (1 minute) to avoid hammering DB on errors
          adminCache.set(user.id, { status: false, timestamp: Date.now() });
          setTimeout(() => adminCache.delete(user.id), 60 * 1000);
        } else {
          // Defensive check: Ensure data is valid before using
          const adminStatus = data !== null && data !== undefined && !!data;
          
          setIsAdmin(adminStatus);
          setError(null);
          
          // Cache the result with timestamp
          adminCache.set(user.id, { status: adminStatus, timestamp: Date.now() });
          
          // Schedule cache cleanup
          setTimeout(() => adminCache.delete(user.id), CACHE_TTL);
        }

        setLoading(false);
      } catch (err) {
        // Catch any unexpected errors (timeout, network issues, etc.)
        const error = err instanceof Error ? err : new Error(String(err));
        
        logError(error, {
          severity: ErrorSeverity.HIGH,
          category: ErrorCategory.UNKNOWN,
          context: {
            userId: user.id,
            hook: 'useAdmin',
            operation: 'checkAdminStatus',
          },
        });

        if (isMountedRef.current) {
          setIsAdmin(false);
          setLoading(false);
          setError(error);
        }
      }
    };

    checkAdminStatus();

    return () => {
      isMountedRef.current = false;
    };
  }, [user]);

  return { isAdmin, loading, error };
}
