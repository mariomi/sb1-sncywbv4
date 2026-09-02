-- A table can serve at most one active reservation for an exact service slot.
-- Refuse the migration instead of guessing which reservation to keep if legacy
-- data ever violates that invariant.
do $$
begin
  if exists (
    select 1
    from public.reservations
    where table_id is not null
      and status in ('pending', 'confirmed')
    group by date, time, table_id
    having count(*) > 1
  ) then
    raise exception 'Cannot enforce table assignment uniqueness: duplicate active assignments exist';
  end if;
end;
$$;

create unique index if not exists reservations_active_table_slot_unique
  on public.reservations (date, time, table_id)
  where table_id is not null
    and status in ('pending', 'confirmed');
