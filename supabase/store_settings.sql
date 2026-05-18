-- Key-value store settings (admin-editable). Run in Supabase SQL editor.

create table if not exists public.store_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists idx_store_settings_updated on public.store_settings (updated_at desc);

comment on table public.store_settings is 'Admin-managed storefront configuration (general, payments, notifications, operations).';

alter table public.store_settings enable row level security;

drop policy if exists "authenticated read store_settings" on public.store_settings;
create policy "authenticated read store_settings"
on public.store_settings for select to authenticated using (true);

drop policy if exists "authenticated write store_settings" on public.store_settings;
create policy "authenticated write store_settings"
on public.store_settings for all to authenticated using (true) with check (true);

-- Seed defaults (safe to re-run)
insert into public.store_settings (key, value) values
  ('general', jsonb_build_object(
    'storeName', 'Premium Peptides Lab',
    'supportEmail', 'support@premiumpeptideslab.online',
    'complianceStatement', 'All products listed are strictly for in-vitro research use only. Not for human consumption.',
    'siteUrl', 'https://premiumpeptideslab.online'
  )),
  ('payments', jsonb_build_object(
    'enabledMethods', jsonb_build_array(
      'credit-card', 'bitcoin', 'zelle', 'bank-transfer', 'cashapp', 'chime', 'apple-cash'
    )
  )),
  ('notifications', jsonb_build_object(
    'orderStatusEmail', true,
    'orderConfirmationEmail', true
  )),
  ('operations', jsonb_build_object(
    'scraperLogRetentionDays', 30
  ))
on conflict (key) do nothing;
