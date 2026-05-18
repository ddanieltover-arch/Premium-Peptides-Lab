'use client';

import Link from 'next/link';
import type { CategoryWithCount } from '@/lib/types/catalog';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';
import { Button } from '@/components/ui/button';
import { featuredToCartItem } from '@/lib/cart/helpers';
import { useAddToCart } from '@/lib/cart/use-add-to-cart';
import { catalogHref } from '@/lib/data/navigation';
import { catalogRatingFallback } from '@/lib/catalog/rating-fallback';
import { formatPriceRange } from '@/lib/pricing';
import { useWishlistStore } from '@/lib/wishlist/store';

type Props = { categories: CategoryWithCount[] };

export function WishlistPageClient({ categories }: Props) {
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const addToCart = useAddToCart();

  return (
    <StorefrontChrome categories={categories}>
      <main id="main-content" className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-violet">Saved SKUs</p>
        <h1 className="mt-2 font-display text-3xl text-white md:text-4xl">Wishlist</h1>
        <p className="mt-3 text-sm text-slate-400">
          Compounds you marked for later review. Saved in this browser only.
        </p>

        {items.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-slate-400">No saved products yet.</p>
            <Button href={catalogHref('/products')} className="mt-6">
              Browse catalog
            </Button>
          </div>
        ) : (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-lab-surface/50"
              >
                <Link href={catalogHref(`/products/${item.slug}`)} className="relative block aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <Link
                    href={catalogHref(`/products/${item.slug}`)}
                    className="font-display text-lg text-white hover:text-lab-primary"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 line-clamp-2 font-mono text-[10px] text-slate-500">{item.spec}</p>
                  <p className="mt-3 font-display text-xl tabular-nums text-white">
                    {formatPriceRange(item.priceMin, item.priceMax, 0)}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        const ratings = catalogRatingFallback(item.productId);
                        addToCart(
                          featuredToCartItem({
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
                            stock: 99,
                            ratingAverage: ratings.ratingAverage,
                            ratingCount: ratings.ratingCount,
                          }),
                        );
                      }}
                    >
                      Add to cart
                    </Button>
                    <button
                      type="button"
                      className="rounded-xl px-3 py-2 text-xs text-lab-rose hover:bg-lab-rose/10"
                      onClick={() => remove(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </StorefrontChrome>
  );
}
