-- Aggregated campaign inputs used by the private marketing dashboard.
-- These rows never contain guest or reservation personal data.

create table if not exists public.marketing_campaign_metrics (
  id uuid primary key default gen_random_uuid(),
  metric_date date not null,
  channel text not null,
  campaign text not null default 'all',
  impressions bigint not null default 0,
  clicks bigint not null default 0,
  sessions bigint not null default 0,
  spend_eur numeric(12, 2) not null default 0,
  revenue_eur numeric(12, 2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint marketing_campaign_metrics_channel_format
    check (channel ~ '^[a-z0-9_]{2,50}$'),
  constraint marketing_campaign_metrics_campaign_length
    check (char_length(btrim(campaign)) between 1 and 120),
  constraint marketing_campaign_metrics_counts_nonnegative
    check (impressions >= 0 and clicks >= 0 and sessions >= 0),
  constraint marketing_campaign_metrics_clicks_within_impressions
    check (impressions = 0 or clicks <= impressions),
  constraint marketing_campaign_metrics_money_nonnegative
    check (spend_eur >= 0 and revenue_eur >= 0),
  constraint marketing_campaign_metrics_notes_length
    check (notes is null or char_length(notes) <= 500),
  constraint marketing_campaign_metrics_day_channel_campaign_key
    unique (metric_date, channel, campaign)
);

comment on table public.marketing_campaign_metrics is
  'Daily aggregate marketing costs and outcomes; admin-only and free of customer PII.';

alter table public.marketing_campaign_metrics enable row level security;

revoke all on table public.marketing_campaign_metrics from public, anon;
grant select, insert, update, delete on table public.marketing_campaign_metrics to authenticated;
grant all on table public.marketing_campaign_metrics to service_role;

drop policy if exists "Admins can manage marketing campaign metrics"
  on public.marketing_campaign_metrics;
create policy "Admins can manage marketing campaign metrics"
  on public.marketing_campaign_metrics
  for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

drop trigger if exists set_marketing_campaign_metrics_updated_at
  on public.marketing_campaign_metrics;
create trigger set_marketing_campaign_metrics_updated_at
  before update on public.marketing_campaign_metrics
  for each row execute function public.update_updated_at_column();
