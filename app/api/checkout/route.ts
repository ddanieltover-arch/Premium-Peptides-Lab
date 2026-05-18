import { NextResponse } from 'next/server';
import { CheckoutError, createCheckoutOrder } from '@/lib/checkout/createCheckoutOrder';
import { getStoreSettings } from '@/lib/data/store-settings';
import { dispatchOrderConfirmationFromCheckout } from '@/lib/email/orderConfirmation';
import { createServiceRoleClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.', code: 'bad_json' }, { status: 400 });
  }

  let admin;
  try {
    admin = createServiceRoleClient();
  } catch {
    return NextResponse.json(
      {
        error: 'Checkout is not configured (missing Supabase service role). Contact support.',
        code: 'missing_service_role',
      },
      { status: 503 },
    );
  }

  try {
    const storeSettings = await getStoreSettings();
    const enabledPayments = new Set(storeSettings.payments.enabledMethods);
    const result = await createCheckoutOrder(admin, body, enabledPayments);

    let confirmationEmail: Awaited<ReturnType<typeof dispatchOrderConfirmationFromCheckout>> | null =
      null;
    try {
      if (storeSettings.notifications.orderConfirmationEmail) {
        confirmationEmail = await dispatchOrderConfirmationFromCheckout(result.order);
      }
      if (confirmationEmail && !confirmationEmail.ok) {
        console.error('[checkout] order confirmation email not sent:', confirmationEmail);
      }
    } catch (mailErr) {
      console.error('[checkout] order confirmation email failed', mailErr);
      confirmationEmail = {
        ok: false,
        status: 500,
        error: mailErr instanceof Error ? mailErr.message : 'Email failed',
      };
    }

    return NextResponse.json({ ...result, confirmationEmail });
  } catch (e) {
    if (e instanceof CheckoutError) {
      return NextResponse.json({ error: e.message, code: e.code }, { status: e.status });
    }
    console.error('[checkout]', e);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.', code: 'internal' },
      { status: 500 },
    );
  }
}
