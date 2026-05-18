-- Per-product institutional reviews (storefront read-only).
-- Run in Supabase SQL Editor after schema.sql. Safe to re-run.

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  author_name text not null,
  author_title text,
  institution text,
  rating smallint not null check (rating between 1 and 5),
  title text,
  body text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists product_reviews_product_id_idx
  on public.product_reviews (product_id, created_at desc);

alter table public.product_reviews enable row level security;

drop policy if exists "anon read published product reviews" on public.product_reviews;
create policy "anon read published product reviews"
  on public.product_reviews for select to anon, authenticated
  using (is_published = true);

comment on table public.product_reviews is 'Published buyer/lab feedback shown on PDP review sections.';
