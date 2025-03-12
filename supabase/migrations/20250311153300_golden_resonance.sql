/*
  # Schema update for categories and metadata

  1. New Tables
    - `categories`
      - Stores activity categories with icons and metadata
    - `activity_categories`
      - Junction table for activity-category relationships
    - `locations`
      - Stores predefined locations with metadata
    - `activity_types`
      - Stores types of activities (free, paid, premium)
    - `age_ranges`
      - Predefined age ranges for activities
    
  2. Security
    - Enable RLS on all tables
    - Add policies for secure access
    
  3. Changes
    - Add foreign key relationships
    - Add indexes for performance
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon_url text,
  description text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create activity_categories junction table
CREATE TABLE IF NOT EXISTS activity_categories (
  activity_id uuid REFERENCES activities(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (activity_id, category_id),
  created_at timestamptz DEFAULT now()
);

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  country text DEFAULT 'España',
  latitude numeric(10,8),
  longitude numeric(11,8),
  popularity integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create activity_types table
CREATE TABLE IF NOT EXISTS activity_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  is_premium boolean DEFAULT false,
  price_range_min numeric(10,2),
  price_range_max numeric(10,2),
  created_at timestamptz DEFAULT now()
);

-- Create age_ranges table
CREATE TABLE IF NOT EXISTS age_ranges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  min_age integer NOT NULL,
  max_age integer,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE age_ranges ENABLE ROW LEVEL SECURITY;

-- Policies for categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Policies for activity_categories
CREATE POLICY "Activity categories are viewable by everyone"
  ON activity_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Activity creators can manage their categories"
  ON activity_categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM activities
      WHERE id = activity_id
      AND creator_id = auth.uid()
    )
  );

-- Policies for locations
CREATE POLICY "Locations are viewable by everyone"
  ON locations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify locations"
  ON locations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Policies for activity_types
CREATE POLICY "Activity types are viewable by everyone"
  ON activity_types
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify activity types"
  ON activity_types
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Policies for age_ranges
CREATE POLICY "Age ranges are viewable by everyone"
  ON age_ranges
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify age ranges"
  ON age_ranges
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Insert default categories
INSERT INTO categories (name, slug, icon_url, description) VALUES
  ('A pie de playa', 'playa', 'https://a0.muscache.com/pictures/10ce1091-c854-40f3-a2fb-defc2995bcaf.jpg', 'Actividades junto al mar'),
  ('Iconos', 'iconos', 'https://a0.muscache.com/pictures/3b1eb541-46d9-4bef-abc4-c37d77e3c21b.jpg', 'Lugares emblemáticos'),
  ('Castillos', 'castillos', 'https://a0.muscache.com/pictures/1b6a8b70-a3b6-48b5-88e1-2243d9172c06.jpg', 'Visitas a castillos históricos'),
  ('Minicasas', 'minicasas', 'https://a0.muscache.com/pictures/732edad8-3ae0-49a8-a451-29a8010dcc0c.jpg', 'Experiencias en casas pequeñas'),
  ('Ciudades famosas', 'ciudades-famosas', 'https://a0.muscache.com/pictures/ed8b9e47-609b-44c2-9768-33e6a22eccb2.jpg', 'Actividades en ciudades populares'),
  ('Pianos de cola', 'pianos', 'https://a0.muscache.com/pictures/8eccb972-4bd6-43c5-ac83-27822c0d3dcd.jpg', 'Experiencias musicales'),
  ('Casas rurales', 'rural', 'https://a0.muscache.com/pictures/6ad4bd95-f086-437d-97e3-14d12155ddfe.jpg', 'Actividades en el campo'),
  ('Cabañas', 'cabanas', 'https://a0.muscache.com/pictures/732edad8-3ae0-49a8-a451-29a8010dcc0c.jpg', 'Experiencias en cabañas'),
  ('Mansiones', 'mansiones', 'https://a0.muscache.com/pictures/78ba8486-6ba6-4a43-a56d-f556189193da.jpg', 'Actividades en grandes casas'),
  ('Casas domo', 'domo', 'https://a0.muscache.com/pictures/89faf9ae-bbbc-4bc4-aecd-cc15bf36cbca.jpg', 'Experiencias en casas domo'),
  ('Casas del árbol', 'arbol', 'https://a0.muscache.com/pictures/4d4a4eba-c7e4-43eb-9ce2-95e1d200d10e.jpg', 'Actividades en casas del árbol'),
  ('Singulares', 'singulares', 'https://a0.muscache.com/pictures/c5a4f6fc-c92c-4ae8-87dd-57f1ff1b89a6.jpg', 'Experiencias únicas');

-- Insert default activity types
INSERT INTO activity_types (name, slug, description, is_premium, price_range_min, price_range_max) VALUES
  ('Gratuita', 'free', 'Actividades sin costo', false, 0, 0),
  ('Básica', 'basic', 'Actividades con costo accesible', false, 1, 50),
  ('Premium', 'premium', 'Experiencias exclusivas', true, 50, 1000);

-- Insert default age ranges
INSERT INTO age_ranges (name, min_age, max_age, description) VALUES
  ('Bebés', 0, 2, 'Actividades para bebés de 0 a 2 años'),
  ('Preescolar', 3, 5, 'Actividades para niños de 3 a 5 años'),
  ('Primaria', 6, 11, 'Actividades para niños de 6 a 11 años'),
  ('Adolescentes', 12, 17, 'Actividades para adolescentes de 12 a 17 años'),
  ('Todas las edades', 0, null, 'Actividades para toda la familia');

-- Insert default locations
INSERT INTO locations (name, slug, country, latitude, longitude, is_featured) VALUES
  ('Madrid', 'madrid', 'España', 40.4168, -3.7038, true),
  ('Barcelona', 'barcelona', 'España', 41.3851, 2.1734, true),
  ('Valencia', 'valencia', 'España', 39.4699, -0.3763, true),
  ('Sevilla', 'sevilla', 'España', 37.3891, -5.9845, true),
  ('Málaga', 'malaga', 'España', 36.7213, -4.4213, true),
  ('Bilbao', 'bilbao', 'España', 43.2630, -2.9350, true),
  ('Granada', 'granada', 'España', 37.1773, -3.5986, true),
  ('Alicante', 'alicante', 'España', 38.3452, -0.4815, true),
  ('Palma de Mallorca', 'palma', 'España', 39.5696, 2.6502, true),
  ('San Sebastián', 'san-sebastian', 'España', 43.3183, -1.9812, true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_locations_slug ON locations(slug);
CREATE INDEX IF NOT EXISTS idx_activity_types_slug ON activity_types(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_locations_is_featured ON locations(is_featured);
CREATE INDEX IF NOT EXISTS idx_activity_categories_activity_id ON activity_categories(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_categories_category_id ON activity_categories(category_id);