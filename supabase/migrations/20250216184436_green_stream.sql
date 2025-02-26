/*
  # Add closed dates table

  1. New Tables
    - `closed_dates`
      - `id` (uuid, primary key)
      - `date` (date, unique)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `closed_dates` table
    - Add policies for authenticated users to manage closed dates
*/

CREATE TABLE closed_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE closed_dates ENABLE ROW LEVEL SECURITY;

-- Policies for closed_dates
CREATE POLICY "Anyone can view closed dates"
  ON closed_dates
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage closed dates"
  ON closed_dates
  FOR ALL
  TO authenticated
  USING (true);

-- Create index for faster lookups
CREATE INDEX idx_closed_dates_date ON closed_dates (date);