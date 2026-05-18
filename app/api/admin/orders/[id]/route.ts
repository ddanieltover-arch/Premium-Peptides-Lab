import { NextResponse } from 'next/server';
import { getUserFromAdminBearer, unauthorizedResponse } from '@/lib/admin/auth';
import { buildOrderUpdate } from '@/lib/admin/order-patch';
import { createServiceRoleClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

type Ctx = { params: { id: string } };

const ORDER_DETAIL_SELECT = `
  *,
  items:order_items(
    id,
    quantity,
    unit_price,
    product_id,
    variant_id,
    product:products(name, thumbnail_url)
  )
`;

export async function GET(req: Request, { params }: Ctx) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? null;
  const user = await getUserFromAdminBearer(token);
  if (!user) return unauthorizedResponse();

  const { id } = params;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  let admin;
  try {
    admin = createServiceRoleClient();
  } catch {
    return NextResponse.json({ error: 'Server missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 503 });
  }

  const { data, error } = await admin.from('orders').select(ORDER_DETAIL_SELECT).eq('id', id).maybeSingle();
  if (error) {
    console.error('[api/admin/orders/[id] GET]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ order: data });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? null;
  const user = await getUserFromAdminBearer(token);
  if (!user) return unauthorizedResponse();

  const { id } = params;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const built = buildOrderUpdate(body);
  if ('error' in built) {
    return NextResponse.json({ error: built.error }, { status: 400 });
  }

  let admin;
  try {
    admin = createServiceRoleClient();
  } catch {
    return NextResponse.json({ error: 'Server missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 503 });
  }

  const { data, error } = await admin
    .from('orders')
    .update(built.update)
    .eq('id', id)
    .select(ORDER_DETAIL_SELECT)
    .maybeSingle();

  if (error) {
    console.error('[api/admin/orders/[id] PATCH]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ order: data });
}
