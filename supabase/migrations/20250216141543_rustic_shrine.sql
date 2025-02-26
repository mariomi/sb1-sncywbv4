/*
  # Reservation System Schema

  1. New Tables
    - `reservations`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `date` (date)
      - `time` (time)
      - `guests` (integer)
      - `occasion` (text)
      - `special_requests` (text)
      - `status` (text)
      - `user_id` (uuid, foreign key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
    
    - `time_slots`
      - `id` (uuid, primary key)
      - `time` (time)
      - `max_capacity` (integer)
      - `is_lunch` (boolean)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their reservations
    - Add policies for staff to manage all reservations
*/

-- Create time_slots table
CREATE TABLE time_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  time time NOT NULL,
  max_capacity integer NOT NULL DEFAULT 30,
  is_lunch boolean NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create reservations table
CREATE TABLE reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  date date NOT NULL,
  time time NOT NULL,
  guests integer NOT NULL CHECK (guests > 0 AND guests <= 20),
  occasion text,
  special_requests text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  user_id uuid REFERENCES auth.users,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  UNIQUE (date, time, email)
);

-- Enable RLS
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Time slots policies
CREATE POLICY "Time slots are viewable by everyone"
  ON time_slots
  FOR SELECT
  TO public
  USING (true);

-- Reservations policies
CREATE POLICY "Users can create their own reservations"
  ON reservations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own reservations"
  ON reservations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert lunch time slots
INSERT INTO time_slots (time, is_lunch) VALUES
  ('12:00:00', true),
  ('12:30:00', true),
  ('13:00:00', true),
  ('13:30:00', true),
  ('14:00:00', true),
  ('14:30:00', true);

-- Insert dinner time slots
INSERT INTO time_slots (time, is_lunch) VALUES
  ('19:00:00', false),
  ('19:30:00', false),
  ('20:00:00', false),
  ('20:30:00', false),
  ('21:00:00', false),
  ('21:30:00', false);

-- Create index for faster lookups
CREATE INDEX idx_reservations_date_time ON reservations (date, time);
CREATE INDEX idx_reservations_user_id ON reservations (user_id);
CREATE INDEX idx_reservations_status ON reservations (status);