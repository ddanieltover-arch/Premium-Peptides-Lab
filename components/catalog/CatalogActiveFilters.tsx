import Link from 'next/link';
import { CATALOG_SORT_OPTIONS, buildCategoryHref, buildProductsHref, type CatalogSort } from '@/lib/data/navigation';

type Props = {
  activeCategory?: string;
  activeCategoryName?: string;
  search?: string;
  sort: CatalogSort;
  minPrice?: number;
  maxPrice?: number;
};

function sortLabel(sort: CatalogSort): string {
  return CATALOG_SORT_OPTIONS.find((o) => o.value === sort)?.label ?? sort;
}

export function CatalogActiveFilters({
  activeCategory,
  activeCategoryName,
  search,
  sort,
  minPrice,
  maxPrice,
}: Props) {
  const hasPriceFilter = (minPrice != null && minPrice > 0) || (maxPrice != null && maxPrice > 0);
  const hasSort = sort !== 'newest';
  const hasCategory = Boolean(activeCategory);
  const hasSearch = Boolean(search?.trim());
  const hasAny = hasCategory || hasSearch || hasSort || hasPriceFilter;

  if (!hasAny) return null;

  const clearHref = activeCategory ? buildCategoryHref(activeCategory, {}) : buildProductsHref({});

  const chipClass =
    'inline-flex items-center gap-1.5 rounded-full border border-lab-primary/30 bg-lab-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-lab-primary transition hover:border-lab-primary/50 hover:bg-lab-primary/20';

  const chipMuted =
    'inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-lab-surface/60 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-400 transition hover:border-white/20 hover:text-white';

  function hrefWithout(partial: {
    search?: boolean;
    sort?: boolean;
    price?: boolean;
    category?: boolean;
  }) {
    const nextSearch = partial.search ? undefined : search;
    const nextSort = partial.sort ? 'newest' : sort;
    const nextMin = partial.price ? undefined : minPrice;
    const nextMax = partial.price ? undefined : maxPrice;
    const cat = partial.category ? undefined : activeCategory;

    if (cat) {
      return buildCategoryHref(cat, { search: nextSearch, sort: nextSort, minPrice: nextMin, maxPrice: nextMax });
    }
    return buildProductsHref({ search: nextSearch, sort: nextSort, minPrice: nextMin, maxPrice: nextMax });
  }

  const priceLabel =
    minPrice != null && maxPrice != null
      ? `$${minPrice}–$${maxPrice}`
      : minPrice != null
        ? `From $${minPrice}`
        : maxPrice != null
          ? `Up to $${maxPrice}`
          : null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Active filters</span>
      {hasCategory && activeCategory ? (
        <Link href={hrefWithout({ category: true })} className={chipClass}>
          {activeCategoryName ?? activeCategory}
          <span aria-hidden>×</span>
        </Link>
      ) : null}
      {hasSearch ? (
        <Link href={hrefWithout({ search: true })} className={chipMuted}>
          Search: &ldquo;{search}&rdquo;
          <span aria-hidden>×</span>
        </Link>
      ) : null}
      {hasSort ? (
        <Link href={hrefWithout({ sort: true })} className={chipMuted}>
          Sort: {sortLabel(sort)}
          <span aria-hidden>×</span>
        </Link>
      ) : null}
      {hasPriceFilter && priceLabel ? (
        <Link href={hrefWithout({ price: true })} className={chipMuted}>
          Price: {priceLabel}
          <span aria-hidden>×</span>
        </Link>
      ) : null}
      <Link href={clearHref} className="font-mono text-[10px] uppercase tracking-wider text-slate-500 hover:text-white">
        Clear all
      </Link>
    </div>
  );
}
