'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { coaLibraryHref } from '@/lib/coa/href';
import type { ProductImage } from '@/lib/types/catalog';

type Props = {
  name: string;
  images: ProductImage[];
  inStock: boolean;
};

export function ProductGallery({ name, images, inStock }: Props) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

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
        <a
          href={coaLibraryHref()}
          className="absolute bottom-4 right-4 rounded-xl border border-white/15 bg-lab-base/80 px-4 py-2.5 font-display text-xs font-semibold text-lab-primary backdrop-blur-md transition hover:bg-lab-primary/20 hover:text-white"
        >
          View COA →
        </a>
      </motion.div>

      {images.length > 1 && (
        <motion.div
          className="flex gap-2 overflow-x-auto pb-1"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border transition ${
                i === active ? 'border-lab-primary ring-2 ring-lab-primary/30' : 'border-white/10 opacity-70 hover:opacity-100'
              }`}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
