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

CREATE TRIGGER update_backup_size_trigger
BEFORE INSERT OR UPDATE ON public.database_backups
FOR EACH ROW
EXECUTE FUNCTION update_backup_size();

