-- Enforce the admin kill switches at the public RPC boundary. The UI also
-- fails closed, but these checks prevent an embedded or custom client from
-- bypassing a disabled feature by calling the Data API directly.

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
language plpgsql
volatile
security invoker
set search_path = ''
as $$
begin
  if not coalesce((
    select ff.enabled
    from public.feature_flags ff
    where ff.key = 'online_reservations'
    limit 1
  ), false) then
    raise exception 'Online reservations are temporarily unavailable' using errcode = 'P0001';
  end if;

  return query
  select *
  from private.create_public_reservation(
    p_date, p_time, p_guests, p_name, p_email, p_phone, p_occasion,
    p_special_requests, p_marketing_consent, p_locale, p_attribution
  );
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
language plpgsql
volatile
security invoker
set search_path = ''
as $$
begin
  if not coalesce((
    select ff.enabled
    from public.feature_flags ff
    where ff.key = 'online_reservations'
    limit 1
  ), false) or not coalesce((
    select ff.enabled
    from public.feature_flags ff
    where ff.key = 'waitlist'
    limit 1
  ), false) then
    raise exception 'The online waitlist is temporarily unavailable' using errcode = 'P0001';
  end if;

  return query
  select *
  from private.join_public_waitlist(
    p_date, p_time, p_guests, p_name, p_email, p_phone, p_occasion,
    p_special_requests
  );
end;
$$;

create or replace function public.cancel_reservation_by_token(p_token uuid)
returns text
language plpgsql
volatile
security invoker
set search_path = ''
as $$
begin
  if not coalesce((
    select ff.enabled
    from public.feature_flags ff
    where ff.key = 'cancellation_selfserve'
    limit 1
  ), false) then
    raise exception 'Online cancellation is temporarily unavailable' using errcode = 'P0001';
  end if;

  return private.cancel_reservation_by_token(p_token);
end;
$$;
