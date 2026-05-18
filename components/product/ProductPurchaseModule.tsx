'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { WishlistButton } from '@/components/wishlist/WishlistButton';
import { buildCategoryHref, catalogHref } from '@/lib/data/navigation';
import type { ProductDetail, ProductVariant } from '@/lib/types/catalog';
import type { WishlistItem } from '@/lib/wishlist/store';

type Props = {
  product: ProductDetail;
  wishlistItem: WishlistItem;
  onAddToCart: (qty: number, variant: ProductVariant | null, unitPrice: number) => void;
};

const TRUST_ITEMS = ['Third-party tested', 'Ships in 24–48h', 'Discreet packaging'] as const;

export function ProductPurchaseModule({ product, wishlistItem, onAddToCart }: Props) {
  const reduce = useReducedMotion();
  const [variant, setVariant] = useState<ProductVariant | null>(product.variants[0] ?? null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const unitPrice = useMemo(() => {
    const mod = variant?.priceModifier ?? 0;
    return product.price + mod;
  }, [product.price, variant]);

  const inStock = product.stock > 0 || (variant?.stock ?? 0) > 0;
  const formula =
    product.molecularFormula ||
    (product.casNumber ? `CAS ${product.casNumber}` : null) ||
    product.spec;

  const handleAdd = () => {
    onAddToCart(qty, variant, unitPrice);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center gap-2">
        {product.category && (
          <Link
            href={buildCategoryHref(product.category.slug)}
            className="rounded-full border border-lab-primary/30 bg-lab-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-lab-primary"
          >
            {product.category.name}
          </Link>
        )}
        <span className="rounded-full border border-lab-mint/30 bg-lab-mint/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-lab-mint">
          ≥{product.purity}% · HPLC
        </span>
      </motion.div>

      <div className="flex items-start justify-between gap-3">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl"
        >
          {product.name}
        </motion.h1>
        <WishlistButton item={wishlistItem} />
      </div>

      {formula && (
        <p className="font-mono text-sm text-slate-500">{formula}</p>
      )}

      <div className="flex items-center gap-2 text-sm text-slate-400">
        <span className="text-lab-energy" aria-hidden>
          ★★★★★
        </span>
        <span>4.9</span>
        <span className="text-slate-600">·</span>
        <span className="font-mono text-xs">Institutional reviews</span>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="font-display text-4xl text-white">${unitPrice.toFixed(2)}</span>
        {product.compareAt != null && product.compareAt > unitPrice && (
          <span className="text-lg text-slate-500 line-through">${product.compareAt.toFixed(2)}</span>
        )}
      </div>

      {product.variants.length > 0 && (
        <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <label htmlFor="variant-select" className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
            Configuration
          </label>
          {product.variants.length <= 4 ? (
            <motion.div className="flex flex-wrap gap-2" role="group" aria-label="Select variant">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariant(v)}
                  className={`rounded-xl border px-4 py-2.5 text-sm transition ${
                    variant?.id === v.id
                      ? 'border-lab-primary bg-lab-primary/15 text-lab-primary'
                      : 'border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  {v.value}
                  {v.priceModifier > 0 ? ` (+$${v.priceModifier.toFixed(0)})` : ''}
                </button>
              ))}
            </motion.div>
          ) : (
            <select
              id="variant-select"
              value={variant?.id ?? ''}
              onChange={(e) => {
                const next = product.variants.find((v) => v.id === e.target.value);
                if (next) setVariant(next);
              }}
              className="w-full rounded-xl border border-white/10 bg-lab-elevated/80 px-4 py-3 font-mono text-sm text-white outline-none focus:border-lab-primary/50"
            >
              {product.variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}: {v.value}
                  {v.priceModifier > 0 ? ` (+$${v.priceModifier.toFixed(2)})` : ''}
                </option>
              ))}
            </select>
          )}
        </motion.div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-xl border border-white/10 bg-lab-elevated/50">
          <button
            type="button"
            className="px-4 py-3 text-lg text-slate-400 hover:text-white"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-[2.5rem] text-center font-mono text-lg text-white">{qty}</span>
          <button
            type="button"
            className="px-4 py-3 text-lg text-slate-400 hover:text-white"
            onClick={() => setQty((q) => q + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <motion.button
          type="button"
          disabled={!inStock}
          onClick={handleAdd}
          whileTap={reduce ? undefined : { scale: 0.98 }}
          className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-spectrum py-4 font-display text-sm font-semibold text-lab-base shadow-glow disabled:cursor-not-allowed disabled:opacity-50"
        >
          <AnimatePresence mode="wait">
            {added ? (
              <motion.span key="ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-lab-mint">
                Added to cart
              </motion.span>
            ) : (
              <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Add to cart
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        <Link
          href={catalogHref('/checkout')}
          className="flex w-full items-center justify-center rounded-2xl border border-white/15 bg-white/5 py-4 font-display text-sm font-semibold text-white transition hover:border-lab-primary/40 hover:bg-white/10"
        >
          Buy now
        </Link>
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-2 border-t border-white/10 pt-4 text-xs text-slate-400">
        {TRUST_ITEMS.map((item) => (
          <li key={item} className="flex items-center gap-1.5">
            <span className="text-lab-mint">✓</span>
            {item}
          </li>
        ))}
      </ul>

      <p className="rounded-xl border border-lab-energy/20 bg-lab-energy/5 px-4 py-3 text-xs leading-relaxed text-slate-400">
        For laboratory research use only. Not for human or veterinary administration. Verify institutional and
        jurisdictional requirements before acquisition.
      </p>
    </div>
  );
}
