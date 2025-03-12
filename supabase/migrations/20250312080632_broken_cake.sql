/*
  # Fix mutable search path in handle_new_user function

  1. Changes
    - Drop existing function if exists
    - Create new function with schema qualification and SECURITY DEFINER
    - Update trigger to use schema-qualified function name
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create new function with schema qualification and SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.host_balances (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger with schema-qualified function name
DROP TRIGGER IF EXISTS handle_new_user ON profiles;
CREATE TRIGGER handle_new_user
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();