import type { SupabaseClient } from '@supabase/supabase-js';
import type { CheckoutOrderResult } from '@/lib/checkout/createCheckoutOrder';
import { paymentMethodLabel, shippingMethodLabel } from '@/lib/checkout/paymentMethods';
import { sendAdminNotification, sendTransactionalEmail, type SendResult } from '@/lib/email/send';
import {
  templateOrderConfirmationAdmin,
  templateOrderConfirmationCustomer,
} from '@/lib/email/templates';
import type { OrderLineEmail } from '@/lib/email/components';

export type OrderEmailDispatch =
  | { ok: true; customer: SendResult; admin: SendResult }
  | { ok: false; status: number; error: string; skipped?: boolean };

function normEmail(s: string): string {
  return s.trim().toLowerCase();
}

function mapLines(
  items: Array<{ name: string; quantity: number; unitPrice: number }>,
): OrderLineEmail[] {
  return items.map((l) => ({
    name: l.name,
    quantity: l.quantity,
    unitPrice: l.unitPrice,
  }));
}

async function sendPair(opts: {
  customerEmail: string;
  customerTpl: { subject: string; html: string };
  adminTpl: { subject: string; html: string };
}): Promise<{ customer: SendResult; admin: SendResult }> {
  const [customer, admin] = await Promise.all([
    sendTransactionalEmail({
      to: opts.customerEmail,
      subject: opts.customerTpl.subject,
      html: opts.customerTpl.html,
    }),
    sendAdminNotification({
      subject: opts.adminTpl.subject,
      html: opts.adminTpl.html,
      replyTo: opts.customerEmail,
    }),
  ]);
  return { customer, admin };
}

/** Send immediately after checkout using the API response payload (no extra DB read). */
export async function dispatchOrderConfirmationFromCheckout(
  order: CheckoutOrderResult['order'],
): Promise<OrderEmailDispatch> {
  const customerEmail = normEmail(order.email);
  if (!customerEmail) {
    return { ok: false, status: 400, error: 'Customer email is required.' };
  }

  const pm = paymentMethodLabel(order.paymentMethod);
  const ship = shippingMethodLabel(order.shippingMethod);
  const lines = mapLines(order.items);
  const customerName = order.shippingAddress.fullName?.trim() || order.name?.trim() || 'there';

  const customerTpl = templateOrderConfirmationCustomer({
    customerName,
    orderNumber: order.orderNumber,
    orderId: order.id,
    subtotal: order.subtotal,
    shippingCost: order.shippingCost,
    total: order.total,
    paymentMethodLabel: pm,
    shippingSummary: ship,
    shippingAddress: order.shippingAddress,
    lines,
    notes: order.notes,
  });

  const adminTpl = templateOrderConfirmationAdmin({
    orderNumber: order.orderNumber,
    orderId: order.id,
    customerName,
    customerEmail,
    customerPhone: order.phone,
    subtotal: order.subtotal,
    shippingCost: order.shippingCost,
    total: order.total,
    paymentMethodLabel: pm,
    shippingSummary: ship,
    shippingAddress: order.shippingAddress,
    lines,
    notes: order.notes,
  });

  try {
    const { customer, admin } = await sendPair({
      customerEmail,
      customerTpl,
      adminTpl,
    });

    if (
      (!customer.ok && 'skipped' in customer && customer.skipped) ||
      (!admin.ok && 'skipped' in admin && admin.skipped)
    ) {
      return {
        ok: false,
        status: 503,
        error: 'Email delivery is not configured (RESEND_API_KEY).',
        skipped: true,
      };
    }

    return { ok: true, customer, admin };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Email failed';
    console.error('[order-confirmation] send failed', e);
    return { ok: false, status: 500, error: msg };
  }
}

/** Reload order from DB and verify email (for resend / success-page retry). */
export async function dispatchOrderConfirmationEmails(
  admin: SupabaseClient,
  orderId: string,
  customerEmailRaw: string,
): Promise<OrderEmailDispatch> {
  const customerEmail = normEmail(customerEmailRaw);
  if (!orderId || !customerEmail) {
    return { ok: false, status: 400, error: 'orderId and customerEmail are required' };
  }

  const { data: order, error } = await admin
    .from('orders')
    .select(
      `
        id,
        order_number,
        subtotal,
        shipping_cost,
        total,
        contact_email,
        contact_phone,
        payment_method,
        shipping_method,
        shipping_address_json,
        notes,
        items:order_items(quantity, unit_price, product:products(name))
      `,
    )
    .eq('id', orderId)
    .maybeSingle();

  if (error) {
    console.error('[order-confirmation]', error);
    return { ok: false, status: 500, error: error.message };
  }
  if (!order) {
    return { ok: false, status: 404, error: 'Order not found' };
  }

  const dbEmail = normEmail(String(order.contact_email || ''));
  if (!dbEmail || dbEmail !== customerEmail) {
    return {
      ok: false,
      status: 403,
      error: 'Email does not match this order (use the address from checkout).',
    };
  }

  type ItemRow = {
    quantity: unknown;
    unit_price: unknown;
    product: { name?: string } | { name?: string }[] | null;
  };

  const rawItems = (order as { items?: ItemRow[] }).items ?? [];
  const lines: OrderLineEmail[] = rawItems.map((row) => {
    const p = row.product;
    const name =
      p && !Array.isArray(p) ? p.name : Array.isArray(p) && p[0] ? p[0].name : undefined;
    return {
      name: name || 'Product',
      quantity: Number(row.quantity ?? 0),
      unitPrice: Number(row.unit_price ?? 0),
    };
  });

  const addr = order.shipping_address_json as CheckoutOrderResult['order']['shippingAddress'];
  const customerName = addr?.fullName?.trim() || customerEmail.split('@')[0] || 'there';
  const pm = paymentMethodLabel(order.payment_method as string);
  const ship = shippingMethodLabel(order.shipping_method as string);

  const customerTpl = templateOrderConfirmationCustomer({
    customerName,
    orderNumber: order.order_number as string,
    orderId: order.id as string,
    subtotal: Number(order.subtotal ?? 0),
    shippingCost: Number(order.shipping_cost ?? 0),
    total: Number(order.total ?? 0),
    paymentMethodLabel: pm,
    shippingSummary: ship,
    shippingAddress: addr,
    lines,
    notes: (order.notes as string | null) ?? null,
  });

  const adminTpl = templateOrderConfirmationAdmin({
    orderNumber: order.order_number as string,
    orderId: order.id as string,
    customerName,
    customerEmail,
    customerPhone: String(order.contact_phone || ''),
    subtotal: Number(order.subtotal ?? 0),
    shippingCost: Number(order.shipping_cost ?? 0),
    total: Number(order.total ?? 0),
    paymentMethodLabel: pm,
    shippingSummary: ship,
    shippingAddress: addr,
    lines,
    notes: (order.notes as string | null) ?? null,
  });

  try {
    const { customer, admin } = await sendPair({ customerEmail, customerTpl, adminTpl });
    if (
      (!customer.ok && 'skipped' in customer && customer.skipped) ||
      (!admin.ok && 'skipped' in admin && admin.skipped)
    ) {
      return {
        ok: false,
        status: 503,
        error: 'Email delivery is not configured (RESEND_API_KEY).',
        skipped: true,
      };
    }
    return { ok: true, customer, admin };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Email failed';
    console.error('[order-confirmation] send failed', e);
    return { ok: false, status: 500, error: msg };
  }
}
