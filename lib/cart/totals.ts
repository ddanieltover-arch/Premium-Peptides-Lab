import {
  EXPRESS_SHIPPING_COST,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST,
} from '@/lib/cart/constants';
import type { ShippingMethod } from '@/lib/cart/store';
import type { PromoApplication } from '@/lib/promo/codes';

export type CartTotalsInput = {
  subtotal: number;
  shippingMethod: ShippingMethod;
  promo: PromoApplication | null;
};

export type CartTotals = {
  subtotal: number;
  discount: number;
  discountedSubtotal: number;
  shippingCost: number;
  total: number;
  promo: PromoApplication | null;
};

export function computeCartTotals({ subtotal, shippingMethod, promo }: CartTotalsInput): CartTotals {
  const discount = promo?.discountAmount ?? 0;
  const discountedSubtotal = Math.max(0, Math.round((subtotal - discount) * 100) / 100);

  let shippingCost =
    shippingMethod === 'express'
      ? EXPRESS_SHIPPING_COST
      : discountedSubtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : STANDARD_SHIPPING_COST;

  if (promo?.freeShipping && shippingMethod === 'standard') {
    shippingCost = 0;
  }

  const total = Math.round((discountedSubtotal + shippingCost) * 100) / 100;

  return {
    subtotal,
    discount,
    discountedSubtotal,
    shippingCost,
    total,
    promo,
  };
}
