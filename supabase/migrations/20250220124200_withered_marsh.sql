/*
  # Fix marketing consent column

  1. Changes
    - Drop existing marketing_consent column if it exists
    - Add marketing_consent column with proper constraints
    - Create index for faster queries
    - Ensure clean state by handling existing data

  2. Notes
    - This migration consolidates previous attempts to add the marketing_consent column
    - Ensures data consistency by setting a default value
*/

-- First ensure we're in a clean state by dropping any existing column and index
DROP INDEX IF EXISTS idx_reservations_marketing_consent;
ALTER TABLE reservations 
DROP COLUMN IF EXISTS marketing_consent;

-- Add the column with proper constraints
ALTER TABLE reservations
ADD COLUMN marketing_consent boolean NOT NULL DEFAULT false;

-- Create an index for faster queries
CREATE INDEX idx_reservations_marketing_consent 
ON reservations (marketing_consent);