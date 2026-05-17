import { NextResponse } from 'next/server';
import { dispatchOrderConfirmationEmails } from '@/lib/email/orderConfirmation';
import { createServiceRoleClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

/** Resend order confirmation (e.g. if checkout email failed). Requires matching customer email. */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const orderId = typeof body.orderId === 'string' ? body.orderId.trim() : '';
    const customerEmail =
      typeof body.customerEmail === 'string' ? body.customerEmail.trim() : '';

    let admin;
    try {
      admin = createServiceRoleClient();
    } catch {
      return NextResponse.json(
        { ok: false, skipped: true, reason: 'missing_service_role_key' },
        { status: 503 },
      );
    }

    const result = await dispatchOrderConfirmationEmails(admin, orderId, customerEmail);
    if (!result.ok) {
      return NextResponse.json({ error: result.error, skipped: result.skipped }, { status: result.status });
    }
    return NextResponse.json({
      ok: true,
      customer: result.customer,
      admin: result.admin,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Server error';
    console.error('[order-confirmation]', e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
