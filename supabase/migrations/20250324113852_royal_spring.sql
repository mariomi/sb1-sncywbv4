alter table public.time_slots drop constraint if exists valid_capacity;
alter table public.time_slots drop column if exists booked_capacity;
