/*
  # Fix Database Functions Security

  1. Changes
    - Add SECURITY DEFINER to all functions
    - Set explicit search_path for all functions
    - Add proper schema qualification
    - Update function permissions
    
  2. Functions Fixed
    - is_valid_iban
    - is_valid_phone
    - is_valid_email
    - handle_new_user
    - handle_updated_at
*/

-- Fix is_valid_iban function
CREATE OR REPLACE FUNCTION public.is_valid_iban(iban text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN iban IS NULL OR iban ~* '^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$';
END;
$$;

-- Fix is_valid_phone function
CREATE OR REPLACE FUNCTION public.is_valid_phone(phone text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN phone IS NULL OR phone ~* '^\+?[0-9]{9,15}$';
END;
$$;

-- Fix is_valid_email function
CREATE OR REPLACE FUNCTION public.is_valid_email(email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$;

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Set email from auth.users
  UPDATE public.profiles 
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
$$;

-- Fix handle_updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.is_valid_iban(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_valid_phone(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_valid_email(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO authenticated;

-- Recreate triggers to use schema-qualified function names
DO $$ 
BEGIN
  -- Profiles triggers
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

  -- Blog posts trigger
  DROP TRIGGER IF EXISTS handle_blog_posts_updated_at ON blog_posts;
  CREATE TRIGGER handle_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

  -- Comments trigger
  DROP TRIGGER IF EXISTS handle_comments_updated_at ON comments;
  CREATE TRIGGER handle_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

  -- Host balances trigger
  DROP TRIGGER IF EXISTS handle_host_balances_updated_at ON host_balances;
  CREATE TRIGGER handle_host_balances_updated_at
    BEFORE UPDATE ON host_balances
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

  -- Withdrawal requests trigger
  DROP TRIGGER IF EXISTS handle_withdrawal_requests_updated_at ON withdrawal_requests;
  CREATE TRIGGER handle_withdrawal_requests_updated_at
    BEFORE UPDATE ON withdrawal_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

  -- Experience schedules trigger
  DROP TRIGGER IF EXISTS handle_experience_schedules_updated_at ON experience_schedules;
  CREATE TRIGGER handle_experience_schedules_updated_at
    BEFORE UPDATE ON experience_schedules
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

  -- Experience pricing trigger
  DROP TRIGGER IF EXISTS handle_experience_pricing_updated_at ON experience_pricing;
  CREATE TRIGGER handle_experience_pricing_updated_at
    BEFORE UPDATE ON experience_pricing
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

  -- Auth config trigger
  DROP TRIGGER IF EXISTS handle_auth_config_updated_at ON auth_config;
  CREATE TRIGGER handle_auth_config_updated_at
    BEFORE UPDATE ON auth_config
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
END $$;