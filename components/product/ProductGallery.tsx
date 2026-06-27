'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ProductImage } from '@/lib/types/catalog';

type Props = {
  name: string;
  images: ProductImage[];
  inStock: boolean;
};

export function ProductGallery({ name, images, inStock }: Props) {
  const reduce = useReducedMotion();
  const current = images[0];

  return (
    <div className="space-y-4">
      <motion.div
        className="group relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-lab-elevated/50 shadow-card sm:max-w-[320px]"
        whileHover={reduce ? undefined : { scale: 1.005 }}
        transition={{ duration: 0.35 }}
      >
        <motion.div
          className="flex h-full w-full items-center justify-center p-6"
          whileHover={reduce ? undefined : { scale: 1.04 }}
          transition={{ duration: 0.5 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={current?.url}
            src={current?.url}
            alt={current?.altText ?? name}
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              const el = e.currentTarget;
              if (el.src.includes('/brand-logo.png')) return;
              el.src = '/brand-logo.png';
            }}
          />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-lab-base/60 via-transparent to-transparent" />
        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide ${
            inStock ? 'border border-lab-mint/40 bg-lab-mint/15 text-lab-mint' : 'border border-lab-rose/40 bg-lab-rose/15 text-lab-rose'
          }`}
        >
          {inStock ? 'In stock' : 'Out of stock'}
        </span>
      </motion.div>
    </div>
  );
}
