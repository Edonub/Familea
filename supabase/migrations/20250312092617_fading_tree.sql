/*
  # Fix Profile Schema and Triggers

  1. Changes
    - Add missing columns to profiles table
    - Fix trigger functions
    - Update RLS policies
    - Add validation functions
    
  2. Security
    - Enable RLS
    - Add policies for secure access
*/

-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS handle_new_user ON profiles;

-- Add missing columns if they don't exist
DO $$ 
BEGIN
  -- Add email column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email text;
  END IF;

  -- Add created_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;

  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create or replace handle_updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Initialize host_balances for new user
  INSERT INTO public.host_balances (user_id)
  VALUES (NEW.id);
  
  -- Set email from auth.users
  UPDATE profiles 
  SET email = (
    SELECT email 
    FROM auth.users 
    WHERE id = NEW.id
  )
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate triggers
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_new_user
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Los perfiles son visibles para todos" ON profiles;
DROP POLICY IF EXISTS "Los usuarios pueden editar su propio perfil" ON profiles;

CREATE POLICY "Los perfiles son visibles para todos"
  ON profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Los usuarios pueden editar su propio perfil"
  ON profiles
  FOR UPDATE
  TO public
  USING (auth.uid() = id);

-- Add validation functions
CREATE OR REPLACE FUNCTION public.is_valid_email(email text)
RETURNS boolean AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_valid_phone(phone text)
RETURNS boolean AS $$
BEGIN
  RETURN phone IS NULL OR phone ~* '^\+?[0-9]{9,15}$';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add validation constraints
ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS check_email_format,
  DROP CONSTRAINT IF EXISTS check_phone_format;

ALTER TABLE profiles
  ADD CONSTRAINT check_email_format 
    CHECK (email IS NULL OR public.is_valid_email(email)),
  ADD CONSTRAINT check_phone_format 
    CHECK (phone IS NULL OR public.is_valid_phone(phone));