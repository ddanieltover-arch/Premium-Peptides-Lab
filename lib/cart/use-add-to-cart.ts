'use client';

import { useCallback } from 'react';
import type { CartItem } from '@/lib/cart/store';
import { useCartStore } from '@/lib/cart/store';
import { useCartUIStore } from '@/lib/cart/ui-store';
import { useToastStore } from '@/lib/toast/store';

type AddOptions = {
  quantity?: number;
  openDrawer?: boolean;
  toastMessage?: string;
};

export function useAddToCart() {
  const addItem = useCartStore((s) => s.addItem);
  const setCartDrawerOpen = useCartUIStore((s) => s.setCartDrawerOpen);
  const pushToast = useToastStore((s) => s.push);

  return useCallback(
    (item: Omit<CartItem, 'quantity'>, options?: AddOptions) => {
      const quantity = options?.quantity ?? 1;
      addItem(item, quantity);
      const label = options?.toastMessage ?? item.name;
      pushToast(`${label} added to cart`, 'success');
      if (options?.openDrawer !== false) setCartDrawerOpen(true);
    },
    [addItem, pushToast, setCartDrawerOpen],
  );
}
