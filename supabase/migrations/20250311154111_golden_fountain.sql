/*
  # Host Experiences Management Schema

  1. New Tables
    - `host_balances`: Stores host earnings and withdrawal info
    - `withdrawal_requests`: Manages withdrawal requests from hosts
    - `experience_schedules`: Manages availability and bookings
    - `experience_pricing`: Handles dynamic pricing and special rates
    
  2. Security
    - Enable RLS on all tables
    - Add policies for secure access
    
  3. Changes
    - Add tracking for earnings and withdrawals
    - Add scheduling and availability management
*/

-- Create host_balances table
CREATE TABLE IF NOT EXISTS host_balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  available_balance numeric(10,2) DEFAULT 0,
  pending_balance numeric(10,2) DEFAULT 0,
  total_earnings numeric(10,2) DEFAULT 0,
  last_withdrawal jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create withdrawal_requests table
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  amount numeric(10,2) NOT NULL,
  bank_account text NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create experience_schedules table
CREATE TABLE IF NOT EXISTS experience_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid REFERENCES activities(id) NOT NULL,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  available_spots integer NOT NULL,
  booked_spots integer DEFAULT 0,
  is_available boolean DEFAULT true,
  price_override numeric(10,2),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create experience_pricing table
CREATE TABLE IF NOT EXISTS experience_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid REFERENCES activities(id) NOT NULL,
  date_from date NOT NULL,
  date_to date NOT NULL,
  price numeric(10,2) NOT NULL,
  min_participants integer,
  max_participants integer,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE host_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_pricing ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- host_balances policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'System can update balances' AND tablename = 'host_balances') THEN
    DROP POLICY "System can update balances" ON host_balances;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own balance' AND tablename = 'host_balances') THEN
    DROP POLICY "Users can view own balance" ON host_balances;
  END IF;

  -- withdrawal_requests policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create withdrawal requests' AND tablename = 'withdrawal_requests') THEN
    DROP POLICY "Users can create withdrawal requests" ON withdrawal_requests;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own withdrawals' AND tablename = 'withdrawal_requests') THEN
    DROP POLICY "Users can view own withdrawals" ON withdrawal_requests;
  END IF;

  -- experience_schedules policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Experience schedules are viewable by everyone' AND tablename = 'experience_schedules') THEN
    DROP POLICY "Experience schedules are viewable by everyone" ON experience_schedules;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Hosts can manage their schedules' AND tablename = 'experience_schedules') THEN
    DROP POLICY "Hosts can manage their schedules" ON experience_schedules;
  END IF;

  -- experience_pricing policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Experience pricing is viewable by everyone' AND tablename = 'experience_pricing') THEN
    DROP POLICY "Experience pricing is viewable by everyone" ON experience_pricing;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Hosts can manage their pricing' AND tablename = 'experience_pricing') THEN
    DROP POLICY "Hosts can manage their pricing" ON experience_pricing;
  END IF;
END $$;

-- Create new policies
CREATE POLICY "System can update balances"
  ON host_balances
  FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Users can view own balance"
  ON host_balances
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create withdrawal requests"
  ON withdrawal_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own withdrawals"
  ON withdrawal_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Experience schedules are viewable by everyone"
  ON experience_schedules
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Hosts can manage their schedules"
  ON experience_schedules
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM activities
      WHERE id = activity_id
      AND creator_id = auth.uid()
    )
  );

CREATE POLICY "Experience pricing is viewable by everyone"
  ON experience_pricing
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Hosts can manage their pricing"
  ON experience_pricing
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM activities
      WHERE id = activity_id
      AND creator_id = auth.uid()
    )
  );

-- Add function to handle updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS handle_host_balances_updated_at ON host_balances;
DROP TRIGGER IF EXISTS handle_withdrawal_requests_updated_at ON withdrawal_requests;
DROP TRIGGER IF EXISTS handle_experience_schedules_updated_at ON experience_schedules;
DROP TRIGGER IF EXISTS handle_experience_pricing_updated_at ON experience_pricing;
DROP TRIGGER IF EXISTS handle_new_user ON profiles;

-- Create new triggers
CREATE TRIGGER handle_host_balances_updated_at
  BEFORE UPDATE ON host_balances
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_withdrawal_requests_updated_at
  BEFORE UPDATE ON withdrawal_requests
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_experience_schedules_updated_at
  BEFORE UPDATE ON experience_schedules
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_experience_pricing_updated_at
  BEFORE UPDATE ON experience_pricing
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Add function to handle new user registration if it doesn't exist
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO host_balances (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create new user trigger
CREATE TRIGGER handle_new_user
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();