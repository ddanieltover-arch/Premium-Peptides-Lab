'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { buttonVariants } from '@/components/ui/button';
import { StockBadge } from '@/components/catalog/StockBadge';
import { PurityBadge, SaleBadge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { resolveProductStock } from '@/lib/catalog/stock';
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
import { featuredToWishlistItem } from '@/lib/wishlist/helpers';
import { WishlistButton } from '@/components/wishlist/WishlistButton';

type ProductCardProps = {
  product: FeaturedProduct;
  index: number;
  added: boolean;
  onAddToCart: (id: string) => void;
};

export function ProductCard({ product, index, added, onAddToCart }: ProductCardProps) {
  const { reduce, tap } = useMotionConfig();
  const stock = resolveProductStock(product.stock, null);
  const onSale = product.compareAt != null && product.compareAt > product.priceMin;

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
          className="product-card-image relative aspect-square overflow-hidden bg-white"
          whileHover={reduce ? undefined : { scale: 1.01 }}
          transition={{ duration: 0.35 }}
        >
          <motion.div
            className="flex h-full w-full items-center justify-center p-3 sm:p-5"
            whileHover={reduce ? undefined : imageZoomHover}
            transition={imageZoomTransition}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
              loading="lazy"
              onError={(e) => {
                const el = e.currentTarget;
                if (el.src.includes('/brand-logo.png')) return;
                const frame = el.closest('.product-card-image');
                frame?.classList.remove('bg-white');
                frame?.classList.add('bg-lab-elevated/60');
                el.src = '/brand-logo.png';
              }}
            />
          </motion.div>
          <div className="absolute left-2 top-2 flex flex-col gap-1.5 sm:left-3 sm:top-3">
            <motion.div
              initial={{ opacity: reduce ? 1 : 0, x: reduce ? 0 : -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: transitionDelay(reduce, index, 0.05) + 0.15 }}
            >
              <PurityBadge value={product.purity} animated={!reduce} size="sm" />
            </motion.div>
            {onSale ? <SaleBadge /> : null}
            {stock.label ? (
              <StockBadge
                label={stock.label}
                lowStock={stock.lowStock}
                outOfStock={!stock.inStock}
              />
            ) : null}
          </div>
          <div className="pointer-events-auto absolute right-2 top-2 z-10 sm:right-3 sm:top-3">
            <WishlistButton item={featuredToWishlistItem(product)} size="sm" />
          </div>
        </motion.div>
      </Link>
      <motion.div
        className="space-y-2 p-3 sm:space-y-3 sm:p-5"
        initial={{ opacity: reduce ? 1 : 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: transitionDelay(reduce, index, 0.05) + 0.1 }}
      >
        <Link href={catalogHref(`/products/${product.slug}`)} className="block hover:text-lab-primary">
          <h3 className="font-display text-sm leading-snug text-white transition group-hover:text-lab-primary sm:text-lg">
            {product.name}
          </h3>
        </Link>
        <p className="font-mono text-[10px] text-slate-500 line-clamp-2 sm:text-xs">{product.spec}</p>
        {product.ratingCount > 0 ? (
          <StarRating rating={product.ratingAverage} count={product.ratingCount} />
        ) : null}
        <motion.div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
          <span className="font-display text-lg text-white tabular-nums sm:text-2xl">
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
          disabled={!stock.inStock}
          onClick={(e) => {
            e.preventDefault();
            if (!stock.inStock) return;
            onAddToCart(product.id);
          }}
          whileTap={stock.inStock ? tap() : undefined}
          className={cn(
            buttonVariants({ variant: 'secondary', fullWidth: true, glow: false, size: 'sm' }),
            'sm:!px-6 sm:!py-3 sm:text-sm',
            !stock.inStock && 'cursor-not-allowed opacity-50',
          )}
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
                {!stock.inStock ? (
                  'Out of stock'
                ) : (
                  <>
                    <span className="sm:hidden">Add</span>
                    <span className="hidden sm:inline">Add to cart</span>
                  </>
                )}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </motion.article>
  );
}
