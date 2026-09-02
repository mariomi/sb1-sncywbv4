-- Qualify reservation columns so they cannot be confused with the output
-- column names exposed by the table-returning PL/pgSQL function.

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

revoke execute on function private.create_public_reservation_with_channels(
  date, time without time zone, integer, text, text, text, text, text, boolean, boolean, text, jsonb
) from public, anon, authenticated;

grant execute on function private.create_public_reservation_with_channels(
  date, time without time zone, integer, text, text, text, text, text, boolean, boolean, text, jsonb
) to anon, authenticated, service_role;
