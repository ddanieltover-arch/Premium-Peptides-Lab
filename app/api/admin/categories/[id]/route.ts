import { NextResponse } from 'next/server';
import { getUserFromAdminBearer, unauthorizedResponse } from '@/lib/admin/auth';
import { createServiceRoleClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

type Ctx = { params: { id: string } };

export async function PATCH(req: Request, { params }: Ctx) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? null;
  if (!(await getUserFromAdminBearer(token))) return unauthorizedResponse();

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  let admin;
  try {
    admin = createServiceRoleClient();
  } catch {
    return NextResponse.json({ error: 'Server missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 503 });
  }

  const { data, error } = await admin.from('categories').update(body).eq('id', params.id).select('id').maybeSingle();
  if (error) {
    console.error('[api/admin/categories/[id] PATCH]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ category: data });
}

export async function DELETE(req: Request, { params }: Ctx) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? null;
  if (!(await getUserFromAdminBearer(token))) return unauthorizedResponse();

  let admin;
  try {
    admin = createServiceRoleClient();
  } catch {
    return NextResponse.json({ error: 'Server missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 503 });
  }

  const { error } = await admin.from('categories').delete().eq('id', params.id);
  if (error) {
    console.error('[api/admin/categories/[id] DELETE]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
