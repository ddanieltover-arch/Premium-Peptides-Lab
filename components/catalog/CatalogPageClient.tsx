'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { CategoryWithCount, FeaturedProduct } from '@/lib/types/catalog';
import { ProductCard } from '@/components/product/ProductCard';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';
import { featuredToCartItem } from '@/lib/cart/helpers';
import { useCartStore } from '@/lib/cart/store';
import { useCartUIStore } from '@/lib/cart/ui-store';
import { buildProductsHref, catalogHref, CATALOG_SORT_OPTIONS, type CatalogSort } from '@/lib/data/navigation';
import type { CatalogResult } from '@/lib/data/catalog';

type Props = {
  catalog: CatalogResult;
  categories: CategoryWithCount[];
  activeCategory?: string;
  search?: string;
  sort: CatalogSort;
};

export function CatalogPageClient({ catalog, categories, activeCategory, search, sort }: Props) {
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const addItem = useCartStore((s) => s.addItem);
  const setCartDrawerOpen = useCartUIStore((s) => s.setCartDrawerOpen);

  const addToCart = useCallback(
    (id: string) => {
      const product = catalog.products.find((p) => p.id === id);
      if (!product) return;
      addItem(featuredToCartItem(product));
      setCartDrawerOpen(true);
      setAdded((a) => ({ ...a, [id]: true }));
      window.setTimeout(() => setAdded((a) => ({ ...a, [id]: false })), 900);
    },
    [addItem, catalog.products, setCartDrawerOpen],
  );

  const activeCat = categories.find((c) => c.slug === activeCategory);

  return (
    <StorefrontChrome categories={categories}>
      <main className="border-t border-white/5 bg-lab-base pb-24">
        <motion.header className="mx-auto max-w-7xl px-4 pb-8 pt-10 md:pt-14">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-primary">Analytical catalog</p>
          <h1 className="mt-2 font-display text-3xl text-white md:text-4xl">
            {activeCat ? activeCat.name : 'All research constructs'}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-400">
            {catalog.total} active listing{catalog.total === 1 ? '' : 's'}
            {search ? (
              <>
                {' '}
                matching <span className="text-slate-200">&ldquo;{search}&rdquo;</span>
              </>
            ) : null}
            . Every SKU ships with lot-specific documentation where applicable.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href={buildProductsHref({ search, sort })}
              className={`rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition ${
                !activeCategory ? 'bg-lab-primary/20 text-lab-primary' : 'border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              All ({categories.reduce((n, c) => n + c.count, 0)})
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={buildProductsHref({ category: cat.slug, search, sort })}
                className={`rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition ${
                  activeCategory === cat.slug
                    ? 'bg-lab-primary/20 text-lab-primary'
                    : 'border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {cat.name} ({cat.count})
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <form method="get" action={catalogHref('/products')} className="flex max-w-md flex-1 gap-2">
              {activeCategory ? <input type="hidden" name="category" value={activeCategory} /> : null}
              {sort !== 'newest' ? <input type="hidden" name="sort" value={sort} /> : null}
              <input
                type="search"
                name="search"
                defaultValue={search ?? ''}
                placeholder="Search catalog…"
                className="flex-1 rounded-xl border border-white/10 bg-lab-base/80 px-3 py-2 font-mono text-sm text-white outline-none placeholder:text-slate-600 focus:border-lab-primary/50"
              />
              <button
                type="submit"
                className="rounded-xl border border-lab-primary/40 bg-lab-primary/15 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-lab-primary hover:bg-lab-primary/25"
              >
                Search
              </button>
            </form>

            <form method="get" action={catalogHref('/products')} className="flex items-center gap-2">
              {activeCategory ? <input type="hidden" name="category" value={activeCategory} /> : null}
              {search ? <input type="hidden" name="search" value={search} /> : null}
              <label htmlFor="catalog-sort" className="sr-only">
                Sort products
              </label>
              <select
                id="catalog-sort"
                name="sort"
                defaultValue={sort}
                className="rounded-xl border border-white/10 bg-lab-base/80 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-slate-300 outline-none focus:border-lab-primary/50"
              >
                {CATALOG_SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-xl border border-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-slate-400 hover:border-lab-primary/40 hover:text-white"
              >
                Apply
              </button>
            </form>
          </div>

          {(search || sort !== 'newest') && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {search ? (
                <Link
                  href={buildProductsHref({ category: activeCategory, sort })}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-lab-surface/60 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-400 hover:text-white"
                >
                  Clear search ×
                </Link>
              ) : null}
              {sort !== 'newest' ? (
                <Link
                  href={buildProductsHref({ category: activeCategory, search })}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-lab-surface/60 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-400 hover:text-white"
                >
                  Reset sort ×
                </Link>
              ) : null}
            </div>
          )}
        </motion.header>

        <div className="mx-auto max-w-7xl px-4">
          {catalog.products.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-lab-surface/50 py-16 text-center text-sm text-slate-500">
              No products match this filter.
            </p>
          ) : (
            <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {catalog.products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  added={!!added[product.id]}
                  onAddToCart={addToCart}
                />
              ))}
            </motion.div>
          )}

          {catalog.totalPages > 1 && (
            <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
              {Array.from({ length: catalog.totalPages }, (_, i) => i + 1).map((p) => {
                return (
                  <Link
                    key={p}
                    href={buildProductsHref({
                      category: activeCategory,
                      search,
                      sort,
                      page: p,
                    })}
                    className={`min-w-[2.5rem] rounded-lg px-3 py-2 text-center font-mono text-xs ${
                      p === catalog.page
                        ? 'bg-lab-primary/20 text-lab-primary'
                        : 'border border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </main>
    </StorefrontChrome>
  );
}
