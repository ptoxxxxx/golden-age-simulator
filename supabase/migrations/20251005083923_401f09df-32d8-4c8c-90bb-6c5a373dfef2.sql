-- Add preferred_initial_state column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS preferred_initial_state JSONB DEFAULT NULL;