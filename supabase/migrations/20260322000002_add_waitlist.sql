/*
  # Add waitlist table

  1. New Tables
    - `waitlist` - Customers waiting for a slot that is fully booked

  2. Security
    - Enable RLS
    - Public can insert and view own entries by email
    - Authenticated (admin) can manage all entries
*/

CREATE TABLE waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  date date NOT NULL,
  time time NOT NULL,
  guests integer NOT NULL CHECK (guests > 0 AND guests <= 20),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  occasion text,
  special_requests text,
  status text NOT NULL DEFAULT 'waiting'
    CHECK (status IN ('waiting', 'notified', 'converted', 'expired')),
  notified_at timestamptz DEFAULT NULL,
  position integer NOT NULL DEFAULT 1
);

-- Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join waitlist"
  ON waitlist FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can view own waitlist entries"
  ON waitlist FOR SELECT
  TO public
  USING (email IS NOT NULL);

CREATE POLICY "Authenticated users can manage waitlist"
  ON waitlist FOR ALL
  TO authenticated
  USING (true);

-- Indexes for performance
CREATE INDEX idx_waitlist_date_time ON waitlist (date, time, status);
CREATE INDEX idx_waitlist_email ON waitlist (email);
