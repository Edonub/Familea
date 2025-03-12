/*
  # Fix mutable search path in handle_activity_publication function

  1. Changes
    - Drop existing function if exists
    - Create new function with schema qualification and SECURITY DEFINER
    - Update trigger to use schema-qualified function name
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS handle_activity_publication() CASCADE;
DROP FUNCTION IF EXISTS public.handle_activity_publication() CASCADE;

-- Create new function with schema qualification and SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.handle_activity_publication()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    NEW.published_at = CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger with schema-qualified function name
DROP TRIGGER IF EXISTS handle_activity_publication_trigger ON activities;
CREATE TRIGGER handle_activity_publication_trigger
  BEFORE UPDATE ON activities
  FOR EACH ROW
  WHEN (NEW.status IS DISTINCT FROM OLD.status)
  EXECUTE FUNCTION public.handle_activity_publication();