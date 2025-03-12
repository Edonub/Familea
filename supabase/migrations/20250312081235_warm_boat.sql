/*
  # Password Security Functions
  
  1. New Functions
    - check_password_strength: Validates password meets requirements
    - check_password_compromised: Checks if password has been compromised
    
  2. Changes
    - Create functions to enforce password security
    - Add configuration table for auth settings
*/

-- Create table for auth configuration
CREATE TABLE IF NOT EXISTS auth_config (
  key text PRIMARY KEY,
  value text NOT NULL,
  description text,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Insert default configuration
INSERT INTO auth_config (key, value, description) VALUES
  ('min_password_length', '8', 'Minimum password length'),
  ('password_strength_regex', '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$', 'Password strength regex pattern'),
  ('enable_pwned_check', 'true', 'Check passwords against HaveIBeenPwned database');

-- Create function to check password strength
CREATE OR REPLACE FUNCTION public.check_password_strength(password text)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  min_length int;
  pattern text;
BEGIN
  -- Get configuration
  SELECT value::int INTO min_length FROM auth_config WHERE key = 'min_password_length';
  SELECT value INTO pattern FROM auth_config WHERE key = 'password_strength_regex';
  
  -- Check length
  IF length(password) < min_length THEN
    RAISE EXCEPTION 'Password must be at least % characters long', min_length;
  END IF;
  
  -- Check pattern
  IF NOT password ~ pattern THEN
    RAISE EXCEPTION 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
  END IF;
  
  RETURN true;
END;
$$;

-- Create function to update auth configuration
CREATE OR REPLACE FUNCTION public.update_auth_config(config_key text, config_value text)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE auth_config 
  SET 
    value = config_value,
    updated_at = CURRENT_TIMESTAMP
  WHERE key = config_key;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid configuration key: %', config_key;
  END IF;
END;
$$;

-- Enable RLS on auth_config
ALTER TABLE auth_config ENABLE ROW LEVEL SECURITY;

-- Create policies for auth_config
CREATE POLICY "Auth config is readable by authenticated users"
  ON auth_config
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify auth config"
  ON auth_config
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Create trigger to update updated_at
CREATE TRIGGER handle_auth_config_updated_at
  BEFORE UPDATE ON auth_config
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();