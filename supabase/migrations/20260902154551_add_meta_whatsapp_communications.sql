-- Prepare opt-in WhatsApp service messages through the Meta Cloud API.
-- The feature flag is deliberately disabled until the Meta business number,
-- templates, webhook and server-side secrets have all been verified.

alter table public.reservations
  add column if not exists whatsapp_opt_in boolean not null default false,
  add column if not exists whatsapp_opt_in_at timestamptz,
  add column if not exists whatsapp_opt_out_at timestamptz,
  add column if not exists whatsapp_consent_version text;

insert into public.feature_flags (key, label, description, enabled)
values (
  'whatsapp_notifications',
  'Comunicazioni WhatsApp',
  'Invia conferme e aggiornamenti di servizio tramite WhatsApp Cloud API',
  false
)
on conflict (key) do nothing;

create table if not exists public.whatsapp_contacts (
  phone_e164 text primary key,
  wa_id text unique,
  profile_name text,
  last_inbound_at timestamptz,
  service_window_expires_at timestamptz,
  opted_out_at timestamptz,
  created_at timestamptz not null default current_timestamp,
  updated_at timestamptz not null default current_timestamp,
  constraint whatsapp_contacts_phone_format
    check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  constraint whatsapp_contacts_service_window
    check (
      service_window_expires_at is null
      or last_inbound_at is null
      or service_window_expires_at >= last_inbound_at
    )
);

create table if not exists public.whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid references public.reservations(id) on delete set null,
  contact_phone text not null references public.whatsapp_contacts(phone_e164) on update cascade,
  direction text not null,
  purpose text not null,
  message_type text not null default 'template',
  template_name text,
  template_language text,
  body_text text,
  provider_message_id text unique,
  reply_to_provider_message_id text,
  status text not null default 'queued',
  dedupe_key text unique,
  attempt_count integer not null default 0,
  error_code text,
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  sent_at timestamptz,
  delivered_at timestamptz,
  read_at timestamptz,
  failed_at timestamptz,
  received_at timestamptz,
  admin_read_at timestamptz,
  created_at timestamptz not null default current_timestamp,
  updated_at timestamptz not null default current_timestamp,
  constraint whatsapp_messages_direction
    check (direction in ('inbound', 'outbound')),
  constraint whatsapp_messages_purpose
    check (purpose in (
      'reservation_confirmation',
      'reservation_updated',
      'reservation_cancelled',
      'reminder_24h',
      'reminder_2h',
      'waitlist_available',
      'manual_reply',
      'customer_message'
    )),
  constraint whatsapp_messages_type
    check (message_type in ('template', 'text', 'interactive', 'media', 'unsupported')),
  constraint whatsapp_messages_status
    check (status in ('queued', 'sending', 'sent', 'delivered', 'read', 'failed', 'received', 'skipped')),
  constraint whatsapp_messages_attempt_count
    check (attempt_count >= 0),
  constraint whatsapp_messages_body_length
    check (body_text is null or char_length(body_text) <= 4000),
  constraint whatsapp_messages_metadata_object
    check (jsonb_typeof(metadata) = 'object')
);

create index if not exists whatsapp_messages_reservation_created_idx
  on public.whatsapp_messages (reservation_id, created_at desc);

create index if not exists whatsapp_messages_contact_created_idx
  on public.whatsapp_messages (contact_phone, created_at desc);

create index if not exists whatsapp_messages_status_idx
  on public.whatsapp_messages (status, created_at desc);

create index if not exists whatsapp_messages_unread_inbound_idx
  on public.whatsapp_messages (created_at desc)
  where direction = 'inbound' and admin_read_at is null;

alter table public.whatsapp_contacts enable row level security;
alter table public.whatsapp_messages enable row level security;

drop policy if exists "Admins can manage WhatsApp contacts" on public.whatsapp_contacts;
create policy "Admins can manage WhatsApp contacts"
  on public.whatsapp_contacts for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

drop policy if exists "Admins can manage WhatsApp messages" on public.whatsapp_messages;
create policy "Admins can manage WhatsApp messages"
  on public.whatsapp_messages for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

revoke all on table public.whatsapp_contacts from public, anon;
revoke all on table public.whatsapp_messages from public, anon;
grant select, insert, update, delete on table public.whatsapp_contacts to authenticated;
grant select, insert, update, delete on table public.whatsapp_messages to authenticated;
grant all on table public.whatsapp_contacts, public.whatsapp_messages to service_role;

-- Keep the original public booking RPC compatible with already-open browser
-- sessions. The new wrapper records channel consent in the same transaction.
create or replace function private.create_public_reservation_with_channels(
  p_date date,
  p_time time without time zone,
  p_guests integer,
  p_name text,
  p_email text,
  p_phone text,
  p_occasion text default null,
  p_special_requests text default null,
  p_marketing_consent boolean default false,
  p_whatsapp_opt_in boolean default false,
  p_locale text default 'en',
  p_attribution jsonb default '{}'::jsonb
)
returns table (reservation_id uuid, cancellation_token uuid)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_reservation_id uuid;
  v_cancellation_token uuid;
begin
  select created.reservation_id, created.cancellation_token
  into v_reservation_id, v_cancellation_token
  from private.create_public_reservation(
    p_date,
    p_time,
    p_guests,
    p_name,
    p_email,
    p_phone,
    p_occasion,
    p_special_requests,
    p_marketing_consent,
    p_locale,
    p_attribution
  ) as created;

  update public.reservations as target_reservation
  set
    whatsapp_opt_in = coalesce(p_whatsapp_opt_in, false),
    whatsapp_opt_in_at = case
      when coalesce(p_whatsapp_opt_in, false) then current_timestamp
      else null
    end,
    whatsapp_opt_out_at = null,
    whatsapp_consent_version = case
      when coalesce(p_whatsapp_opt_in, false) then 'booking-service-v1'
      else null
    end
  where target_reservation.id = v_reservation_id
    and target_reservation.cancellation_token = v_cancellation_token;

  return query select v_reservation_id, v_cancellation_token;
end;
$$;

create or replace function public.create_public_reservation_with_channels(
  p_date date,
  p_time time without time zone,
  p_guests integer,
  p_name text,
  p_email text,
  p_phone text,
  p_occasion text default null,
  p_special_requests text default null,
  p_marketing_consent boolean default false,
  p_whatsapp_opt_in boolean default false,
  p_locale text default 'en',
  p_attribution jsonb default '{}'::jsonb
)
returns table (reservation_id uuid, cancellation_token uuid)
language sql
volatile
security invoker
set search_path = ''
as $$
  select *
  from private.create_public_reservation_with_channels(
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
  );
$$;

revoke execute on function private.create_public_reservation_with_channels(
  date, time without time zone, integer, text, text, text, text, text, boolean, boolean, text, jsonb
) from public, anon, authenticated;

revoke execute on function public.create_public_reservation_with_channels(
  date, time without time zone, integer, text, text, text, text, text, boolean, boolean, text, jsonb
) from public;

grant execute on function private.create_public_reservation_with_channels(
  date, time without time zone, integer, text, text, text, text, text, boolean, boolean, text, jsonb
) to anon, authenticated, service_role;

grant execute on function public.create_public_reservation_with_channels(
  date, time without time zone, integer, text, text, text, text, text, boolean, boolean, text, jsonb
) to anon, authenticated, service_role;
