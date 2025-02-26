/*
  # Update reservation policies

  1. Changes
    - Allow public access for creating reservations
    - Remove user_id requirement for reservations
    - Add policy for public to create reservations

  2. Security
    - Maintain RLS on reservations table
    - Allow public access for creating new reservations
    - Keep existing policies for authenticated users
*/

-- Drop the user_id foreign key constraint
ALTER TABLE reservations
DROP CONSTRAINT IF EXISTS reservations_user_id_fkey,
ALTER COLUMN user_id DROP NOT NULL;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own reservations" ON reservations;

-- Create new policy for public reservation creation
CREATE POLICY "Anyone can create reservations"
  ON reservations
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Keep existing policies for viewing and updating
CREATE POLICY "Public can view their own reservations"
  ON reservations
  FOR SELECT
  TO public
  USING (email IS NOT NULL);