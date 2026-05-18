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

  const url = new URL(req.url);
  const limit = Math.min(500, Math.max(1, parseInt(url.searchParams.get('limit') || '400', 10) || 400));

  try {
    const { data, error } = await admin
      .from('audit_logs')
      .select('id,created_at,action,entity_type,entity_id,actor_id,actor_email,metadata')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return NextResponse.json({ logs: data ?? [] });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to load audit logs';
    console.error('[api/admin/audit-logs]', e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
