import { NextResponse } from 'next/server';
import { getUserFromAdminBearer, unauthorizedResponse } from '@/lib/admin/auth';
import { createServiceRoleClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? null;
  if (!(await getUserFromAdminBearer(token))) return unauthorizedResponse();

  let admin;
  try {
    admin = createServiceRoleClient();
  } catch {
    return NextResponse.json({ error: 'Server missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 503 });
  }

  const { data, error } = await admin
    .from('customers')
    .select('id,email,name,phone,order_count,total_spent,created_at,updated_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[api/admin/customers GET]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const customers = data ?? [];
  const enriched = await Promise.all(
    customers.map(async (c) => {
      const { count } = await admin
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('customer_id', c.id);
      return { ...c, orders: { count: count ?? c.order_count ?? 0 } };
    }),
  );

  return NextResponse.json({ customers: enriched });
}
