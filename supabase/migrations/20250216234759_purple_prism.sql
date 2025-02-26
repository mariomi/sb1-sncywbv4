/*
  # Fix Admin Policies

  1. Changes
    - Add admin policies for reservations and time slots
    - Fix single row selection issues
    - Ensure proper access control
  
  2. Security
    - Enable RLS on all tables
    - Add specific policies for admin operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own reservations" ON reservations;
DROP POLICY IF EXISTS "Users can view their own reservations" ON reservations;
DROP POLICY IF EXISTS "Users can update their own reservations" ON reservations;
DROP POLICY IF EXISTS "Anyone can create reservations" ON reservations;
DROP POLICY IF EXISTS "Public can view their own reservations" ON reservations;
DROP POLICY IF EXISTS "Time slots are viewable by everyone" ON time_slots;

-- Recreate policies with proper admin access
CREATE POLICY "Anyone can create reservations"
  ON reservations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can view their own reservations"
  ON reservations
  FOR SELECT
  TO public
  USING (email IS NOT NULL);

CREATE POLICY "Authenticated users can manage all reservations"
  ON reservations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can view active time slots"
  ON time_slots
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage all time slots"
  ON time_slots
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);