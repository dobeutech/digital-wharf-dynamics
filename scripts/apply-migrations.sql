-- Database Migration Application Script
-- Run this in Supabase SQL Editor to apply new migrations
-- Or use: supabase db push

-- Migration 1: Rate Limits Table
-- File: supabase/migrations/20251204000000_rate_limits_table.sql

-- Create rate_limits table for persistent rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier text NOT NULL UNIQUE, -- IP address or user ID
    count integer NOT NULL DEFAULT 1,
    window_start bigint NOT NULL, -- Timestamp in milliseconds
    reset_time timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON public.rate_limits(identifier);
CREATE INDEX IF NOT EXISTS idx_rate_limits_updated_at ON public.rate_limits(updated_at);

-- Enable RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only service role can manage rate limits
DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.rate_limits;
CREATE POLICY "Service role can manage rate limits"
ON public.rate_limits
FOR ALL
USING (auth.role() = 'service_role');

-- Add function to automatically clean up old records
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM public.rate_limits
    WHERE updated_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- Migration 2: Database Backups Table
-- File: supabase/migrations/20251204000001_database_backups_table.sql

-- Create database_backups table for storing backup records
CREATE TABLE IF NOT EXISTS public.database_backups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    backup_data jsonb NOT NULL, -- JSON object with table names as keys and arrays of records as values
    metadata jsonb NOT NULL, -- Contains timestamp, record count, etc.
    created_at timestamp with time zone DEFAULT now(),
    size_bytes bigint -- Approximate size of backup data
);

-- Create index for efficient querying by date
CREATE INDEX IF NOT EXISTS idx_database_backups_created_at ON public.database_backups(created_at DESC);

-- Enable RLS
ALTER TABLE public.database_backups ENABLE ROW LEVEL SECURITY;

-- Only service role can manage backups
DROP POLICY IF EXISTS "Service role can manage backups" ON public.database_backups;
CREATE POLICY "Service role can manage backups"
ON public.database_backups
FOR ALL
USING (auth.role() = 'service_role');

-- Function to calculate backup size
CREATE OR REPLACE FUNCTION calculate_backup_size(backup_data jsonb)
RETURNS bigint
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    RETURN pg_column_size(backup_data);
END;
$$;

-- Trigger to automatically calculate size on insert
CREATE OR REPLACE FUNCTION update_backup_size()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.size_bytes := calculate_backup_size(NEW.backup_data);
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_backup_size_trigger ON public.database_backups;
CREATE TRIGGER update_backup_size_trigger
BEFORE INSERT OR UPDATE ON public.database_backups
FOR EACH ROW
EXECUTE FUNCTION update_backup_size();

-- Verification queries
DO $$
BEGIN
    -- Check if tables were created
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rate_limits') THEN
        RAISE NOTICE '✅ rate_limits table created successfully';
    ELSE
        RAISE EXCEPTION '❌ rate_limits table creation failed';
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'database_backups') THEN
        RAISE NOTICE '✅ database_backups table created successfully';
    ELSE
        RAISE EXCEPTION '❌ database_backups table creation failed';
    END IF;

    RAISE NOTICE '✅ All migrations applied successfully!';
END $$;

