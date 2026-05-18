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
    .from('categories')
    .select('id,name,slug,description,sort_order,created_at,updated_at')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[api/admin/categories GET]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const categories = data ?? [];
  const withCounts = await Promise.all(
    categories.map(async (cat) => {
      const { count } = await admin
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', cat.id);
      return { ...cat, product_count: count ?? 0 };
    }),
  );

  return NextResponse.json({ categories: withCounts });
}

export async function POST(req: Request) {
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

  const { data, error } = await admin.from('categories').insert([body]).select('id').single();
  if (error) {
    console.error('[api/admin/categories POST]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ category: data }, { status: 201 });
}
