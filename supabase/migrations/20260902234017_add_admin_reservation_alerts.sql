-- Track three operational email alerts for the restaurant and invoke the
-- delivery function every five minutes. Secret values stay in Supabase Vault;
-- the scheduled command only references their stable names.

alter table public.reservations
  add column if not exists admin_alert_24h_sent_at timestamptz,
  add column if not exists admin_alert_morning_sent_at timestamptz,
  add column if not exists admin_alert_45m_sent_at timestamptz;

comment on column public.reservations.admin_alert_24h_sent_at is
  'Restaurant alert sent approximately 24 hours before service.';
comment on column public.reservations.admin_alert_morning_sent_at is
  'Restaurant alert sent at 09:00 Europe/Rome on the reservation date.';
comment on column public.reservations.admin_alert_45m_sent_at is
  'Restaurant alert sent approximately 45 minutes before service.';

update public.feature_flags
set
  label = 'Promemoria email',
  description = 'Invia promemoria ai clienti e avvisi operativi al ristorante'
where key = 'reminder_emails';

create or replace function private.reset_reservation_alerts_on_schedule_change()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.date is distinct from old.date or new.time is distinct from old.time then
    new.reminder_sent_at := null;
    new.reminder_2h_sent_at := null;
    new.admin_alert_24h_sent_at := null;
    new.admin_alert_morning_sent_at := null;
    new.admin_alert_45m_sent_at := null;
  end if;
  return new;
end;
$$;

revoke execute on function private.reset_reservation_alerts_on_schedule_change()
  from public, anon, authenticated;

drop trigger if exists reset_reservation_alerts_on_schedule_change
  on public.reservations;
create trigger reset_reservation_alerts_on_schedule_change
before update of date, time on public.reservations
for each row
execute function private.reset_reservation_alerts_on_schedule_change();

create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

do $setup$
declare
  v_missing_secret_names text[];
begin
  select array_agg(required.name order by required.name)
  into v_missing_secret_names
  from (
    values
      ('admin_alert_cron_secret'),
      ('project_anon_key'),
      ('project_url')
  ) as required(name)
  where not exists (
    select 1
    from vault.secrets secret
    where secret.name = required.name
  );

  if v_missing_secret_names is not null then
    raise exception 'Missing Vault secrets required for reservation alerts: %',
      array_to_string(v_missing_secret_names, ', ');
  end if;

  perform cron.unschedule(job.jobid)
  from cron.job job
  where job.jobname = 'send-admin-reservation-alerts-every-5-minutes';

  perform cron.schedule(
    'send-admin-reservation-alerts-every-5-minutes',
    '*/5 * * * *',
    $command$
      select net.http_post(
        url := (
          select decrypted_secret
          from vault.decrypted_secrets
          where name = 'project_url'
        ) || '/functions/v1/send-admin-reservation-alerts',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'apikey', (
            select decrypted_secret
            from vault.decrypted_secrets
            where name = 'project_anon_key'
          ),
          'Authorization', 'Bearer ' || (
            select decrypted_secret
            from vault.decrypted_secrets
            where name = 'project_anon_key'
          ),
          'x-reminder-secret', (
            select decrypted_secret
            from vault.decrypted_secrets
            where name = 'admin_alert_cron_secret'
          )
        ),
        body := '{}'::jsonb,
        timeout_milliseconds := 10000
      ) as request_id;
    $command$
  );
end;
$setup$;
