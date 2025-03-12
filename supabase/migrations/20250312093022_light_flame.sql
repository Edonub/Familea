/*
  # Fix Profiles Table and Triggers

  1. Changes
    - Drop and recreate profiles table with correct schema
    - Add proper constraints and defaults
    - Fix triggers and functions
    
  2. Security
    - Update RLS policies
    - Add proper validation
*/

-- Drop existing triggers
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS handle_new_user ON profiles;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create or replace handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Set email from auth.users
  NEW.email := (
    SELECT email 
    FROM auth.users 
    WHERE id = NEW.id
  );
  
  -- Initialize host_balances
  INSERT INTO public.host_balances (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate profiles table with correct schema
CREATE TABLE IF NOT EXISTS public.profiles_new (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  email text UNIQUE,
  avatar_url text,
  phone text,
  address text,
  bank_account text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT check_email_format CHECK (email IS NULL OR public.is_valid_email(email)),
  CONSTRAINT check_phone_format CHECK (phone IS NULL OR public.is_valid_phone(phone))
);

-- Copy data if old table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    INSERT INTO profiles_new (
      id, first_name, last_name, email, avatar_url, phone, address, 
      bank_account, is_admin, created_at, updated_at
    )
    SELECT 
      id, first_name, last_name, email, avatar_url, phone, address,
      bank_account, is_admin, created_at, updated_at
    FROM profiles
    ON CONFLICT (id) DO NOTHING;
    
    -- Drop old table
    DROP TABLE profiles;
  END IF;
END $$;

-- Rename new table to profiles
ALTER TABLE IF EXISTS profiles_new RENAME TO profiles;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create triggers
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_new_user
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();