'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WishlistItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  priceMin: number;
  priceMax: number;
  purity: number;
  spec: string;
};

type WishlistState = {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
  count: () => number;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (item) => {
        set((state) => {
          const exists = state.items.some((i) => i.productId === item.productId);
          if (exists) {
            return { items: state.items.filter((i) => i.productId !== item.productId) };
          }
          return { items: [...state.items, item] };
        });
      },

      remove: (productId) => {
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }));
      },

      has: (productId) => get().items.some((i) => i.productId === productId),

      count: () => get().items.length,
    }),
    { name: 'ppl-wishlist' },
  ),
);
