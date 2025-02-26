/*
  # Add recurring closures functionality
  
  1. New Tables
    - `recurring_closures`
      - `id` (uuid, primary key)
      - `day_of_week` (integer, 0-6 where 0 is Sunday)
      - `start_time` (time)
      - `end_time` (time)
      - `created_at` (timestamptz)
      - `active` (boolean)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE recurring_closures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- Enable RLS
ALTER TABLE recurring_closures ENABLE ROW LEVEL SECURITY;

-- Policies for recurring_closures
CREATE POLICY "Anyone can view recurring closures"
  ON recurring_closures
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage recurring closures"
  ON recurring_closures
  FOR ALL
  TO authenticated
  USING (true);

-- Create index for faster lookups
CREATE INDEX idx_recurring_closures_day ON recurring_closures (day_of_week);
CREATE INDEX idx_recurring_closures_active ON recurring_closures (active);