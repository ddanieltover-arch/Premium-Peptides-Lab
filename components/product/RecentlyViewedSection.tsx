'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import type { FeaturedProduct } from '@/lib/types/catalog';
import { ProductCard } from '@/components/product/ProductCard';
import { featuredToCartItem } from '@/lib/cart/helpers';
import { useAddToCart } from '@/lib/cart/use-add-to-cart';
import { useRecentlyViewedStore } from '@/lib/recently-viewed/store';
import { catalogHref } from '@/lib/data/navigation';

type Props = {
  /** Hide this product on PDP when showing recently viewed */
  excludeProductId?: string;
  title?: string;
};

function toFeatured(item: ReturnType<typeof useRecentlyViewedStore.getState>['items'][0]): FeaturedProduct {
  return {
    id: item.productId,
    slug: item.slug,
    name: item.name,
    spec: item.spec,
    purity: item.purity,
    price: item.priceMin,
    priceMin: item.priceMin,
    priceMax: item.priceMax,
    compareAt: null,
    image: item.image,
  };
}

export function RecentlyViewedSection({ excludeProductId, title = 'Recently viewed' }: Props) {
  const items = useRecentlyViewedStore((s) => s.items);
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const addToCartAction = useAddToCart();

  const products = items
    .filter((i) => i.productId !== excludeProductId)
    .slice(0, 8)
    .map(toFeatured);

  const addToCart = useCallback(
    (id: string) => {
      const product = products.find((p) => p.id === id);
      if (!product) return;
      addToCartAction(featuredToCartItem(product));
      setAdded((a) => ({ ...a, [id]: true }));
      window.setTimeout(() => setAdded((a) => ({ ...a, [id]: false })), 900);
    },
    [addToCartAction, products],
  );

  if (products.length === 0) return null;

  return (
    <section className="border-t border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-violet">Your trail</p>
            <h2 className="mt-2 font-display text-2xl text-white md:text-3xl">{title}</h2>
          </div>
          <Link
            href={catalogHref('/products')}
            className="font-mono text-[10px] uppercase tracking-wider text-lab-primary hover:text-white"
          >
            Full catalog →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              added={!!added[product.id]}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
