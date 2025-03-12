/*
  # Banking System Schema

  1. New Tables
    - `host_balances`
      - Tracks available and pending balances for hosts
      - Stores total earnings and withdrawal history
    - `withdrawal_requests`
      - Manages withdrawal requests from hosts
      - Tracks status and processing details
    
  2. Security
    - Enable RLS on all tables
    - Add policies for secure access
    
  3. Changes
    - Add bank_account field to profiles table if not exists
*/

-- Create host_balances table
CREATE TABLE IF NOT EXISTS host_balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  available_balance decimal(10,2) DEFAULT 0,
  pending_balance decimal(10,2) DEFAULT 0,
  total_earnings decimal(10,2) DEFAULT 0,
  last_withdrawal jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create withdrawal_requests table
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  amount decimal(10,2) NOT NULL,
  bank_account text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE host_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Policies for host_balances
CREATE POLICY "Users can view own balance"
  ON host_balances
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can update balances"
  ON host_balances
  FOR ALL
  TO service_role
  USING (true);

-- Policies for withdrawal_requests
CREATE POLICY "Users can view own withdrawals"
  ON withdrawal_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create withdrawal requests"
  ON withdrawal_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add bank_account to profiles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'bank_account'
  ) THEN
    ALTER TABLE profiles ADD COLUMN bank_account text;
  END IF;
END $$;