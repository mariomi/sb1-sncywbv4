-- Add 2-hour reminder tracking column to reservations
ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS reminder_2h_sent_at timestamptz DEFAULT NULL;
