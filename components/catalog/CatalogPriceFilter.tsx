'use client';

import Link from 'next/link';
import {
  buildCategoryHref,
  buildProductsHref,
  liveCatalogHref,
  type CatalogSort,
} from '@/lib/data/navigation';
import type { CatalogPriceBounds } from '@/lib/data/catalog';

type Props = {
  bounds: CatalogPriceBounds;
  activeCategory?: string;
  search?: string;
  sort: CatalogSort;
  minPrice?: number;
  maxPrice?: number;
};

const inputClass =
  'w-full rounded-xl border border-white/10 bg-lab-base/80 px-3 py-2 font-mono text-sm text-white outline-none focus:border-lab-primary/50';

export function CatalogPriceFilter({
  bounds,
  activeCategory,
  search,
  sort,
  minPrice,
  maxPrice,
}: Props) {
  const listPath = activeCategory ? `/categories/${activeCategory}` : '/products';
  const listFormAction = liveCatalogHref(listPath);
  const hasFilter =
    (minPrice != null && minPrice > bounds.min) || (maxPrice != null && maxPrice < bounds.max);

  const clearHref = activeCategory
    ? buildCategoryHref(activeCategory, { search, sort })
    : buildProductsHref({ search, sort });

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-lab-surface/40 p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Price range (USD)</p>
      <form method="get" action={listFormAction} className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
        {search ? <input type="hidden" name="search" value={search} /> : null}
        {sort !== 'newest' ? <input type="hidden" name="sort" value={sort} /> : null}
        <div className="flex flex-1 gap-3">
          <label className="flex-1">
            <span className="sr-only">Minimum price</span>
            <span className="mb-1 block font-mono text-[10px] text-slate-600">Min</span>
            <input
              type="number"
              name="min"
              min={bounds.min}
              max={bounds.max}
              step="1"
              defaultValue={minPrice ?? ''}
              placeholder={String(bounds.min)}
              className={inputClass}
            />
          </label>
          <label className="flex-1">
            <span className="sr-only">Maximum price</span>
            <span className="mb-1 block font-mono text-[10px] text-slate-600">Max</span>
            <input
              type="number"
              name="max"
              min={bounds.min}
              max={bounds.max}
              step="1"
              defaultValue={maxPrice ?? ''}
              placeholder={String(bounds.max)}
              className={inputClass}
            />
          </label>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-xl border border-lab-primary/40 bg-lab-primary/15 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-lab-primary hover:bg-lab-primary/25"
          >
            Apply
          </button>
          {hasFilter ? (
            <Link
              href={clearHref}
              className="inline-flex items-center rounded-xl border border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-slate-400 hover:text-white"
            >
              Clear
            </Link>
          ) : null}
        </div>
      </form>
      <p className="mt-2 text-[10px] text-slate-600">
        Catalog spans ${bounds.min}–${bounds.max} base price. Variant modifiers may apply on the product page.
      </p>
    </div>
  );
}
