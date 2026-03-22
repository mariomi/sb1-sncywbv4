/*
  # Add source and admin_notes to reservations

  1. Changes
    - Add `source` column to track how reservation was made (online, phone, walk_in)
    - Add `admin_notes` column for internal admin notes not visible to customers
*/

ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS source text DEFAULT 'online'
    CHECK (source IN ('online', 'phone', 'walk_in')),
  ADD COLUMN IF NOT EXISTS admin_notes text DEFAULT NULL;
