/*
  # Fix mutable search path in update_updated_at_column function

  1. Changes
    - Drop existing function if exists
    - Create new function with schema qualification
    - Update all triggers to use schema-qualified function name
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Create new function with schema qualification
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update triggers to use the new function
DO $$ 
BEGIN
  -- Update destinations trigger
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'handle_destinations_updated_at'
  ) THEN
    DROP TRIGGER handle_destinations_updated_at ON destinations;
    CREATE TRIGGER handle_destinations_updated_at
      BEFORE UPDATE ON destinations
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_updated_at();
  END IF;

  -- Update host_balances trigger
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'handle_host_balances_updated_at'
  ) THEN
    DROP TRIGGER handle_host_balances_updated_at ON host_balances;
    CREATE TRIGGER handle_host_balances_updated_at
      BEFORE UPDATE ON host_balances
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_updated_at();
  END IF;

  -- Update withdrawal_requests trigger
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'handle_withdrawal_requests_updated_at'
  ) THEN
    DROP TRIGGER handle_withdrawal_requests_updated_at ON withdrawal_requests;
    CREATE TRIGGER handle_withdrawal_requests_updated_at
      BEFORE UPDATE ON withdrawal_requests
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_updated_at();
  END IF;

  -- Update experience_schedules trigger
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'handle_experience_schedules_updated_at'
  ) THEN
    DROP TRIGGER handle_experience_schedules_updated_at ON experience_schedules;
    CREATE TRIGGER handle_experience_schedules_updated_at
      BEFORE UPDATE ON experience_schedules
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_updated_at();
  END IF;

  -- Update experience_pricing trigger
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'handle_experience_pricing_updated_at'
  ) THEN
    DROP TRIGGER handle_experience_pricing_updated_at ON experience_pricing;
    CREATE TRIGGER handle_experience_pricing_updated_at
      BEFORE UPDATE ON experience_pricing
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_updated_at();
  END IF;

  -- Update activities trigger
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_activities_updated_at'
  ) THEN
    DROP TRIGGER update_activities_updated_at ON activities;
    CREATE TRIGGER update_activities_updated_at
      BEFORE UPDATE ON activities
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_updated_at();
  END IF;

  -- Update blog_posts trigger
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'handle_blog_posts_updated_at'
  ) THEN
    DROP TRIGGER handle_blog_posts_updated_at ON blog_posts;
    CREATE TRIGGER handle_blog_posts_updated_at
      BEFORE UPDATE ON blog_posts
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_updated_at();
  END IF;

  -- Update comments trigger
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'handle_comments_updated_at'
  ) THEN
    DROP TRIGGER handle_comments_updated_at ON comments;
    CREATE TRIGGER handle_comments_updated_at
      BEFORE UPDATE ON comments
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_updated_at();
  END IF;

  -- Update profiles trigger
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'handle_profiles_updated_at'
  ) THEN
    DROP TRIGGER handle_profiles_updated_at ON profiles;
    CREATE TRIGGER handle_profiles_updated_at
      BEFORE UPDATE ON profiles
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;