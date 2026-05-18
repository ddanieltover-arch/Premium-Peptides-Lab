'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { WishlistItem } from '@/lib/wishlist/store';
import { useWishlistStore } from '@/lib/wishlist/store';
import { useToastStore } from '@/lib/toast/store';
import { cn } from '@/lib/cn';

type Props = {
  item: WishlistItem;
  className?: string;
  size?: 'sm' | 'md';
};

export function WishlistButton({ item, className, size = 'md' }: Props) {
  const reduce = useReducedMotion();
  const has = useWishlistStore((s) => s.has(item.productId));
  const toggle = useWishlistStore((s) => s.toggle);
  const pushToast = useToastStore((s) => s.push);

  const dim = size === 'sm' ? 'h-9 w-9' : 'h-10 w-10';

  return (
    <motion.button
      type="button"
      whileTap={reduce ? undefined : { scale: 0.92 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const next = !has;
        toggle(item);
        pushToast(
          next ? `${item.name} saved to wishlist` : `${item.name} removed from wishlist`,
          next ? 'success' : 'info',
        );
      }}
      className={cn(
        dim,
        'inline-flex items-center justify-center rounded-xl border transition',
        has
          ? 'border-lab-rose/50 bg-lab-rose/15 text-lab-rose'
          : 'border-white/10 bg-lab-base/80 text-slate-400 hover:border-white/20 hover:text-white',
        className,
      )}
      aria-label={has ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={has}
    >
      <span className="text-base leading-none" aria-hidden>
        {has ? '♥' : '♡'}
      </span>
    </motion.button>
  );
}
