import { NextResponse } from 'next/server';
import { getUserFromAdminBearer, unauthorizedResponse } from '@/lib/admin/auth';
import { createServiceRoleClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const PRODUCT_SELECT =
  'id,name,slug,description,short_desc,category_id,base_price,compare_price,stock,is_active,is_featured,thumbnail_url,molecular_formula,molecular_weight,cas_number,sequence,source_url,created_at,updated_at,category:categories(id,name,slug)';

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
  const id = url.searchParams.get('id');

  try {
    if (id) {
      const { data, error } = await admin.from('products').select(PRODUCT_SELECT).eq('id', id).maybeSingle();
      if (error) throw error;
      if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ product: data });
    }

    const { data, error } = await admin.from('products').select(PRODUCT_SELECT).order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ products: data ?? [] });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to load products';
    console.error('[api/admin/products GET]', e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
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

  const { data, error } = await admin.from('products').insert([body]).select('id').single();
  if (error) {
    console.error('[api/admin/products POST]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ product: data }, { status: 201 });
}
