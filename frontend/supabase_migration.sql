-- Create registrations table for Hack the Bias pre-registration
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);

-- Enable Row Level Security (optional, but recommended)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role to do everything (for server-side operations)
-- Note: Since we're using service_role key on the server, this is already allowed
-- This policy is for if you want to allow client-side reads later
CREATE POLICY "Allow service role full access" ON registrations
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- Users table for extended user data (references auth.users)
-- ============================================================================
-- This table stores additional user metadata like is_admin
-- The is_admin column can only be manually edited in Supabase, never through the application

CREATE TABLE IF NOT EXISTS public.users (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access to users table
CREATE POLICY "Allow service role full access" ON public.users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Trigger to automatically create a users row when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id)
  VALUES (new.id);
  RETURN new;
END;
$$;

-- Create trigger (drop first if exists to avoid errors on re-run)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

