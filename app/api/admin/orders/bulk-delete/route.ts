import { NextResponse } from 'next/server';
import { getUserFromAdminBearer, unauthorizedResponse } from '@/lib/admin/auth';
import { createServiceRoleClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? null;
  const user = await getUserFromAdminBearer(token);
  if (!user) return unauthorizedResponse();

  let body: { ids?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const ids = Array.isArray(body.ids)
    ? body.ids.filter((id): id is string => typeof id === 'string' && id.length > 0)
    : [];
  if (ids.length === 0) {
    return NextResponse.json({ error: 'ids array required' }, { status: 400 });
  }

  let admin;
  try {
    admin = createServiceRoleClient();
  } catch {
    return NextResponse.json({ error: 'Server missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 503 });
  }

  const { error } = await admin.from('orders').delete().in('id', ids);
  if (error) {
    console.error('[api/admin/orders/bulk-delete]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
