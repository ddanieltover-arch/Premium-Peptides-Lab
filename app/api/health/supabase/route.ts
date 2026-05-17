import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/** GET /api/health/supabase — row counts for smoke testing (dev) */
export async function GET() {
  try {
    const supabase = await createClient();

    const [products, categories, orders, customers] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('customers').select('*', { count: 'exact', head: true }),
    ]);

    const firstError =
      products.error ?? categories.error ?? orders.error ?? customers.error;
    if (firstError) {
      return NextResponse.json(
        { ok: false, error: firstError.message, hint: 'Check .env.local URL + anon key match the same Supabase project.' },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      project: process.env.NEXT_PUBLIC_SUPABASE_URL,
      counts: {
        products: products.count ?? 0,
        categories: categories.count ?? 0,
        orders: orders.count ?? 0,
        customers: customers.count ?? 0,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
