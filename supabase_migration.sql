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

