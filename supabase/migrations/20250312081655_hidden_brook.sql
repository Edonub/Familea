/*
  # Schema Improvements
  
  1. New Indexes
    - Add missing indexes for foreign keys and commonly queried fields
    
  2. Constraints
    - Add check constraints for data validation
    
  3. Validation Functions
    - Add functions for email, phone and IBAN validation
*/

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_activity_id ON comments(activity_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_host_balances_user_id ON host_balances(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_status ON withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_experience_schedules_date ON experience_schedules(date);
CREATE INDEX IF NOT EXISTS idx_experience_pricing_date_range ON experience_pricing(date_from, date_to);

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop comments policies
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'comments' 
    AND policyname = 'Los comentarios son visibles para todos'
  ) THEN
    DROP POLICY "Los comentarios son visibles para todos" ON comments;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'comments' 
    AND policyname = 'Los usuarios pueden crear comentarios'
  ) THEN
    DROP POLICY "Los usuarios pueden crear comentarios" ON comments;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'comments' 
    AND policyname = 'Los usuarios pueden editar sus comentarios'
  ) THEN
    DROP POLICY "Los usuarios pueden editar sus comentarios" ON comments;
  END IF;

  -- Drop blog_posts policies
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'blog_posts' 
    AND policyname = 'Los posts publicados son visibles para todos'
  ) THEN
    DROP POLICY "Los posts publicados son visibles para todos" ON blog_posts;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'blog_posts' 
    AND policyname = 'Los autores pueden crear posts'
  ) THEN
    DROP POLICY "Los autores pueden crear posts" ON blog_posts;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'blog_posts' 
    AND policyname = 'Los autores pueden actualizar sus posts'
  ) THEN
    DROP POLICY "Los autores pueden actualizar sus posts" ON blog_posts;
  END IF;
END $$;

-- Create new policies
CREATE POLICY "Los comentarios son visibles para todos"
  ON comments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Los usuarios pueden crear comentarios"
  ON comments
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden editar sus comentarios"
  ON comments
  FOR UPDATE
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Los posts publicados son visibles para todos"
  ON blog_posts
  FOR SELECT
  TO public
  USING ((published = true) OR (auth.uid() = author_id));

CREATE POLICY "Los autores pueden crear posts"
  ON blog_posts
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Los autores pueden actualizar sus posts"
  ON blog_posts
  FOR UPDATE
  TO public
  USING (auth.uid() = author_id);

-- Add check constraints
DO $$ 
BEGIN
  -- Add blog_posts constraints
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'check_excerpt_length'
  ) THEN
    ALTER TABLE blog_posts 
    ADD CONSTRAINT check_excerpt_length 
    CHECK (length(excerpt) <= 500);
  END IF;

  -- Add comments constraints
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'check_content_not_empty'
  ) THEN
    ALTER TABLE comments 
    ADD CONSTRAINT check_content_not_empty 
    CHECK (length(content) > 0);
  END IF;

  -- Add withdrawal_requests constraints
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'check_amount_positive'
  ) THEN
    ALTER TABLE withdrawal_requests 
    ADD CONSTRAINT check_amount_positive 
    CHECK (amount > 0);
  END IF;
END $$;

-- Add missing triggers
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'handle_blog_posts_updated_at'
  ) THEN
    CREATE TRIGGER handle_blog_posts_updated_at
      BEFORE UPDATE ON blog_posts
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'handle_comments_updated_at'
  ) THEN
    CREATE TRIGGER handle_comments_updated_at
      BEFORE UPDATE ON comments
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

-- Add validation functions
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

-- Add validation constraints to profiles
DO $$ 
BEGIN
  -- Add email validation
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'check_email_format'
  ) THEN
    ALTER TABLE profiles
    ADD CONSTRAINT check_email_format
    CHECK (email IS NULL OR public.is_valid_email(email));
  END IF;

  -- Add phone validation
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'check_phone_format'
  ) THEN
    ALTER TABLE profiles
    ADD CONSTRAINT check_phone_format
    CHECK (phone IS NULL OR public.is_valid_phone(phone));
  END IF;

  -- Add IBAN validation
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'check_bank_account_format'
  ) THEN
    ALTER TABLE profiles
    ADD CONSTRAINT check_bank_account_format
    CHECK (bank_account IS NULL OR public.is_valid_iban(bank_account));
  END IF;
END $$;