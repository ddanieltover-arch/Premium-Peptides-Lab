import { createClient } from '@/lib/supabase/client';

export type CustomerOrderSummary = {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
};

export type PublicOrderPayload = {
  order: {
    id: string;
    order_number: string;
    status: string;
    payment_status: string;
    payment_method: string | null;
    shipping_method: string | null;
    subtotal: number;
    shipping_cost: number;
    total: number;
    shipping_address_json: Record<string, unknown> | null;
    contact_email: string | null;
    contact_phone: string | null;
    created_at: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    unit_price: number;
    product_id: string;
    variant_id: string | null;
    product: { name: string; thumbnail_url: string | null };
  }>;
};

function browserClient() {
  return createClient();
}

/** Order + line items; checkout email must match (RPC, legacy pattern). */
export async function getPublicOrder(orderId: string, email: string): Promise<PublicOrderPayload | null> {
  const supabase = browserClient();
  const { data, error } = await supabase.rpc('get_public_order', {
    p_order_id: orderId,
    p_email: email.trim(),
  });
  if (error) throw new Error(error.message);
  if (data == null) return null;
  return data as PublicOrderPayload;
}

/** Order history for account page (email must match checkout email). */
export async function getCustomerOrders(email: string): Promise<CustomerOrderSummary[]> {
  const supabase = browserClient();
  const { data, error } = await supabase.rpc('get_customer_orders', {
    p_email: email.trim(),
  });
  if (error) throw new Error(error.message);
  if (!data || !Array.isArray(data)) return [];
  return data as CustomerOrderSummary[];
}

export function orderEmailStorageKey(orderId: string): string {
  return `ppl_order_email:${orderId}`;
}
