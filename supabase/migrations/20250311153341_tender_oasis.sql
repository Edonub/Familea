/*
  # Update activities table schema

  1. Changes
    - Add new columns for better activity management
    - Add foreign key relationships
    - Add indexes for performance
    
  2. Security
    - Update RLS policies
*/

-- Add new columns to activities table
ALTER TABLE activities ADD COLUMN IF NOT EXISTS duration_minutes integer;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS max_participants integer;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS min_participants integer DEFAULT 1;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS cancellation_policy text;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS included_items text[];
ALTER TABLE activities ADD COLUMN IF NOT EXISTS excluded_items text[];
ALTER TABLE activities ADD COLUMN IF NOT EXISTS meeting_point jsonb;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS activity_type_id uuid REFERENCES activity_types(id);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS age_range_id uuid REFERENCES age_ranges(id);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS location_id uuid REFERENCES locations(id);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS availability jsonb;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS booking_requirements text[];
ALTER TABLE activities ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS published_at timestamptz;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS views_count integer DEFAULT 0;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS bookings_count integer DEFAULT 0;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS average_rating numeric(3,2);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS featured_position integer;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS seo_title text;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS seo_description text;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS seo_keywords text[];

-- Add check constraints
ALTER TABLE activities ADD CONSTRAINT check_price_non_negative CHECK (price >= 0);
ALTER TABLE activities ADD CONSTRAINT check_duration_positive CHECK (duration_minutes > 0);
ALTER TABLE activities ADD CONSTRAINT check_participants CHECK (min_participants <= max_participants);
ALTER TABLE activities ADD CONSTRAINT check_rating_range CHECK (average_rating >= 0 AND average_rating <= 5);
ALTER TABLE activities ADD CONSTRAINT check_status CHECK (status IN ('draft', 'pending', 'published', 'archived'));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status);
CREATE INDEX IF NOT EXISTS idx_activities_published_at ON activities(published_at);
CREATE INDEX IF NOT EXISTS idx_activities_featured_position ON activities(featured_position);
CREATE INDEX IF NOT EXISTS idx_activities_price ON activities(price);
CREATE INDEX IF NOT EXISTS idx_activities_average_rating ON activities(average_rating);
CREATE INDEX IF NOT EXISTS idx_activities_location_id ON activities(location_id);
CREATE INDEX IF NOT EXISTS idx_activities_activity_type_id ON activities(activity_type_id);
CREATE INDEX IF NOT EXISTS idx_activities_age_range_id ON activities(age_range_id);

-- Update RLS policies
DROP POLICY IF EXISTS "Activities are viewable by everyone" ON activities;
DROP POLICY IF EXISTS "Users can create activities" ON activities;
DROP POLICY IF EXISTS "Users can update own activities" ON activities;

CREATE POLICY "Published activities are viewable by everyone"
  ON activities
  FOR SELECT
  TO public
  USING (status = 'published' OR auth.uid() = creator_id);

CREATE POLICY "Users can create activities"
  ON activities
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = creator_id
  );

CREATE POLICY "Users can update own activities"
  ON activities
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can delete own activities"
  ON activities
  FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_activities_updated_at ON activities;
CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle activity publication
CREATE OR REPLACE FUNCTION handle_activity_publication()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    NEW.published_at = now();
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for activity publication
DROP TRIGGER IF EXISTS handle_activity_publication_trigger ON activities;
CREATE TRIGGER handle_activity_publication_trigger
  BEFORE UPDATE ON activities
  FOR EACH ROW
  WHEN (NEW.status IS DISTINCT FROM OLD.status)
  EXECUTE FUNCTION handle_activity_publication();