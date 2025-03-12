/*
  # Enable Password Security Features

  1. Changes
    - Enable compromised password check using HaveIBeenPwned
    - Set minimum password length
    - Configure password strength requirements
*/

-- Enable compromised password check
ALTER SYSTEM SET auth.enable_pwned_passwords = true;

-- Set minimum password length to 8 characters
ALTER SYSTEM SET auth.min_password_length = 8;

-- Require at least one uppercase letter, one lowercase letter, one number, and one special character
ALTER SYSTEM SET auth.password_strength_regex = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$';

-- Reload configuration
SELECT pg_reload_conf();