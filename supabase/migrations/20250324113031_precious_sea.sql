alter table public.time_slots
  add column if not exists description text,
  add column if not exists location text,
  add column if not exists status text not null default 'available'
    check (status in ('available', 'booked', 'blocked')),
  add column if not exists booked_capacity integer not null default 0,
  add column if not exists end_time time;

update public.time_slots
set end_time = (time + interval '30 minutes')::time
where end_time is null;

alter table public.time_slots
  alter column end_time set not null,
  add constraint valid_time_range check (time < end_time),
  add constraint valid_capacity check (booked_capacity <= max_capacity);

create index if not exists idx_time_slots_status on public.time_slots (status);
create index if not exists idx_time_slots_time_range on public.time_slots (time, end_time);
