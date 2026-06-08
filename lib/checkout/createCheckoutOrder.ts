import type { SupabaseClient } from '@supabase/supabase-js';
import { computeCartTotals } from '@/lib/cart/totals';
import { validatePromoCode } from '@/lib/promo/codes';

const FREE_SHIPPING_THRESHOLD = 400;
const MAX_ITEMS = 40;
const MAX_QTY = 99;
const MAX_NOTE = 2000;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const PAYMENT_METHODS = new Set([
  'credit-card',
  'bitcoin',
  'apple-cash',
  'chime',
  'cashapp',
  'zelle',
  'bank-transfer',
]);

export class CheckoutError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string
  ) {
    super(message);
    this.name = 'CheckoutError';
  }
}

type LineIn = {
  productId: string;
  variantId: string | null;
  quantity: number;
  unitPrice?: number;
};

export type ShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type CheckoutRequestBody = {
  email: string;
  name: string;
  phone?: string;
  paymentMethod: string;
  shippingMethod: 'standard' | 'express';
  shippingAddress: ShippingAddress;
  items: LineIn[];
  notes?: string;
  promoCode?: string;
};

type ProductRow = {
  id: string;
  name: string;
  base_price: number | string;
  stock: number;
  is_active: boolean;
  variants: Array<{
    id: string;
    price_modifier: number | string;
    stock: number;
  }> | null;
};

type ResolvedLine = {
  product_id: string;
  variant_id: string | null;
  name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

function trimStr(v: unknown, max: number): string {
  const s = typeof v === 'string' ? v.trim() : '';
  if (s.length > max) return s.slice(0, max);
  return s;
}

function assert(cond: unknown, msg: string, code: string): asserts cond {
  if (!cond) throw new CheckoutError(msg, 400, code);
}

function isUuid(s: string): boolean {
  return UUID_RE.test(s);
}

function num(v: number | string): number {
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
}

export function parseCheckoutBody(
  raw: unknown,
  enabledPaymentMethods: Set<string> = PAYMENT_METHODS,
): CheckoutRequestBody {
  assert(raw && typeof raw === 'object', 'Invalid request body.', 'bad_json');
  const b = raw as Record<string, unknown>;

  const email = trimStr(b.email, 254).toLowerCase();
  assert(
    email.length > 3 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    'Enter a valid email address.',
    'bad_email'
  );

  const name = trimStr(b.name, 200);
  assert(name.length >= 2, 'Enter your full name (at least 2 characters).', 'bad_name');

  const phoneRaw = trimStr(b.phone ?? '', 40);
  const phone = phoneRaw.length > 0 ? phoneRaw : undefined;

  const paymentMethod = trimStr(b.paymentMethod, 40) || 'credit-card';
  assert(enabledPaymentMethods.has(paymentMethod), 'Invalid payment method.', 'bad_payment');

  const sm = trimStr(b.shippingMethod, 20).toLowerCase();
  assert(sm === 'standard' || sm === 'express', 'Invalid shipping method.', 'bad_shipping');

  const addr = b.shippingAddress;
  assert(addr && typeof addr === 'object', 'Shipping address is required.', 'bad_address');
  const a = addr as Record<string, unknown>;
  const fullName = trimStr(a.fullName, 200);
  const address = trimStr(a.address, 300);
  const city = trimStr(a.city, 120);
  const state = trimStr(a.state, 120);
  const zip = trimStr(a.zip, 32);
  const country = trimStr(a.country, 80) || 'US';
  assert(fullName.length >= 2, 'Shipping full name is required.', 'bad_address');
  assert(address.length >= 4, 'Street address is required.', 'bad_address');
  assert(city.length >= 2, 'City is required.', 'bad_address');
  assert(state.length >= 1, 'State / province is required.', 'bad_address');
  assert(zip.length >= 2, 'ZIP / postal code is required.', 'bad_address');

  const itemsRaw = b.items;
  assert(Array.isArray(itemsRaw) && itemsRaw.length > 0, 'Your cart is empty.', 'empty_cart');
  assert(itemsRaw.length <= MAX_ITEMS, 'Too many line items.', 'too_many_items');

  const notes = b.notes != null ? trimStr(b.notes, MAX_NOTE) : '';
  const promoCodeRaw = trimStr(b.promoCode ?? '', 40);
  const promoCode = promoCodeRaw.length > 0 ? promoCodeRaw.toUpperCase() : undefined;

  const items: LineIn[] = [];
  for (const row of itemsRaw) {
    assert(row && typeof row === 'object', 'Invalid cart line.', 'bad_line');
    const r = row as Record<string, unknown>;
    const productId = trimStr(r.productId, 80);
    assert(isUuid(productId), 'Invalid product.', 'bad_line');
    const variantIdRaw = r.variantId;
    const variantId =
      variantIdRaw == null || variantIdRaw === ''
        ? null
        : trimStr(String(variantIdRaw), 80);
    if (variantId) assert(isUuid(variantId), 'Invalid variant.', 'bad_line');
    const qty = Math.floor(Number(r.quantity));
    assert(Number.isFinite(qty) && qty >= 1 && qty <= MAX_QTY, 'Invalid quantity.', 'bad_qty');
    const up = r.unitPrice;
    const unitPrice =
      up === undefined || up === null ? undefined : Number(up);
    items.push({
      productId,
      variantId,
      quantity: qty,
      unitPrice: Number.isFinite(unitPrice) ? unitPrice : undefined,
    });
  }

  return {
    email,
    name,
    phone,
    paymentMethod,
    shippingMethod: sm as 'standard' | 'express',
    shippingAddress: {
      fullName,
      address,
      city,
      state,
      zip,
      country,
    },
    items,
    notes: notes || undefined,
    promoCode,
  };
}

function mergeLines(items: LineIn[]): Map<string, LineIn> {
  const map = new Map<string, LineIn>();
  for (const it of items) {
    const key = `${it.productId}:${it.variantId ?? ''}`;
    const prev = map.get(key);
    if (prev) {
      prev.quantity += it.quantity;
      if (prev.quantity > MAX_QTY) {
        throw new CheckoutError('Invalid quantity for a product.', 400, 'bad_qty');
      }
    } else {
      map.set(key, { ...it });
    }
  }
  return map;
}

async function resolveLines(
  admin: SupabaseClient,
  merged: Map<string, LineIn>
): Promise<{ lines: ResolvedLine[]; subtotal: number }> {
  const ids = Array.from(new Set(Array.from(merged.values()).map((l) => l.productId)));
  const { data: products, error } = await admin
    .from('products')
    .select('id, name, base_price, stock, is_active, variants(id, price_modifier, stock)')
    .in('id', ids)
    .eq('is_active', true);

  if (error) {
    throw new CheckoutError('Could not load products. Try again.', 503, 'db_products');
  }

  const byId = new Map<string, ProductRow>();
  for (const p of (products ?? []) as ProductRow[]) {
    byId.set(p.id, p);
  }

  const lines: ResolvedLine[] = [];
  let subtotal = 0;

  for (const it of Array.from(merged.values())) {
    const p = byId.get(it.productId);
    assert(p, 'One or more products are no longer available.', 'missing_product');
    assert(p.is_active, 'One or more products are no longer for sale.', 'inactive');

    const variants = p.variants ?? [];
    const hasVariants = variants.length > 0;
    if (hasVariants) {
      assert(it.variantId, 'Please choose a variant for each product.', 'variant_required');
    } else {
      assert(!it.variantId, 'Invalid variant for this product.', 'bad_variant');
    }

    let unitPrice = num(p.base_price);

    if (it.variantId) {
      const v = variants.find((x) => x.id === it.variantId);
      assert(v, 'Invalid variant selection.', 'bad_variant');
      unitPrice += num(v.price_modifier);
    }

    if (it.unitPrice !== undefined && Number.isFinite(it.unitPrice)) {
      const drift = Math.abs(it.unitPrice - unitPrice);
      if (drift > 0.05) {
        throw new CheckoutError(
          'Prices changed. Please refresh the page and try again.',
          409,
          'price_changed'
        );
      }
    }

    unitPrice = Math.round(unitPrice * 100) / 100;
    const lineTotal = Math.round(unitPrice * it.quantity * 100) / 100;
    subtotal += lineTotal;
    lines.push({
      product_id: p.id,
      variant_id: it.variantId,
      name: p.name || 'Product',
      quantity: it.quantity,
      unit_price: unitPrice,
      line_total: lineTotal,
    });
  }

  subtotal = Math.round(subtotal * 100) / 100;
  return { lines, subtotal };
}

export type CheckoutOrderResult = {
  order: {
    id: string;
    orderNumber: string;
    subtotal: number;
    shippingCost: number;
    total: number;
    email: string;
    name: string;
    phone: string | null;
    paymentMethod: string;
    shippingMethod: string;
    shippingAddress: ShippingAddress;
    notes: string | null;
    items: Array<{
      name: string;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
    }>;
  };
};

export async function createCheckoutOrder(
  admin: SupabaseClient,
  raw: unknown,
  enabledPaymentMethods?: Set<string>,
): Promise<CheckoutOrderResult> {
  const body = parseCheckoutBody(raw, enabledPaymentMethods);
  const merged = mergeLines(body.items);
  const { lines, subtotal } = await resolveLines(admin, merged);

  let promo = null;
  if (body.promoCode) {
    const promoResult = validatePromoCode(body.promoCode, subtotal);
    if (!promoResult.ok) {
      throw new CheckoutError(promoResult.message, 400, 'bad_promo');
    }
    promo = promoResult.promo;
  }

  const shipMode = body.shippingMethod;
  const totals = computeCartTotals({ subtotal, shippingMethod: shipMode, promo });
  const shippingCost = totals.shippingCost;
  const total = totals.total;
  const discount = totals.discount;

  const promoNote =
    promo && (discount > 0 || promo.freeShipping)
      ? `Promo ${promo.code}: ${promo.label}${discount > 0 ? ` (−$${discount.toFixed(2)})` : ''}`
      : '';
  const combinedNotes = [body.notes, promoNote].filter(Boolean).join('\n') || null;

  const orderNumber = `PPL-${Date.now().toString(36).toUpperCase()}`;

  const shippingAddressJson = {
    fullName: body.shippingAddress.fullName,
    address: body.shippingAddress.address,
    city: body.shippingAddress.city,
    state: body.shippingAddress.state,
    zip: body.shippingAddress.zip,
    country: body.shippingAddress.country,
  };

  const { data: orderRow, error: orderErr } = await admin
    .from('orders')
    .insert({
      order_number: orderNumber,
      contact_email: body.email,
      contact_phone: body.phone ?? null,
      payment_method: body.paymentMethod,
      shipping_method: shipMode,
      shipping_address_json: shippingAddressJson,
      subtotal,
      shipping_cost: shippingCost,
      total,
      notes: combinedNotes,
    })
    .select('id, order_number, subtotal, shipping_cost, total')
    .single();

  if (orderErr || !orderRow) {
    throw new CheckoutError(
      orderErr?.message?.includes('row-level security')
        ? 'Checkout is temporarily unavailable. Please contact support.'
        : 'Could not create your order. Try again in a moment.',
      503,
      'order_insert'
    );
  }

  const orderId = orderRow.id as string;

  const itemRows = lines.map((l) => ({
    order_id: orderId,
    product_id: l.product_id,
    variant_id: l.variant_id,
    quantity: l.quantity,
    unit_price: l.unit_price,
  }));

  const { error: itemsErr } = await admin.from('order_items').insert(itemRows);

  if (itemsErr) {
    await admin.from('orders').delete().eq('id', orderId);
    throw new CheckoutError(
      'Could not save order lines. Please try again.',
      503,
      'items_insert'
    );
  }

  return {
    order: {
      id: orderId,
      orderNumber: orderRow.order_number as string,
      subtotal: Number(orderRow.subtotal),
      shippingCost: Number(orderRow.shipping_cost),
      total: Number(orderRow.total),
      email: body.email,
      name: body.name,
      phone: body.phone ?? null,
      paymentMethod: body.paymentMethod,
      shippingMethod: shipMode,
      shippingAddress: body.shippingAddress,
      notes: body.notes ?? null,
      items: lines.map((l) => ({
        name: l.name,
        quantity: l.quantity,
        unitPrice: l.unit_price,
        lineTotal: l.line_total,
      })),
    },
  };
}
