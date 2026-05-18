-- Order list for signed-in account / order history (email must match orders.contact_email).
-- Run in Supabase SQL Editor after get_public_order_rpc.sql. Safe to re-run.

create or replace function public.get_customer_orders(p_email text)
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  norm text := lower(trim(coalesce(p_email, '')));
  result jsonb;
begin
  if length(norm) = 0 then
    return '[]'::jsonb;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', o.id,
        'order_number', o.order_number,
        'status', o.status,
        'payment_status', o.payment_status,
        'total', o.total,
        'created_at', o.created_at
      )
      order by o.created_at desc
    ),
    '[]'::jsonb
  ) into result
  from public.orders o
  where lower(trim(coalesce(o.contact_email, ''))) = norm;

  return result;
end;
$$;

revoke all on function public.get_customer_orders(text) from public;
grant execute on function public.get_customer_orders(text) to anon, authenticated;
