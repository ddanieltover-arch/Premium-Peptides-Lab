'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { buttonVariants } from '@/components/ui/button';
import { PurityBadge } from '@/components/ui/badge';
import { cardVariants } from '@/components/ui/card';
import { catalogHref } from '@/lib/data/navigation';
import { cn } from '@/lib/cn';
import {
  cardWhileHover,
  imageZoomHover,
  imageZoomTransition,
  transitionDelay,
  useMotionConfig,
  viewportSection,
} from '@/lib/motion';
import { formatPriceRange } from '@/lib/pricing';
import type { FeaturedProduct } from '@/lib/types/catalog';

type ProductCardProps = {
  product: FeaturedProduct;
  index: number;
  added: boolean;
  onAddToCart: (id: string) => void;
};

export function ProductCard({ product, index, added, onAddToCart }: ProductCardProps) {
  const { reduce, tap } = useMotionConfig();

  return (
    <motion.article
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportSection}
      transition={{ delay: transitionDelay(reduce, index), duration: reduce ? 0 : 0.45 }}
      whileHover={cardWhileHover(reduce)}
      className={cn('group relative', cardVariants({ variant: 'product' }))}
    >
      <Link href={catalogHref(`/products/${product.slug}`)} className="block">
        <motion.div
          className="relative aspect-[4/3] overflow-hidden"
          whileHover={reduce ? undefined : { scale: 1.02 }}
          transition={{ duration: 0.35 }}
        >
          <motion.div
            className="h-full w-full"
            whileHover={reduce ? undefined : imageZoomHover}
            transition={imageZoomTransition}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                const el = e.currentTarget;
                if (el.src.includes('/brand-logo.png')) return;
                el.src = '/brand-logo.png';
              }}
            />
          </motion.div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-lab-base via-transparent to-transparent opacity-80" />
          <motion.div
            className="absolute left-3 top-3"
            initial={{ opacity: reduce ? 1 : 0, x: reduce ? 0 : -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: transitionDelay(reduce, index, 0.05) + 0.15 }}
          >
            <PurityBadge value={product.purity} animated={!reduce} />
          </motion.div>
        </motion.div>
      </Link>
      <motion.div
        className="space-y-3 p-5"
        initial={{ opacity: reduce ? 1 : 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: transitionDelay(reduce, index, 0.05) + 0.1 }}
      >
        <Link href={catalogHref(`/products/${product.slug}`)} className="block hover:text-lab-primary">
          <h3 className="font-display text-lg text-white transition group-hover:text-lab-primary">{product.name}</h3>
        </Link>
        <p className="font-mono text-xs text-slate-500 line-clamp-2">{product.spec}</p>
        <motion.div className="flex items-baseline gap-2">
          <span className="font-display text-2xl text-white tabular-nums">
            {formatPriceRange(product.priceMin, product.priceMax, 0)}
          </span>
          {product.compareAt != null && product.compareAt > product.priceMin && (
            <span className="text-sm text-slate-500 line-through tabular-nums">
              ${product.compareAt.toFixed(0)}
            </span>
          )}
        </motion.div>
        <motion.button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onAddToCart(product.id);
          }}
          whileTap={tap()}
          className={buttonVariants({ variant: 'secondary', fullWidth: true, glow: false })}
        >
          <AnimatePresence mode="wait">
            {added ? (
              <motion.span
                key="ok"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-lab-mint"
              >
                Added to cart
              </motion.span>
            ) : (
              <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Add to cart
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </motion.article>
  );
}
