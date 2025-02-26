/*
  # Fix marketing consent column

  1. Changes
    - Drop existing marketing_consent column if it exists
    - Add marketing_consent column with proper constraints
    - Set default value to false
*/

-- First drop the column if it exists to ensure a clean state
ALTER TABLE reservations 
DROP COLUMN IF EXISTS marketing_consent;

-- Add the column back with proper constraints
ALTER TABLE reservations
ADD COLUMN marketing_consent boolean NOT NULL DEFAULT false;

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_reservations_marketing_consent 
ON reservations (marketing_consent);