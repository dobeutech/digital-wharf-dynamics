/**
 * Environment variable validation and configuration
 * Ensures all required environment variables are present and valid
 */

interface EnvConfig {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  VITE_AUTH0_DOMAIN?: string;
  VITE_AUTH0_CLIENT_ID?: string;
  VITE_AUTH0_AUDIENCE?: string;
}

const optionalEnvVars = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
  "VITE_AUTH0_DOMAIN",
  "VITE_AUTH0_CLIENT_ID",
  "VITE_AUTH0_AUDIENCE",
] as const;

/**
 * Validates environment variables
 * @returns EnvConfig with Supabase variables
 */
export function validateEnv(): EnvConfig {
  const config: Partial<EnvConfig> = {};

  for (const key of optionalEnvVars) {
    const value = import.meta.env[key];
    if (value && value.trim() !== "") {
      config[key] = value;
    }
  }

  // Warn if Supabase variables are missing (but don't throw)
  const hasSupabaseUrl = !!config.VITE_SUPABASE_URL;
  const hasSupabaseKey = !!config.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!hasSupabaseUrl || !hasSupabaseKey) {
    console.warn(
      "Supabase environment variables are not set. " +
        "Some features may be disabled. " +
        "Note: This application uses Supabase for data storage and Auth0 for authentication.",
    );
  }

  // Warn if Auth0 variables are missing (but don't throw)
  const hasAuth0Domain = !!config.VITE_AUTH0_DOMAIN;
  const hasAuth0ClientId = !!config.VITE_AUTH0_CLIENT_ID;

  if (!hasAuth0Domain || !hasAuth0ClientId) {
    console.warn(
      "Auth0 environment variables are not set. " +
        "Authentication features will be disabled. " +
        "Set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID to enable authentication.",
    );
  }

  // Validate Supabase URL format if provided
  if (
    config.VITE_SUPABASE_URL &&
    !config.VITE_SUPABASE_URL.startsWith("https://")
  ) {
    console.warn("VITE_SUPABASE_URL should start with https://");
  }

  // Validate Supabase key format if provided
  if (
    config.VITE_SUPABASE_PUBLISHABLE_KEY &&
    !config.VITE_SUPABASE_PUBLISHABLE_KEY.startsWith("eyJ") &&
    !config.VITE_SUPABASE_PUBLISHABLE_KEY.startsWith("sb_")
  ) {
    console.warn("VITE_SUPABASE_PUBLISHABLE_KEY format may be incorrect");
  }

  return config as EnvConfig;
}

/**
 * Get validated environment configuration
 * Call this at application startup
 */
export const env = validateEnv();

/**
 * Check if running in development mode
 */
export const isDev = import.meta.env.DEV;

/**
 * Check if running in production mode
 */
export const isProd = import.meta.env.PROD;

/**
 * Get the current mode (development, production, etc.)
 */
export const mode = import.meta.env.MODE;
