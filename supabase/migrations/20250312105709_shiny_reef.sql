-- Drop existing function and trigger
DROP TRIGGER IF EXISTS handle_activity_publication_trigger ON activities;
DROP FUNCTION IF EXISTS public.handle_activity_publication();

-- Create new function with proper security settings
CREATE OR REPLACE FUNCTION public.handle_activity_publication()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    NEW.published_at = CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER handle_activity_publication_trigger
  BEFORE UPDATE ON activities
  FOR EACH ROW
  WHEN (NEW.status IS DISTINCT FROM OLD.status)
  EXECUTE FUNCTION public.handle_activity_publication();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_activity_publication() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_activity_publication() TO service_role;