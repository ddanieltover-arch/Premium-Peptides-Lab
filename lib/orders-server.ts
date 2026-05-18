import { createClient } from '@/lib/supabase/server';
import type { CustomerOrderSummary } from '@/lib/orders';

/** Server-side order history for authenticated account (matches checkout email). */
export async function getCustomerOrdersForEmail(email: string): Promise<CustomerOrderSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_customer_orders', {
    p_email: email.trim(),
  });
  if (error) {
    console.error('[orders] get_customer_orders:', error.message);
    return [];
  }
  if (!data || !Array.isArray(data)) return [];
  return data as CustomerOrderSummary[];
}
