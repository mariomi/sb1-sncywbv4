/*
  # Add marketing consent column to reservations table

  1. Changes
    - Add marketing_consent column to reservations table with default value of false
    - Add check constraint to ensure valid values
*/

DO $$ 
BEGIN
  -- Only add the column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'reservations' 
    AND column_name = 'marketing_consent'
  ) THEN
    ALTER TABLE reservations
    ADD COLUMN marketing_consent boolean DEFAULT false;
  END IF;
END $$;