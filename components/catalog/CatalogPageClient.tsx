'use client';

import { useCallback, useState, type ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { CategoryWithCount, FeaturedProduct } from '@/lib/types/catalog';
import { ProductCard } from '@/components/product/ProductCard';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';
import { featuredToCartItem } from '@/lib/cart/helpers';
import { useAddToCart } from '@/lib/cart/use-add-to-cart';
import {
  buildCategoryHref,
  buildProductsHref,
  catalogHref,
  CATALOG_SORT_OPTIONS,
  liveCatalogHref,
  type CatalogSort,
} from '@/lib/data/navigation';
import type { CatalogPriceBounds, CatalogResult } from '@/lib/data/catalog';
import type { CategoryHubContent } from '@/lib/data/category-hubs';
import { CategoryHubHero } from '@/components/catalog/CategoryHubHero';
import { CatalogPriceFilter } from '@/components/catalog/CatalogPriceFilter';

type Props = {
  catalog: CatalogResult;
  categories: CategoryWithCount[];
  activeCategory?: string;
  search?: string;
  sort: CatalogSort;
  hub?: CategoryHubContent;
  priceBounds: CatalogPriceBounds;
  minPrice?: number;
  maxPrice?: number;
};

const selectClass =
  'w-full rounded-xl border border-white/10 bg-lab-base/80 px-3 py-2.5 font-mono text-[10px] uppercase tracking-wider text-slate-300 outline-none focus:border-lab-primary/50';

export function CatalogPageClient({
  catalog,
  categories,
  activeCategory,
  search,
  sort,
  hub,
  priceBounds,
  minPrice,
  maxPrice,
}: Props) {
  const router = useRouter();
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const addToCartAction = useAddToCart();
  const totalCategoryCount = categories.reduce((n, c) => n + c.count, 0);

  const addToCart = useCallback(
    (id: string) => {
      const product = catalog.products.find((p) => p.id === id);
      if (!product) return;
      addToCartAction(featuredToCartItem(product));
      setAdded((a) => ({ ...a, [id]: true }));
      window.setTimeout(() => setAdded((a) => ({ ...a, [id]: false })), 900);
    },
    [addToCartAction, catalog.products],
  );

  const activeCat = categories.find((c) => c.slug === activeCategory);
  const listFormAction = liveCatalogHref(activeCategory ? `/categories/${activeCategory}` : '/products');
  const filterParams = { search, sort, minPrice, maxPrice };
  const hasPriceFilter =
    (minPrice != null && minPrice > 0) || (maxPrice != null && maxPrice > 0);

  const onCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const slug = e.target.value;
    router.push(
      buildProductsHref({
        category: slug || undefined,
        search,
        sort,
        minPrice,
        maxPrice,
      }),
    );
  };

  return (
    <StorefrontChrome categories={categories}>
      <main className="border-t border-white/5 bg-lab-base pb-24">
        {hub && activeCategory ? (
          <CategoryHubHero hub={hub} slug={activeCategory} productCount={catalog.total} />
        ) : null}

        <motion.header
          className={`mx-auto max-w-7xl px-4 pb-8 ${hub ? 'pt-8' : 'pt-10 md:pt-14'}`}
        >
          {!hub ? (
            <>
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
            </>
          ) : (
            <>
              <h2 className="font-display text-xl text-white md:text-2xl">Listings</h2>
              <p className="mt-2 text-sm text-slate-400">
                {catalog.total} active listing{catalog.total === 1 ? '' : 's'}
                {search ? (
                  <>
                    {' '}
                    matching <span className="text-slate-200">&ldquo;{search}&rdquo;</span>
                  </>
                ) : null}
              </p>
            </>
          )}

          {categories.length > 0 ? (
            <div className="mt-6 flex max-w-xl flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <label htmlFor="catalog-category" className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Category
            </label>
            <select
              id="catalog-category"
              value={activeCategory ?? ''}
              onChange={onCategoryChange}
              className={selectClass}
            >
              <option value="">All ({totalCategoryCount})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name} ({cat.count})
                </option>
              ))}
            </select>
            </div>
          ) : null}

          <CatalogPriceFilter
            bounds={priceBounds}
            activeCategory={activeCategory}
            search={search}
            sort={sort}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />

          <div className="mt-8 flex flex-col gap-4 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <form method="get" action={listFormAction} className="flex max-w-md flex-1 gap-2">
              {sort !== 'newest' ? <input type="hidden" name="sort" value={sort} /> : null}
              {minPrice != null ? <input type="hidden" name="min" value={minPrice} /> : null}
              {maxPrice != null ? <input type="hidden" name="max" value={maxPrice} /> : null}
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

            <form method="get" action={listFormAction} className="flex items-center gap-2">
              {search ? <input type="hidden" name="search" value={search} /> : null}
              {minPrice != null ? <input type="hidden" name="min" value={minPrice} /> : null}
              {maxPrice != null ? <input type="hidden" name="max" value={maxPrice} /> : null}
              <label htmlFor="catalog-sort" className="sr-only">
                Sort products
              </label>
              <select
                id="catalog-sort"
                name="sort"
                defaultValue={sort}
                className={selectClass}
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

          {(search || sort !== 'newest' || hasPriceFilter) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {search ? (
                <Link
                  href={
                    activeCategory
                      ? buildCategoryHref(activeCategory, { sort, minPrice, maxPrice })
                      : buildProductsHref({ sort, minPrice, maxPrice })
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-lab-surface/60 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-400 hover:text-white"
                >
                  Clear search ×
                </Link>
              ) : null}
              {sort !== 'newest' ? (
                <Link
                  href={
                    activeCategory
                      ? buildCategoryHref(activeCategory, { search, minPrice, maxPrice })
                      : buildProductsHref({ search, minPrice, maxPrice })
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-lab-surface/60 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-400 hover:text-white"
                >
                  Reset sort ×
                </Link>
              ) : null}
              {hasPriceFilter ? (
                <Link
                  href={
                    activeCategory
                      ? buildCategoryHref(activeCategory, { search, sort })
                      : buildProductsHref({ search, sort })
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-lab-surface/60 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-400 hover:text-white"
                >
                  Clear price ×
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
            <motion.div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
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
                    href={
                      activeCategory
                        ? buildCategoryHref(activeCategory, { ...filterParams, page: p })
                        : buildProductsHref({ ...filterParams, page: p })
                    }
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
