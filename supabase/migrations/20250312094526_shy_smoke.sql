/*
  # Fix Profiles Table Schema

  1. Changes
    - Add validation functions
    - Update profiles table schema
    - Fix foreign key dependencies
    - Update triggers and functions
    
  2. Security
    - Update RLS policies
    - Add proper validation
*/

-- Create validation functions if they don't exist
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

CREATE OR REPLACE FUNCTION public.is_valid_iban(iban text)
RETURNS boolean AS $$
BEGIN
  RETURN iban IS NULL OR iban ~* '^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing profiles table instead of recreating it
DO $$ 
BEGIN
  -- Add missing columns if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;
  END IF;

  -- Add or update constraints
  ALTER TABLE profiles 
    DROP CONSTRAINT IF EXISTS check_email_format,
    DROP CONSTRAINT IF EXISTS check_phone_format,
    DROP CONSTRAINT IF EXISTS check_bank_account_format;

  ALTER TABLE profiles
    ADD CONSTRAINT check_email_format 
      CHECK (email IS NULL OR public.is_valid_email(email)),
    ADD CONSTRAINT check_phone_format 
      CHECK (phone IS NULL OR public.is_valid_phone(phone)),
    ADD CONSTRAINT check_bank_account_format 
      CHECK (bank_account IS NULL OR public.is_valid_iban(bank_account));

  -- Add unique constraint on email if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_email_key'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);
  END IF;
END $$;

-- Create or replace handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Set email from auth.users
  UPDATE profiles 
  SET email = (
    SELECT email 
    FROM auth.users 
    WHERE id = NEW.id
  )
  WHERE id = NEW.id;
  
  -- Initialize host_balances
  INSERT INTO public.host_balances (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update triggers
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS handle_new_user ON profiles;

CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_new_user
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- Update RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

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

-- Update existing profiles with missing data
UPDATE profiles
SET 
  email = (
    SELECT email 
    FROM auth.users 
    WHERE auth.users.id = profiles.id
  )
WHERE email IS NULL;

-- Ensure all users have a host_balances entry
INSERT INTO host_balances (user_id)
SELECT id FROM profiles
WHERE NOT EXISTS (
  SELECT 1 FROM host_balances 
  WHERE host_balances.user_id = profiles.id
);