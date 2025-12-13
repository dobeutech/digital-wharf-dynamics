/**
 * Environment variable validation and configuration
 * Ensures all required environment variables are present and valid
 */

interface EnvConfig {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_PUBLISHABLE_KEY: string;
  // Add other environment variables as needed
}

const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
] as const;

/**
 * Validates that all required environment variables are present
 * @throws Error if any required variable is missing
 */
export function validateEnv(): EnvConfig {
  const missing: string[] = [];
  const config: Partial<EnvConfig> = {};

  for (const key of requiredEnvVars) {
    const value = import.meta.env[key];
    if (!value || value.trim() === '') {
      missing.push(key);
    } else {
      config[key] = value;
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file or environment configuration.'
    );
  }

  // Validate Supabase URL format
  if (config.VITE_SUPABASE_URL && !config.VITE_SUPABASE_URL.startsWith('https://')) {
    console.warn('VITE_SUPABASE_URL should start with https://');
  }

  // Validate Supabase key format (publishable keys typically start with eyJ)
  if (config.VITE_SUPABASE_PUBLISHABLE_KEY && !config.VITE_SUPABASE_PUBLISHABLE_KEY.startsWith('eyJ') && !config.VITE_SUPABASE_PUBLISHABLE_KEY.startsWith('sb_')) {
    console.warn('VITE_SUPABASE_PUBLISHABLE_KEY format may be incorrect');
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

