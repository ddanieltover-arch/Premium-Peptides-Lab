'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  compareAt?: number | null;
  quantity: number;
  thumbnailUrl?: string;
  variantId?: string;
  variantLabel?: string;
};

export type ShippingMethod = 'standard' | 'express';

type CartState = {
  items: CartItem[];
  shippingMethod: ShippingMethod;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  setShippingMethod: (method: ShippingMethod) => void;
  clearCart: () => void;
  total: () => number;
  count: () => number;
};

function lineKey(productId: string, variantId?: string) {
  return `${productId}-${variantId ?? 'default'}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      shippingMethod: 'standard',

      addItem: (item, quantity = 1) => {
        set((state) => {
          const key = lineKey(item.productId, item.variantId);
          const existing = state.items.find((i) => lineKey(i.productId, i.variantId) === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                lineKey(i.productId, i.variantId) === key
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter((i) => lineKey(i.productId, i.variantId) !== lineKey(productId, variantId)),
        }));
      },

      updateQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            lineKey(i.productId, i.variantId) === lineKey(productId, variantId) ? { ...i, quantity } : i,
          ),
        }));
      },

      setShippingMethod: (method) => set({ shippingMethod: method }),

      clearCart: () => set({ items: [] }),

      total: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      count: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: 'ppl-cart' },
  ),
);
