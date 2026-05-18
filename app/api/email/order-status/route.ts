import { NextResponse } from 'next/server';
import { getUserFromAdminBearer, unauthorizedResponse } from '@/lib/admin/auth';
import { getStoreSettings } from '@/lib/data/store-settings';
import { dispatchOrderStatusEmails } from '@/lib/email/orderStatus';
import { createServiceRoleClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

/**
 * Send order status update emails (customer + admin).
 * Requires Supabase admin session (Bearer JWT).
 */
export async function POST(request: Request) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? null;
  const user = await getUserFromAdminBearer(token);
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json().catch(() => ({}));
    const orderId = typeof body.orderId === 'string' ? body.orderId.trim() : '';
    const newStatus = typeof body.newStatus === 'string' ? body.newStatus.trim() : '';
    const previousStatus =
      typeof body.previousStatus === 'string' ? body.previousStatus.trim() : '';
    const actorEmail = user.email ?? undefined;

    if (!orderId || !newStatus) {
      return NextResponse.json(
        { error: 'orderId and newStatus are required.' },
        { status: 400 },
      );
    }

    const storeSettings = await getStoreSettings();
    if (!storeSettings.notifications.orderStatusEmail) {
      return NextResponse.json({ ok: true, skipped: true, reason: 'order_status_email_disabled' });
    }

    let admin;
    try {
      admin = createServiceRoleClient();
    } catch {
      return NextResponse.json({ error: 'Server not configured.' }, { status: 503 });
    }

    const result = await dispatchOrderStatusEmails(
      admin,
      orderId,
      newStatus,
      previousStatus || 'Pending',
      actorEmail,
    );

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ ok: true, customer: result.customer, admin: result.admin });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Server error';
    console.error('[order-status-email]', e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
