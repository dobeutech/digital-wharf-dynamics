-- Add language tracking to contact submissions
-- This allows tracking user's preferred language while storing data in English for backend consistency

-- Add language column to contacts table if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'contacts') THEN
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'user_language') THEN
      ALTER TABLE contacts ADD COLUMN user_language VARCHAR(5) DEFAULT 'en';
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'original_message') THEN
      ALTER TABLE contacts ADD COLUMN original_message TEXT;
    END IF;
  END IF;
END $$;

-- Add language column to newsletter_subscribers table if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'newsletter_subscribers') THEN
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'newsletter_subscribers' AND column_name = 'user_language') THEN
      ALTER TABLE newsletter_subscribers ADD COLUMN user_language VARCHAR(5) DEFAULT 'en';
    END IF;
  END IF;
END $$;

-- Add language preference to user profiles if profiles table exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'preferred_language') THEN
      ALTER TABLE profiles ADD COLUMN preferred_language VARCHAR(5) DEFAULT 'en';
    END IF;
  END IF;
END $$;

-- Create a function to detect and store language metadata
CREATE OR REPLACE FUNCTION get_language_code(lang_input TEXT)
RETURNS VARCHAR(5) AS $$
BEGIN
  -- Normalize language codes
  CASE LOWER(TRIM(lang_input))
    WHEN 'en', 'english', 'en-us', 'en-gb' THEN RETURN 'en';
    WHEN 'es', 'spanish', 'español', 'es-es', 'es-mx' THEN RETURN 'es';
    WHEN 'fr', 'french', 'français', 'fr-fr', 'fr-ca' THEN RETURN 'fr';
    ELSE RETURN 'en'; -- Default to English
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create enum for supported languages if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'supported_language') THEN
    CREATE TYPE supported_language AS ENUM ('en', 'es', 'fr');
  END IF;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add comment for documentation
COMMENT ON FUNCTION get_language_code IS 'Normalizes language input to supported language codes (en, es, fr)';

-- Create language_preferences table for detailed tracking
CREATE TABLE IF NOT EXISTS language_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  preferred_language VARCHAR(5) NOT NULL DEFAULT 'en',
  browser_language VARCHAR(10),
  ip_country VARCHAR(2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on language_preferences
ALTER TABLE language_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own language preferences
CREATE POLICY IF NOT EXISTS "Users can read own language preferences" 
  ON language_preferences FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own language preferences
CREATE POLICY IF NOT EXISTS "Users can insert own language preferences" 
  ON language_preferences FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Users can update their own language preferences
CREATE POLICY IF NOT EXISTS "Users can update own language preferences" 
  ON language_preferences FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy: Admins can read all language preferences
CREATE POLICY IF NOT EXISTS "Admins can read all language preferences" 
  ON language_preferences FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_language_preferences_user_id ON language_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_language_preferences_session_id ON language_preferences(session_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_language_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_language_preferences_updated_at ON language_preferences;
CREATE TRIGGER trigger_update_language_preferences_updated_at
  BEFORE UPDATE ON language_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_language_preferences_updated_at();
