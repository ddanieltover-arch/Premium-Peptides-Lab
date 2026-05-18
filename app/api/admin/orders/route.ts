import { NextResponse } from 'next/server';
import { getUserFromAdminBearer, unauthorizedResponse } from '@/lib/admin/auth';
import { createServiceRoleClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const ORDER_LIST_SELECT =
  'id, order_number, created_at, updated_at, total, subtotal, shipping_cost, status, payment_status, payment_method, shipping_method, contact_email, contact_phone, notes, shipping_address_json, customer_id';

async function paginateOrders(
  admin: ReturnType<typeof createServiceRoleClient>,
  select: string,
  ascending: boolean,
) {
  const pageSize = 1000;
  let from = 0;
  const rows: unknown[] = [];
  while (true) {
    const { data, error } = await admin
      .from('orders')
      .select(select)
      .order('created_at', { ascending })
      .range(from, from + pageSize - 1);
    if (error) throw error;
    const chunk = data ?? [];
    rows.push(...chunk);
    if (chunk.length < pageSize) break;
    from += pageSize;
    if (from > 500_000) break;
  }
  return rows;
}

export async function GET(req: Request) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? null;
  const user = await getUserFromAdminBearer(token);
  if (!user) return unauthorizedResponse();

  let admin;
  try {
    admin = createServiceRoleClient();
  } catch {
    return NextResponse.json({ error: 'Server missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 503 });
  }

  const url = new URL(req.url);
  const slim = url.searchParams.get('slim') === '1';
  const limit = Math.min(100, Math.max(0, parseInt(url.searchParams.get('limit') || '0', 10) || 0));
  const withCustomer = url.searchParams.get('withCustomer') === '1';

  try {
    if (limit > 0) {
      const select =
        withCustomer && !slim
          ? `*, customer:customers(name)`
          : slim
            ? 'id, total, created_at'
            : ORDER_LIST_SELECT;
      const { data, error } = await admin
        .from('orders')
        .select(select)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return NextResponse.json({ orders: data ?? [] });
    }

    const select = slim ? 'id, total, created_at' : ORDER_LIST_SELECT;
    const orders = await paginateOrders(admin, select, false);
    return NextResponse.json({ orders });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to load orders';
    console.error('[api/admin/orders]', e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
