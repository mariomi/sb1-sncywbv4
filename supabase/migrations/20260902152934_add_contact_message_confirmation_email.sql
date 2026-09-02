-- Track the customer receipt so retries cannot send duplicate contact emails.
alter table public.contact_messages
  add column if not exists confirmation_sent_at timestamptz;
