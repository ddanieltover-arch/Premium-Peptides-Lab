import { NextResponse } from 'next/server';
import { getUserFromAdminBearer, unauthorizedResponse } from '@/lib/admin/auth';
import { createServiceRoleClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

async function paginate<T>(
  admin: ReturnType<typeof createServiceRoleClient>,
  table: string,
  select: string,
) {
  const pageSize = 1000;
  let from = 0;
  const rows: T[] = [];
  while (true) {
    const { data, error } = await admin
      .from(table)
      .select(select)
      .range(from, from + pageSize - 1);
    if (error) throw error;
    const chunk = (data as T[]) ?? [];
    rows.push(...chunk);
    if (chunk.length < pageSize) break;
    from += pageSize;
    if (from > 500_000) break;
  }
  return rows;
}

export async function GET(req: Request) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? null;
  if (!(await getUserFromAdminBearer(token))) return unauthorizedResponse();

  let admin;
  try {
    admin = createServiceRoleClient();
  } catch {
    return NextResponse.json({ error: 'Server missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 503 });
  }

  try {
    const [orders, customers, orderItems] = await Promise.all([
      paginate<{ id: string; total: unknown; created_at: string }>(
        admin,
        'orders',
        'id, total, created_at',
      ),
      paginate<{ created_at: string }>(admin, 'customers', 'created_at'),
      paginate<{
        product_id: string;
        quantity: unknown;
        unit_price: unknown;
        product: { name: string } | { name: string }[] | null;
      }>(admin, 'order_items', 'product_id, quantity, unit_price, product:products(name)'),
    ]);

    return NextResponse.json({ orders, customers, orderItems });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to load analytics';
    console.error('[api/admin/analytics]', e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
