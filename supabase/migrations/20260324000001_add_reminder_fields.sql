-- supabase/migrations/20260324000001_add_reminder_fields.sql
ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS reminder_sent_at  timestamptz DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS cancellation_token uuid NOT NULL DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX IF NOT EXISTS idx_reservations_cancel_token
  ON reservations (cancellation_token);
