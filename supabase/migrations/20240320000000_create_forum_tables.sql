-- Create forum_categories table
CREATE TABLE forum_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create forum_posts table
CREATE TABLE forum_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  category_id UUID REFERENCES forum_categories(id) ON DELETE CASCADE,
  is_locked BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  reply_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create forum_replies table
CREATE TABLE forum_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create function to update reply_count
CREATE OR REPLACE FUNCTION update_forum_post_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_posts
    SET reply_count = reply_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_posts
    SET reply_count = reply_count - 1
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for reply_count
CREATE TRIGGER update_forum_post_reply_count_trigger
AFTER INSERT OR DELETE ON forum_replies
FOR EACH ROW
EXECUTE FUNCTION update_forum_post_reply_count();

-- Create RLS policies
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Categories are viewable by everyone"
  ON forum_categories FOR SELECT
  USING (true);

CREATE POLICY "Categories are manageable by admins"
  ON forum_categories FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM auth.users
    WHERE raw_user_meta_data->>'is_admin' = 'true'
  ));

-- Posts policies
CREATE POLICY "Posts are viewable by everyone"
  ON forum_posts FOR SELECT
  USING (true);

CREATE POLICY "Posts are insertable by authenticated users"
  ON forum_posts FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Posts are updatable by author or admin"
  ON forum_posts FOR UPDATE
  USING (
    auth.uid() = author_id OR
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE raw_user_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Posts are deletable by author or admin"
  ON forum_posts FOR DELETE
  USING (
    auth.uid() = author_id OR
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- Replies policies
CREATE POLICY "Replies are viewable by everyone"
  ON forum_replies FOR SELECT
  USING (true);

CREATE POLICY "Replies are insertable by authenticated users"
  ON forum_replies FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Replies are updatable by author or admin"
  ON forum_replies FOR UPDATE
  USING (
    auth.uid() = author_id OR
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE raw_user_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Replies are deletable by author or admin"
  ON forum_replies FOR DELETE
  USING (
    auth.uid() = author_id OR
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE raw_user_meta_data->>'is_admin' = 'true'
    )
  ); 