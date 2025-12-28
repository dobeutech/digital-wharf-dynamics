/**
 * Environment variable validation and configuration
 * Ensures all required environment variables are present and valid
 */

interface EnvConfig {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  // Add other environment variables as needed
}

const optionalEnvVars = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
] as const;

/**
 * Validates environment variables (optional for Supabase if using MongoDB)
 * @returns EnvConfig with optional Supabase variables
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
  const hasUrl = !!config.VITE_SUPABASE_URL;
  const hasKey = !!config.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!hasUrl || !hasKey) {
    console.warn(
      "Supabase environment variables are not set. " +
        "Some features may be disabled. " +
        "Note: This application uses Supabase for data storage and Auth0 for authentication.",
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
