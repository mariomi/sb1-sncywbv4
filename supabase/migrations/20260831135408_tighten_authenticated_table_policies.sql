-- Remove the legacy broad policy from either table name it may have been
-- attached to in older environments. The 20260831112045 migration targeted
-- restaurants, while the live advisor reports the same policy on tables.
drop policy if exists "Authenticated users can manage all tables" on public.tables;
drop policy if exists "Authenticated users can manage all tables" on public.restaurants;

-- Public catalogue/configuration reads only need the anonymous role. Admins
-- already receive SELECT through the role-checked FOR ALL policies. Restricting
-- these policies to anon prevents a permissive public policy from being OR-ed
-- with the administrator policy for every authenticated request.
drop policy if exists "Anyone can view closed dates" on public.closed_dates;
create policy "Anyone can view closed dates"
  on public.closed_dates for select to anon
  using (true);

drop policy if exists "Public can read feature flags" on public.feature_flags;
create policy "Public can read feature flags"
  on public.feature_flags for select to anon
  using (true);

drop policy if exists "Public can read active menu items" on public.menu_items;
create policy "Public can read active menu items"
  on public.menu_items for select to anon
  using (active is true);

drop policy if exists "Public can view active occasions" on public.occasions;
create policy "Public can view active occasions"
  on public.occasions for select to anon
  using (is_active is true);

drop policy if exists "Public can view active restaurants" on public.restaurants;
create policy "Public can view active restaurants"
  on public.restaurants for select to anon
  using (true);

-- The trigger only reads CURRENT_TIMESTAMP and NEW, so it needs no schema
-- lookup. Pinning an empty search_path removes a function-hijacking surface.
alter function public.update_updated_at_column() set search_path = '';
