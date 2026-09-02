-- Let guests update the time by one adjacent half-hour slot and edit their
-- notes through the private management link. All business rules live in the
-- database so they cannot be bypassed by calling the API directly.

alter table public.reservations
  add column if not exists self_service_updated_at timestamptz;

create or replace function private.is_reservation_change_slot_available(
  p_reservation_id uuid,
  p_date date,
  p_time time without time zone,
  p_guests integer
)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select p_time is not null
    and not exists (
      select 1
      from public.closed_dates cd
      where cd.date = p_date
    )
    and exists (
      select 1
      from public.time_slots ts
      where ts.time = p_time
        and ts.is_active is true
        and not exists (
          select 1
          from public.recurring_closures rc
          where rc.active is true
            and rc.day_of_week = extract(dow from p_date)::integer
            and p_time between rc.start_time and rc.end_time
        )
        and coalesce((
          select sum(r.guests)
          from public.reservations r
          where r.date = p_date
            and r.time = p_time
            and r.status in ('pending', 'confirmed')
            and r.id <> p_reservation_id
        ), 0) + p_guests <= ts.max_capacity
    );
$$;

create or replace function private.get_reservation_management_by_token(p_token uuid)
returns table (
  id uuid,
  name text,
  "date" date,
  "time" time without time zone,
  guests integer,
  status text,
  special_requests text,
  can_modify boolean,
  can_modify_time boolean,
  earlier_time time without time zone,
  later_time time without time zone
)
language sql
stable
security definer
set search_path = ''
as $$
  with booking as (
    select
      r.id,
      r.name,
      r.date,
      r.time,
      r.guests,
      r.status,
      r.special_requests,
      r.status in ('pending', 'confirmed')
        and (r.date + r.time) at time zone 'Europe/Rome'
          > current_timestamp as can_modify,
      r.status in ('pending', 'confirmed')
        and (r.date + r.time) at time zone 'Europe/Rome'
          > current_timestamp + interval '24 hours' as can_modify_time
    from public.reservations r
    where r.cancellation_token = p_token
    limit 1
  )
  select
    b.id,
    b.name,
    b.date,
    b.time,
    b.guests,
    b.status,
    b.special_requests,
    b.can_modify,
    b.can_modify_time,
    case
      when b.can_modify_time
        and (b.date + (b.time - interval '30 minutes')) at time zone 'Europe/Rome'
          > current_timestamp + interval '24 hours'
        and private.is_reservation_change_slot_available(
          b.id, b.date, b.time - interval '30 minutes', b.guests
        )
      then b.time - interval '30 minutes'
      else null
    end as earlier_time,
    case
      when b.can_modify_time
        and private.is_reservation_change_slot_available(
          b.id, b.date, b.time + interval '30 minutes', b.guests
        )
      then b.time + interval '30 minutes'
      else null
    end as later_time
  from booking b;
$$;

create or replace function public.get_reservation_management_by_token(p_token uuid)
returns table (
  id uuid,
  name text,
  "date" date,
  "time" time without time zone,
  guests integer,
  status text,
  special_requests text,
  can_modify boolean,
  can_modify_time boolean,
  earlier_time time without time zone,
  later_time time without time zone
)
language sql
stable
security invoker
set search_path = ''
as $$
  select * from private.get_reservation_management_by_token($1);
$$;

create or replace function private.update_reservation_by_token(
  p_token uuid,
  p_time time without time zone,
  p_special_requests text default null
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_reservation public.reservations%rowtype;
  v_notes text := nullif(btrim(coalesce(p_special_requests, '')), '');
begin
  select r.*
  into v_reservation
  from public.reservations r
  where r.cancellation_token = p_token
  for update;

  if not found then
    return 'not_found';
  end if;
  if v_reservation.status = 'cancelled' then
    return 'already_cancelled';
  end if;
  if v_reservation.status not in ('pending', 'confirmed')
     or (v_reservation.date + v_reservation.time) at time zone 'Europe/Rome'
       <= current_timestamp then
    return 'already_completed';
  end if;
  if p_time is null
     or (
       p_time <> v_reservation.time
       and p_time <> v_reservation.time - interval '30 minutes'
       and p_time <> v_reservation.time + interval '30 minutes'
     ) then
    return 'invalid_time';
  end if;
  if p_time <> v_reservation.time
     and (
       (v_reservation.date + v_reservation.time) at time zone 'Europe/Rome'
         <= current_timestamp + interval '24 hours'
       or (v_reservation.date + p_time) at time zone 'Europe/Rome'
         <= current_timestamp + interval '24 hours'
     ) then
    return 'too_late';
  end if;
  if char_length(coalesce(p_special_requests, '')) > 1000 then
    return 'notes_too_long';
  end if;
  if p_time = v_reservation.time
     and v_notes is not distinct from v_reservation.special_requests then
    return 'unchanged';
  end if;

  if p_time <> v_reservation.time then
    perform pg_catalog.pg_advisory_xact_lock(
      pg_catalog.hashtextextended(v_reservation.date::text || '|' || p_time::text, 0)
    );

    if not private.is_reservation_change_slot_available(
      v_reservation.id,
      v_reservation.date,
      p_time,
      v_reservation.guests
    ) then
      return 'unavailable';
    end if;
  end if;

  update public.reservations
  set
    time = p_time,
    special_requests = v_notes,
    confirmation_sent_at = null,
    reminder_sent_at = case
      when p_time <> v_reservation.time then null
      else reminder_sent_at
    end,
    reminder_2h_sent_at = case
      when p_time <> v_reservation.time then null
      else reminder_2h_sent_at
    end,
    self_service_updated_at = current_timestamp,
    updated_at = current_timestamp
  where id = v_reservation.id;

  return 'updated';
end;
$$;

create or replace function public.update_reservation_by_token(
  p_token uuid,
  p_time time without time zone,
  p_special_requests text default null
)
returns text
language sql
volatile
security invoker
set search_path = ''
as $$
  select private.update_reservation_by_token($1, $2, $3);
$$;

revoke execute on function private.is_reservation_change_slot_available(uuid, date, time without time zone, integer) from public, anon, authenticated;
revoke execute on function private.get_reservation_management_by_token(uuid) from public, anon, authenticated;
revoke execute on function private.update_reservation_by_token(uuid, time without time zone, text) from public, anon, authenticated;
revoke execute on function public.get_reservation_management_by_token(uuid) from public;
revoke execute on function public.update_reservation_by_token(uuid, time without time zone, text) from public;

grant execute on function private.get_reservation_management_by_token(uuid) to anon, authenticated, service_role;
grant execute on function private.update_reservation_by_token(uuid, time without time zone, text) to anon, authenticated, service_role;
grant execute on function public.get_reservation_management_by_token(uuid) to anon, authenticated, service_role;
grant execute on function public.update_reservation_by_token(uuid, time without time zone, text) to anon, authenticated, service_role;
