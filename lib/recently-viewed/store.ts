'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type RecentlyViewedItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  priceMin: number;
  priceMax: number;
  purity: number;
  spec: string;
  viewedAt: number;
};

const MAX_ITEMS = 12;

type RecentlyViewedState = {
  items: RecentlyViewedItem[];
  track: (item: Omit<RecentlyViewedItem, 'viewedAt'>) => void;
  clear: () => void;
};

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      track: (item) => {
        set((state) => {
          const next = [
            { ...item, viewedAt: Date.now() },
            ...state.items.filter((i) => i.productId !== item.productId),
          ].slice(0, MAX_ITEMS);
          return { items: next };
        });
      },
      clear: () => set({ items: [] }),
    }),
    { name: 'ppl-recently-viewed' },
  ),
);
