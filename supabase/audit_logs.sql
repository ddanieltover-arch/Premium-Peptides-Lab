-- Audit trail for catalog + orders. Run after core schema.
-- Inserts are performed by triggers only (SECURITY DEFINER); admins read via RLS.

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  actor_id uuid,
  actor_email text,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists idx_audit_logs_created_at on public.audit_logs (created_at desc);
create index if not exists idx_audit_logs_entity on public.audit_logs (entity_type, entity_id);
create index if not exists idx_audit_logs_actor on public.audit_logs (actor_id);

comment on table public.audit_logs is 'Row-level change history (orders, products, categories). Written by DB triggers; no direct client inserts.';

create or replace function public.audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid;
  em text;
begin
  uid := nullif(trim(coalesce(current_setting('request.jwt.claim.sub', true), '')), '')::uuid;
  em := nullif(trim(coalesce(current_setting('request.jwt.claim.email', true), '')), '');

  if tg_op = 'DELETE' then
    insert into public.audit_logs (action, entity_type, entity_id, actor_id, actor_email, metadata)
    values (
      tg_table_schema || '.' || tg_table_name || '.delete',
      tg_table_name,
      old.id,
      uid,
      em,
      jsonb_build_object('op', 'delete', 'row', to_jsonb(old))
    );
    return old;
  elsif tg_op = 'UPDATE' then
    insert into public.audit_logs (action, entity_type, entity_id, actor_id, actor_email, metadata)
    values (
      tg_table_schema || '.' || tg_table_name || '.update',
      tg_table_name,
      new.id,
      uid,
      em,
      jsonb_build_object('op', 'update', 'before', to_jsonb(old), 'after', to_jsonb(new))
    );
    return new;
  elsif tg_op = 'INSERT' then
    insert into public.audit_logs (action, entity_type, entity_id, actor_id, actor_email, metadata)
    values (
      tg_table_schema || '.' || tg_table_name || '.insert',
      tg_table_name,
      new.id,
      uid,
      em,
      jsonb_build_object('op', 'insert', 'row', to_jsonb(new))
    );
    return new;
  end if;

  return null;
end;
$$;

drop trigger if exists trg_audit_orders on public.orders;
create trigger trg_audit_orders
after insert or update or delete on public.orders
for each row execute function public.audit_row_change();

drop trigger if exists trg_audit_products on public.products;
create trigger trg_audit_products
after insert or update or delete on public.products
for each row execute function public.audit_row_change();

drop trigger if exists trg_audit_categories on public.categories;
create trigger trg_audit_categories
after insert or update or delete on public.categories
for each row execute function public.audit_row_change();

alter table public.audit_logs enable row level security;

drop policy if exists "authenticated select audit_logs" on public.audit_logs;
create policy "authenticated select audit_logs"
on public.audit_logs
for select
to authenticated
using (true);
