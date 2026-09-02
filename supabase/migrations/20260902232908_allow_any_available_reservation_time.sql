-- Let guests move a reservation to any available active slot on the same date.
-- The existing 24-hour cutoff, service closures and capacity checks still apply.
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
  if p_time is null then
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

revoke execute on function private.update_reservation_by_token(uuid, time without time zone, text)
  from public, anon, authenticated;
grant execute on function private.update_reservation_by_token(uuid, time without time zone, text)
  to anon, authenticated, service_role;
