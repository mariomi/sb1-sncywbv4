/*
  # Add is_active field to time_slots

  1. Changes
    - Add is_active boolean field to time_slots table with default true
    - Update existing time slots to be active by default
*/

-- Add is_active column
ALTER TABLE time_slots 
ADD COLUMN is_active boolean DEFAULT true;

-- Update existing time slots to be active
UPDATE time_slots 
SET is_active = true 
WHERE is_active IS NULL;