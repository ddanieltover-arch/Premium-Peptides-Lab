import { PAYMENT_METHOD_IDS } from '@/lib/checkout/payment-methods';

const ORDER_STATUSES = new Set([
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
  'SUPPORT',
]);
const PAYMENT_STATUSES = new Set(['UNPAID', 'PAID', 'REFUNDED', 'PARTIAL']);
const SHIPPING_METHODS = new Set(['standard', 'express']);

export type OrderAdminPatch = {
  status?: string;
  payment_status?: string;
  payment_method?: string | null;
  shipping_method?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  notes?: string | null;
  shipping_address_json?: Record<string, unknown> | null;
  subtotal?: number;
  shipping_cost?: number;
  total?: number;
};

const ALLOWED_KEYS = new Set([
  'status',
  'payment_status',
  'payment_method',
  'shipping_method',
  'contact_email',
  'contact_phone',
  'notes',
  'shipping_address_json',
  'subtotal',
  'shipping_cost',
  'total',
]);

export function buildOrderUpdate(body: Record<string, unknown>): { update: Record<string, unknown> } | { error: string } {
  const update: Record<string, unknown> = {};

  for (const key of Object.keys(body)) {
    if (!ALLOWED_KEYS.has(key)) continue;
    const v = body[key];

    switch (key) {
      case 'status': {
        const s = typeof v === 'string' ? v.trim().toUpperCase() : '';
        if (!ORDER_STATUSES.has(s)) return { error: 'Invalid status' };
        update.status = s;
        break;
      }
      case 'payment_status': {
        const s = typeof v === 'string' ? v.trim().toUpperCase() : '';
        if (!PAYMENT_STATUSES.has(s)) return { error: 'Invalid payment_status' };
        update.payment_status = s;
        break;
      }
      case 'payment_method': {
        if (v === null || v === '') {
          update.payment_method = null;
          break;
        }
        if (typeof v !== 'string' || !PAYMENT_METHOD_IDS.includes(v)) {
          return { error: 'Invalid payment_method' };
        }
        update.payment_method = v;
        break;
      }
      case 'shipping_method': {
        if (v === null || v === '') {
          update.shipping_method = null;
          break;
        }
        if (typeof v !== 'string' || !SHIPPING_METHODS.has(v)) {
          return { error: 'Invalid shipping_method' };
        }
        update.shipping_method = v;
        break;
      }
      case 'contact_email': {
        update.contact_email =
          v === null || v === '' ? null : typeof v === 'string' ? v.trim().slice(0, 320) : null;
        break;
      }
      case 'contact_phone': {
        update.contact_phone =
          v === null || v === '' ? null : typeof v === 'string' ? v.trim().slice(0, 64) : null;
        break;
      }
      case 'notes': {
        update.notes = v === null || v === '' ? null : typeof v === 'string' ? v.trim().slice(0, 4000) : null;
        break;
      }
      case 'shipping_address_json': {
        if (v === null) {
          update.shipping_address_json = null;
          break;
        }
        if (!v || typeof v !== 'object' || Array.isArray(v)) {
          return { error: 'Invalid shipping_address_json' };
        }
        const addr = v as Record<string, unknown>;
        update.shipping_address_json = {
          fullName: String(addr.fullName ?? '').slice(0, 200),
          address: String(addr.address ?? '').slice(0, 500),
          city: String(addr.city ?? '').slice(0, 120),
          state: String(addr.state ?? '').slice(0, 120),
          zip: String(addr.zip ?? '').slice(0, 32),
          country: String(addr.country ?? '').slice(0, 120),
        };
        break;
      }
      case 'subtotal':
      case 'shipping_cost':
      case 'total': {
        const n = typeof v === 'number' ? v : Number(v);
        if (!Number.isFinite(n) || n < 0) return { error: `Invalid ${key}` };
        update[key] = Math.round(n * 100) / 100;
        break;
      }
    }
  }

  if (Object.keys(update).length === 0) {
    return { error: 'No valid fields to update' };
  }

  update.updated_at = new Date().toISOString();
  return { update };
}
