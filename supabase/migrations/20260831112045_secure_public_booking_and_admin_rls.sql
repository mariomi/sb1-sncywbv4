-- Security hardening for the public booking surface.
--
-- Public visitors no longer receive direct table access to customer data.
-- Carefully validated RPC functions expose only the operations needed by the
-- website. Administrative table access requires app_metadata.role = 'admin'.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Schema consistency and indexes
-- ---------------------------------------------------------------------------

alter table public.reservations
  add column if not exists confirmation_sent_at timestamptz,
  add column if not exists locale text not null default 'en',
  add column if not exists attribution jsonb not null default '{}'::jsonb;

update public.reservations
set status = 'pending'
where status is null;

alter table public.reservations
  alter column status set default 'pending',
  alter column status set not null;

-- The original three-column UNIQUE constraint also blocked a guest from
-- re-booking after a cancellation. Keep uniqueness only for active bookings,
-- and make the email comparison case-insensitive.
alter table public.reservations
  drop constraint if exists reservations_date_time_email_key;

-- A CHECK constraint containing CURRENT_DATE changes meaning over time and
-- prevents staff from updating historical reservations. Date-window rules
-- belong in the creation RPC instead.
alter table public.reservations
  drop constraint if exists valid_dates;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'reservations_status_check'
      and conrelid = 'public.reservations'::regclass
  ) then
    alter table public.reservations
      add constraint reservations_status_check
      check (status in ('pending', 'confirmed', 'cancelled', 'completed'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'reservations_locale_check'
      and conrelid = 'public.reservations'::regclass
  ) then
    alter table public.reservations
      add constraint reservations_locale_check
      check (locale in ('en', 'it', 'fr', 'de', 'es'));
  end if;
end
$$;

create index if not exists idx_reservations_active_capacity
  on public.reservations (date, time)
  where status in ('pending', 'confirmed');

create index if not exists idx_reservations_active_identity
  on public.reservations (date, time, lower(email))
  where status in ('pending', 'confirmed');

create index if not exists idx_waitlist_lower_email
  on public.waitlist (lower(email));

create index if not exists idx_contact_messages_email_created
  on public.contact_messages (lower(email), created_at desc);

alter table public.reservations enable row level security;
alter table public.waitlist enable row level security;
alter table public.contact_messages enable row level security;
alter table public.time_slots enable row level security;
alter table public.closed_dates enable row level security;
alter table public.recurring_closures enable row level security;
alter table public.menu_items enable row level security;
alter table public.feature_flags enable row level security;
alter table public.restaurants enable row level security;
alter table public.tables enable row level security;
alter table public.reservation_settings enable row level security;
alter table public.occasions enable row level security;
alter table public.reservation_statuses enable row level security;

-- ---------------------------------------------------------------------------
-- Authorization helper
-- ---------------------------------------------------------------------------

create or replace function private.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Remove permissive legacy policies
-- ---------------------------------------------------------------------------

drop policy if exists "Users can create their own reservations" on public.reservations;
drop policy if exists "Users can view their own reservations" on public.reservations;
drop policy if exists "Users can update their own reservations" on public.reservations;
drop policy if exists "Anyone can create reservations" on public.reservations;
drop policy if exists "Public can view their own reservations" on public.reservations;
drop policy if exists "Authenticated users can manage all reservations" on public.reservations;

drop policy if exists "Time slots are viewable by everyone" on public.time_slots;
drop policy if exists "Public can view active time slots" on public.time_slots;
drop policy if exists "Authenticated users can manage all time slots" on public.time_slots;

drop policy if exists "Anyone can join waitlist" on public.waitlist;
drop policy if exists "Public can view own waitlist entries" on public.waitlist;
drop policy if exists "Authenticated users can manage waitlist" on public.waitlist;

drop policy if exists "Anyone can create contact messages" on public.contact_messages;
drop policy if exists "Authenticated users can read contact messages" on public.contact_messages;
drop policy if exists "Authenticated users can update contact messages" on public.contact_messages;

drop policy if exists "Authenticated users can manage menu items" on public.menu_items;
drop policy if exists "Authenticated users can manage closed dates" on public.closed_dates;
drop policy if exists "Authenticated users can manage recurring closures" on public.recurring_closures;
drop policy if exists "Authenticated users can manage feature flags" on public.feature_flags;
drop policy if exists "Authenticated users can manage all tables" on public.restaurants;
drop policy if exists "Public can view active tables" on public.tables;
drop policy if exists "Public can view reservation statuses" on public.reservation_statuses;
drop policy if exists "Anyone can view recurring closures" on public.recurring_closures;

-- ---------------------------------------------------------------------------
-- Least-privilege table grants
-- ---------------------------------------------------------------------------

revoke all on table public.reservations from anon;
revoke all on table public.waitlist from anon;
revoke all on table public.contact_messages from anon;
revoke all on table public.time_slots from anon;
revoke all on table public.closed_dates from anon;
revoke all on table public.recurring_closures from anon;
revoke all on table public.tables from anon;
revoke all on table public.reservation_settings from anon;
revoke all on table public.reservation_statuses from anon;

grant select on table public.menu_items to anon, authenticated;
grant select on table public.restaurants to anon, authenticated;
grant select on table public.occasions to anon, authenticated;
grant select on table public.feature_flags to anon, authenticated;
grant select on table public.closed_dates to anon, authenticated;

grant select, insert, update, delete on table public.reservations to authenticated;
grant select, insert, update, delete on table public.waitlist to authenticated;
grant select, insert, update, delete on table public.contact_messages to authenticated;
grant select, insert, update, delete on table public.time_slots to authenticated;
grant select, insert, update, delete on table public.closed_dates to authenticated;
grant select, insert, update, delete on table public.recurring_closures to authenticated;
grant select, insert, update, delete on table public.menu_items to authenticated;
grant select, insert, update, delete on table public.feature_flags to authenticated;
grant select, insert, update, delete on table public.restaurants to authenticated;
grant select, insert, update, delete on table public.tables to authenticated;
grant select, insert, update, delete on table public.reservation_settings to authenticated;
grant select, insert, update, delete on table public.occasions to authenticated;
grant select, insert, update, delete on table public.reservation_statuses to authenticated;

grant all on table public.reservations, public.waitlist, public.contact_messages,
  public.time_slots, public.closed_dates, public.recurring_closures,
  public.menu_items, public.feature_flags, public.restaurants, public.tables,
  public.reservation_settings, public.occasions, public.reservation_statuses
  to service_role;

-- Prevent future public-schema tables from being exposed accidentally. New
-- objects must opt in with an explicit GRANT in their own migration.
alter default privileges for role postgres in schema public
  revoke select, insert, update, delete on tables from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke usage, select on sequences from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Administrator policies
-- ---------------------------------------------------------------------------

create policy "Admins can manage reservations"
  on public.reservations for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admins can manage waitlist"
  on public.waitlist for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admins can manage contact messages"
  on public.contact_messages for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admins can manage time slots"
  on public.time_slots for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admins can manage closed dates"
  on public.closed_dates for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admins can manage recurring closures"
  on public.recurring_closures for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admins can manage menu items"
  on public.menu_items for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admins can manage feature flags"
  on public.feature_flags for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admins can manage restaurants"
  on public.restaurants for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admins can manage restaurant tables"
  on public.tables for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admins can manage reservation settings"
  on public.reservation_settings for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admins can manage occasions"
  on public.occasions for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admins can manage reservation statuses"
  on public.reservation_statuses for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

-- Public catalogue rows remain deliberately readable.
drop policy if exists "Anyone can read menu items" on public.menu_items;
create policy "Public can read active menu items"
  on public.menu_items for select to anon, authenticated
  using (active is true);

-- ---------------------------------------------------------------------------
-- Safe public availability
-- ---------------------------------------------------------------------------

create or replace function private.get_public_availability(p_date date)
returns table (
  slot_id uuid,
  slot_time time without time zone,
  available boolean,
  remaining_capacity integer,
  max_capacity integer,
  is_lunch boolean,
  is_recurring_closed boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  with booked as (
    select r.time, coalesce(sum(r.guests), 0)::integer as guests
    from public.reservations r
    where r.date = p_date
      and r.status in ('pending', 'confirmed')
    group by r.time
  ),
  date_state as (
    select exists (
      select 1 from public.closed_dates cd where cd.date = p_date
    ) as is_closed
  )
  select
    ts.id,
    ts.time,
    not ds.is_closed
      and not exists (
        select 1
        from public.recurring_closures rc
        where rc.active is true
          and rc.day_of_week = extract(dow from p_date)::integer
          and ts.time between rc.start_time and rc.end_time
      )
      and coalesce(b.guests, 0) < ts.max_capacity as available,
    greatest(0, ts.max_capacity - coalesce(b.guests, 0))::integer,
    ts.max_capacity,
    ts.is_lunch,
    exists (
      select 1
      from public.recurring_closures rc
      where rc.active is true
        and rc.day_of_week = extract(dow from p_date)::integer
        and ts.time between rc.start_time and rc.end_time
    ) as is_recurring_closed
  from public.time_slots ts
  cross join date_state ds
  left join booked b on b.time = ts.time
  where ts.is_active is true
    and p_date between (current_timestamp at time zone 'Europe/Rome')::date
      and ((current_timestamp at time zone 'Europe/Rome')::date + interval '3 months')::date
  order by ts.time;
$$;

create or replace function public.get_public_availability(p_date date)
returns table (
  slot_id uuid,
  slot_time time without time zone,
  available boolean,
  remaining_capacity integer,
  max_capacity integer,
  is_lunch boolean,
  is_recurring_closed boolean
)
language sql
stable
security invoker
set search_path = ''
as $$
  select * from private.get_public_availability($1);
$$;

-- ---------------------------------------------------------------------------
-- Atomic public reservation creation
-- ---------------------------------------------------------------------------

create or replace function private.create_public_reservation(
  p_date date,
  p_time time without time zone,
  p_guests integer,
  p_name text,
  p_email text,
  p_phone text,
  p_occasion text default null,
  p_special_requests text default null,
  p_marketing_consent boolean default false,
  p_locale text default 'en',
  p_attribution jsonb default '{}'::jsonb
)
returns table (reservation_id uuid, cancellation_token uuid)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_today date := (current_timestamp at time zone 'Europe/Rome')::date;
  v_email text := lower(btrim(p_email));
  v_name text := btrim(p_name);
  v_phone text := btrim(p_phone);
  v_max_capacity integer;
  v_booked integer;
begin
  if p_date is null or p_time is null then
    raise exception 'A reservation date and time are required' using errcode = '22023';
  end if;
  if p_date < v_today or p_date > (v_today + interval '3 months')::date then
    raise exception 'The selected date is outside the booking window' using errcode = '22023';
  end if;
  if (p_date + p_time) at time zone 'Europe/Rome' <= current_timestamp then
    raise exception 'The selected time has already passed' using errcode = '22023';
  end if;
  if p_guests is null or p_guests < 1 or p_guests > 8 then
    raise exception 'Online reservations support between 1 and 8 guests' using errcode = '22023';
  end if;
  if char_length(v_name) < 2 or char_length(v_name) > 120 then
    raise exception 'Please provide a valid name' using errcode = '22023';
  end if;
  if char_length(v_email) > 254 or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$' then
    raise exception 'Please provide a valid email address' using errcode = '22023';
  end if;
  if char_length(v_phone) < 6 or char_length(v_phone) > 40 then
    raise exception 'Please provide a valid phone number' using errcode = '22023';
  end if;
  if char_length(coalesce(p_occasion, '')) > 80
     or char_length(coalesce(p_special_requests, '')) > 1000 then
    raise exception 'Reservation notes are too long' using errcode = '22023';
  end if;
  if p_locale not in ('en', 'it', 'fr', 'de', 'es') then
    raise exception 'Unsupported locale' using errcode = '22023';
  end if;
  if jsonb_typeof(coalesce(p_attribution, '{}'::jsonb)) <> 'object'
     or octet_length(coalesce(p_attribution, '{}'::jsonb)::text) > 4000 then
    raise exception 'Invalid attribution data' using errcode = '22023';
  end if;

  -- One short transaction-level lock per date/time makes the capacity check
  -- and insert atomic for concurrent visitors.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_date::text || '|' || p_time::text, 0)
  );

  select ts.max_capacity
  into v_max_capacity
  from public.time_slots ts
  where ts.time = p_time
    and ts.is_active is true
  limit 1;

  if v_max_capacity is null then
    raise exception 'The selected time is not available' using errcode = 'P0001';
  end if;
  if exists (select 1 from public.closed_dates cd where cd.date = p_date) then
    raise exception 'The restaurant is closed on the selected date' using errcode = 'P0001';
  end if;
  if exists (
    select 1
    from public.recurring_closures rc
    where rc.active is true
      and rc.day_of_week = extract(dow from p_date)::integer
      and p_time between rc.start_time and rc.end_time
  ) then
    raise exception 'The selected time is not available' using errcode = 'P0001';
  end if;
  if exists (
    select 1
    from public.reservations r
    where r.date = p_date
      and r.time = p_time
      and lower(r.email) = v_email
      and r.status in ('pending', 'confirmed')
  ) then
    raise exception 'A reservation already exists for this email, date and time' using errcode = '23505';
  end if;
  if (
    select count(*)
    from public.reservations r
    where lower(r.email) = v_email
      and r.created_at > current_timestamp - interval '15 minutes'
  ) >= 3 then
    raise exception 'Too many recent reservation attempts' using errcode = 'P0001';
  end if;

  select coalesce(sum(r.guests), 0)::integer
  into v_booked
  from public.reservations r
  where r.date = p_date
    and r.time = p_time
    and r.status in ('pending', 'confirmed');

  if v_booked + p_guests > v_max_capacity then
    raise exception 'There is not enough remaining capacity for this party' using errcode = 'P0001';
  end if;

  return query
  insert into public.reservations as new_reservation (
    date, time, guests, name, email, phone, occasion, special_requests,
    marketing_consent, status, source, locale, attribution
  ) values (
    p_date, p_time, p_guests, v_name, v_email, v_phone,
    nullif(btrim(p_occasion), ''), nullif(btrim(p_special_requests), ''),
    coalesce(p_marketing_consent, false), 'confirmed', 'online', p_locale,
    coalesce(p_attribution, '{}'::jsonb)
  )
  returning new_reservation.id, new_reservation.cancellation_token;
end;
$$;

create or replace function public.create_public_reservation(
  p_date date,
  p_time time without time zone,
  p_guests integer,
  p_name text,
  p_email text,
  p_phone text,
  p_occasion text default null,
  p_special_requests text default null,
  p_marketing_consent boolean default false,
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
  from private.create_public_reservation(
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
  );
$$;

-- ---------------------------------------------------------------------------
-- Safe waitlist creation
-- ---------------------------------------------------------------------------

create or replace function private.join_public_waitlist(
  p_date date,
  p_time time without time zone,
  p_guests integer,
  p_name text,
  p_email text,
  p_phone text,
  p_occasion text default null,
  p_special_requests text default null
)
returns table (waitlist_id uuid, "position" integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(btrim(p_email));
  v_position integer;
  v_max_capacity integer;
  v_booked integer;
begin
  if p_date is null or p_time is null
     or p_date < (current_timestamp at time zone 'Europe/Rome')::date
     or p_date > ((current_timestamp at time zone 'Europe/Rome')::date + interval '3 months')::date
     or (p_date + p_time) at time zone 'Europe/Rome' <= current_timestamp then
    raise exception 'A future date and time are required' using errcode = '22023';
  end if;
  if p_guests is null or p_guests < 1 or p_guests > 8 then
    raise exception 'The waitlist supports between 1 and 8 guests' using errcode = '22023';
  end if;
  if char_length(btrim(p_name)) < 2 or char_length(btrim(p_name)) > 120
     or char_length(v_email) > 254
     or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$'
     or char_length(btrim(p_phone)) < 6
     or char_length(btrim(p_phone)) > 40 then
    raise exception 'Invalid waitlist contact details' using errcode = '22023';
  end if;
  if char_length(coalesce(p_occasion, '')) > 80
     or char_length(coalesce(p_special_requests, '')) > 1000 then
    raise exception 'Waitlist notes are too long' using errcode = '22023';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('waitlist|' || p_date::text || '|' || p_time::text, 0)
  );

  select ts.max_capacity
  into v_max_capacity
  from public.time_slots ts
  where ts.time = p_time
    and ts.is_active is true
  limit 1;

  if v_max_capacity is null
     or exists (select 1 from public.closed_dates cd where cd.date = p_date)
     or exists (
       select 1 from public.recurring_closures rc
       where rc.active is true
         and rc.day_of_week = extract(dow from p_date)::integer
         and p_time between rc.start_time and rc.end_time
     ) then
    raise exception 'The selected time is not eligible for the waitlist' using errcode = 'P0001';
  end if;

  select coalesce(sum(r.guests), 0)::integer
  into v_booked
  from public.reservations r
  where r.date = p_date
    and r.time = p_time
    and r.status in ('pending', 'confirmed');

  if v_booked + p_guests <= v_max_capacity then
    raise exception 'The selected time is still available' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from public.waitlist w
    where w.date = p_date
      and w.time = p_time
      and lower(w.email) = v_email
      and w.status in ('waiting', 'notified')
  ) then
    raise exception 'This email is already on the waitlist for the selected time' using errcode = '23505';
  end if;

  select coalesce(max(w.position), 0) + 1
  into v_position
  from public.waitlist w
  where w.date = p_date
    and w.time = p_time
    and w.status in ('waiting', 'notified');

  return query
  insert into public.waitlist as new_waitlist_entry (
    date, time, guests, name, email, phone, occasion, special_requests,
    status, position
  ) values (
    p_date, p_time, p_guests, btrim(p_name), v_email, btrim(p_phone),
    nullif(btrim(p_occasion), ''), nullif(btrim(p_special_requests), ''),
    'waiting', v_position
  )
  returning new_waitlist_entry.id, new_waitlist_entry.position;
end;
$$;

create or replace function public.join_public_waitlist(
  p_date date,
  p_time time without time zone,
  p_guests integer,
  p_name text,
  p_email text,
  p_phone text,
  p_occasion text default null,
  p_special_requests text default null
)
returns table (waitlist_id uuid, "position" integer)
language sql
volatile
security invoker
set search_path = ''
as $$
  select * from private.join_public_waitlist($1, $2, $3, $4, $5, $6, $7, $8);
$$;

-- ---------------------------------------------------------------------------
-- Token-scoped reservation management
-- ---------------------------------------------------------------------------

create or replace function private.get_reservation_summary_by_token(p_token uuid)
returns table (
  id uuid,
  name text,
  "date" date,
  "time" time without time zone,
  guests integer,
  status text
)
language sql
stable
security definer
set search_path = ''
as $$
  select r.id, r.name, r.date, r.time, r.guests, r.status
  from public.reservations r
  where r.cancellation_token = p_token
  limit 1;
$$;

create or replace function public.get_reservation_summary_by_token(p_token uuid)
returns table (
  id uuid,
  name text,
  "date" date,
  "time" time without time zone,
  guests integer,
  status text
)
language sql
stable
security invoker
set search_path = ''
as $$
  select * from private.get_reservation_summary_by_token($1);
$$;

create or replace function private.cancel_reservation_by_token(p_token uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_status text;
  v_date date;
  v_time time without time zone;
begin
  select r.status, r.date, r.time
  into v_status, v_date, v_time
  from public.reservations r
  where r.cancellation_token = p_token
  for update;

  if not found then
    raise exception 'Reservation not found' using errcode = 'P0002';
  end if;
  if v_status = 'cancelled' then
    return 'already_cancelled';
  end if;
  if v_status = 'completed' then
    return 'already_completed';
  end if;
  if (v_date + v_time) at time zone 'Europe/Rome' <= current_timestamp then
    return 'already_completed';
  end if;

  update public.reservations
  set status = 'cancelled', updated_at = current_timestamp
  where cancellation_token = p_token;

  return 'cancelled';
end;
$$;

create or replace function public.cancel_reservation_by_token(p_token uuid)
returns text
language sql
volatile
security invoker
set search_path = ''
as $$
  select private.cancel_reservation_by_token($1);
$$;

-- ---------------------------------------------------------------------------
-- Safe contact form insertion
-- ---------------------------------------------------------------------------

create or replace function private.create_contact_message(
  p_first_name text,
  p_last_name text,
  p_email text,
  p_subject text,
  p_message text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_email text := lower(btrim(p_email));
begin
  if char_length(btrim(p_first_name)) < 1 or char_length(btrim(p_first_name)) > 80
     or char_length(btrim(p_last_name)) < 1 or char_length(btrim(p_last_name)) > 80
     or char_length(v_email) > 254
     or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$'
     or char_length(btrim(p_subject)) < 2 or char_length(btrim(p_subject)) > 160
     or char_length(btrim(p_message)) < 10 or char_length(btrim(p_message)) > 4000 then
    raise exception 'Invalid contact message' using errcode = '22023';
  end if;

  if exists (
    select 1
    from public.contact_messages cm
    where lower(cm.email) = v_email
      and cm.created_at > current_timestamp - interval '5 minutes'
  ) then
    raise exception 'Please wait before sending another message' using errcode = 'P0001';
  end if;

  insert into public.contact_messages (
    first_name, last_name, email, subject, message, status
  ) values (
    btrim(p_first_name), btrim(p_last_name), v_email,
    btrim(p_subject), btrim(p_message), 'unread'
  )
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function public.create_contact_message(
  p_first_name text,
  p_last_name text,
  p_email text,
  p_subject text,
  p_message text
)
returns uuid
language sql
volatile
security invoker
set search_path = ''
as $$
  select private.create_contact_message($1, $2, $3, $4, $5);
$$;

-- ---------------------------------------------------------------------------
-- Function privileges (explicit for current and upcoming Data API defaults)
-- ---------------------------------------------------------------------------

revoke execute on all functions in schema private from public, anon, authenticated;
revoke execute on function public.get_public_availability(date) from public;
revoke execute on function public.create_public_reservation(date, time without time zone, integer, text, text, text, text, text, boolean, text, jsonb) from public;
revoke execute on function public.join_public_waitlist(date, time without time zone, integer, text, text, text, text, text) from public;
revoke execute on function public.get_reservation_summary_by_token(uuid) from public;
revoke execute on function public.cancel_reservation_by_token(uuid) from public;
revoke execute on function public.create_contact_message(text, text, text, text, text) from public;

grant execute on function private.get_public_availability(date) to anon, authenticated, service_role;
grant execute on function private.create_public_reservation(date, time without time zone, integer, text, text, text, text, text, boolean, text, jsonb) to anon, authenticated, service_role;
grant execute on function private.join_public_waitlist(date, time without time zone, integer, text, text, text, text, text) to anon, authenticated, service_role;
grant execute on function private.get_reservation_summary_by_token(uuid) to anon, authenticated, service_role;
grant execute on function private.cancel_reservation_by_token(uuid) to anon, authenticated, service_role;
grant execute on function private.create_contact_message(text, text, text, text, text) to anon, authenticated, service_role;

grant execute on function public.get_public_availability(date) to anon, authenticated, service_role;
grant execute on function public.create_public_reservation(date, time without time zone, integer, text, text, text, text, text, boolean, text, jsonb) to anon, authenticated, service_role;
grant execute on function public.join_public_waitlist(date, time without time zone, integer, text, text, text, text, text) to anon, authenticated, service_role;
grant execute on function public.get_reservation_summary_by_token(uuid) to anon, authenticated, service_role;
grant execute on function public.cancel_reservation_by_token(uuid) to anon, authenticated, service_role;
grant execute on function public.create_contact_message(text, text, text, text, text) to anon, authenticated, service_role;

-- Re-grant the helper after the blanket private-function revoke.
grant execute on function private.is_admin() to authenticated, service_role;
