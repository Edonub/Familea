/*
  # Enable RLS for destinations table

  1. Changes
    - Enable RLS on destinations table
    - Add policies for secure access
    - Add default data for Spanish destinations
*/

-- Enable RLS
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Destinations are viewable by everyone"
  ON destinations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify destinations"
  ON destinations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Add default data if table is empty
INSERT INTO destinations (name, country, popularity)
SELECT d.name, d.country, d.popularity
FROM (
  VALUES
    ('Madrid', 'España', 100),
    ('Barcelona', 'España', 95),
    ('Valencia', 'España', 90),
    ('Sevilla', 'España', 85),
    ('Málaga', 'España', 80),
    ('Bilbao', 'España', 75),
    ('Granada', 'España', 70),
    ('Alicante', 'España', 65),
    ('Palma de Mallorca', 'España', 60),
    ('San Sebastián', 'España', 55)
) AS d(name, country, popularity)
WHERE NOT EXISTS (
  SELECT 1 FROM destinations LIMIT 1
);

-- Add updated_at trigger if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'handle_destinations_updated_at'
  ) THEN
    CREATE TRIGGER handle_destinations_updated_at
      BEFORE UPDATE ON destinations
      FOR EACH ROW
      EXECUTE FUNCTION handle_updated_at();
  END IF;
END $$;