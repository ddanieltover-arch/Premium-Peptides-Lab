import type { SupabaseClient } from '@supabase/supabase-js';
import { sendAdminNotification, sendTransactionalEmail, type SendResult } from '@/lib/email/send';
import { templateOrderStatusAdmin, templateOrderStatusCustomer } from '@/lib/email/templates';

export type OrderStatusEmailDispatch =
  | { ok: true; customer: SendResult; admin: SendResult }
  | { ok: false; status: number; error: string };

/**
 * Notify customer and admin when order status changes (admin dashboard / manual ops).
 */
export async function dispatchOrderStatusEmails(
  admin: SupabaseClient,
  orderId: string,
  newStatus: string,
  previousStatus: string,
  actorEmail?: string,
): Promise<OrderStatusEmailDispatch> {
  const { data: order, error } = await admin
    .from('orders')
    .select('id, order_number, contact_email, shipping_address_json')
    .eq('id', orderId)
    .maybeSingle();

  if (error) {
    return { ok: false, status: 500, error: error.message };
  }
  if (!order) {
    return { ok: false, status: 404, error: 'Order not found' };
  }

  const customerEmail = String(order.contact_email || '').trim().toLowerCase();
  if (!customerEmail) {
    return { ok: false, status: 400, error: 'Order has no contact email.' };
  }

  const addr = order.shipping_address_json as { fullName?: string } | null;
  const customerName = addr?.fullName?.trim() || customerEmail.split('@')[0] || 'there';

  const customerTpl = templateOrderStatusCustomer({
    customerName,
    orderNumber: order.order_number as string,
    orderId: order.id as string,
    status: newStatus,
    previousStatus,
  });

  const adminTpl = templateOrderStatusAdmin({
    orderNumber: order.order_number as string,
    orderId: order.id as string,
    customerEmail,
    previousStatus,
    newStatus,
    actorEmail,
  });

  try {
    const [customer, adminResult] = await Promise.all([
      sendTransactionalEmail({
        to: customerEmail,
        subject: customerTpl.subject,
        html: customerTpl.html,
      }),
      sendAdminNotification({
        subject: adminTpl.subject,
        html: adminTpl.html,
        replyTo: customerEmail,
      }),
    ]);
    return { ok: true, customer, admin: adminResult };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Email failed';
    return { ok: false, status: 500, error: msg };
  }
}
