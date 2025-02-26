/*
  # Reservation System Update

  1. New Tables
    - `restaurants` - Store restaurant details and capacity
    - `tables` - Individual tables with capacity and location
    - `reservation_settings` - Store reservation rules and constraints
    - `reservation_statuses` - Valid reservation status types
    - `occasions` - Pre-defined special occasions
  
  2. Changes to Existing Tables
    - Enhanced `reservations` table with new relationships
    - Added more detailed tracking and validation
*/

-- Create restaurants table
CREATE TABLE restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  total_capacity integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tables table
CREATE TABLE tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  capacity integer NOT NULL,
  location text NOT NULL, -- e.g., 'indoor', 'outdoor', 'bar'
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reservation settings table
CREATE TABLE reservation_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  min_party_size integer NOT NULL DEFAULT 1,
  max_party_size integer NOT NULL DEFAULT 20,
  reservation_interval interval NOT NULL DEFAULT '30 minutes',
  advance_booking_limit interval NOT NULL DEFAULT '90 days',
  cancellation_deadline interval NOT NULL DEFAULT '24 hours',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_party_size CHECK (min_party_size > 0 AND max_party_size >= min_party_size)
);

-- Create occasions table
CREATE TABLE occasions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reservation statuses table
CREATE TABLE reservation_statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  color text, -- For UI display
  created_at timestamptz DEFAULT now()
);

-- Drop existing reservations constraints and indexes
ALTER TABLE reservations
DROP CONSTRAINT IF EXISTS reservations_status_check,
DROP CONSTRAINT IF EXISTS reservations_guests_check;

-- Enhance reservations table
ALTER TABLE reservations
ADD COLUMN IF NOT EXISTS restaurant_id uuid REFERENCES restaurants(id),
ADD COLUMN IF NOT EXISTS table_id uuid REFERENCES tables(id),
ADD COLUMN IF NOT EXISTS occasion_id uuid REFERENCES occasions(id),
ADD COLUMN IF NOT EXISTS status_id uuid REFERENCES reservation_statuses(id),
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS arrival_time timestamptz,
ADD COLUMN IF NOT EXISTS departure_time timestamptz,
ADD COLUMN IF NOT EXISTS cancellation_reason text,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
ALTER COLUMN status DROP DEFAULT,
ALTER COLUMN status DROP NOT NULL;

-- Add new constraints
ALTER TABLE reservations
ADD CONSTRAINT valid_guest_count 
  CHECK (guests > 0 AND guests <= 20),
ADD CONSTRAINT valid_dates 
  CHECK (date >= CURRENT_DATE),
ADD CONSTRAINT valid_times 
  CHECK (arrival_time IS NULL OR arrival_time >= created_at),
ADD CONSTRAINT valid_duration 
  CHECK (departure_time IS NULL OR departure_time > arrival_time);

-- Create or update indexes
CREATE INDEX IF NOT EXISTS idx_reservations_restaurant ON reservations (restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reservations_table ON reservations (table_id);
CREATE INDEX IF NOT EXISTS idx_reservations_occasion ON reservations (occasion_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations (status_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date_time ON reservations (date, time);
CREATE INDEX IF NOT EXISTS idx_tables_restaurant ON tables (restaurant_id);

-- Enable RLS
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE occasions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_statuses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view active restaurants"
  ON restaurants FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view active tables"
  ON tables FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Public can view active occasions"
  ON occasions FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Public can view reservation statuses"
  ON reservation_statuses FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage all tables"
  ON restaurants FOR ALL
  TO authenticated
  USING (true);

-- Insert initial data
INSERT INTO restaurants (name, location, total_capacity)
VALUES ('Al Gobbo di Rialto', 'Venice, Italy', 100);

INSERT INTO reservation_statuses (name, description, color) VALUES
  ('pending', 'Reservation is awaiting confirmation', 'yellow'),
  ('confirmed', 'Reservation has been confirmed', 'green'),
  ('seated', 'Guests have arrived and been seated', 'blue'),
  ('completed', 'Reservation has been completed', 'gray'),
  ('cancelled', 'Reservation has been cancelled', 'red'),
  ('no_show', 'Guests did not arrive for their reservation', 'purple');

INSERT INTO occasions (name, description) VALUES
  ('Birthday', 'Birthday celebration'),
  ('Anniversary', 'Anniversary celebration'),
  ('Business', 'Business meeting or dinner'),
  ('Date Night', 'Romantic dinner'),
  ('Family Gathering', 'Family get-together'),
  ('Special Occasion', 'Other special occasions');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_restaurants_updated_at
    BEFORE UPDATE ON restaurants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tables_updated_at
    BEFORE UPDATE ON tables
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservation_settings_updated_at
    BEFORE UPDATE ON reservation_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
    BEFORE UPDATE ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();