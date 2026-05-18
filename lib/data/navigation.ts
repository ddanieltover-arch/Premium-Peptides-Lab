import { publicSiteHref } from '@/lib/seo/site';

/** In-app relative path (same-origin navigation within the current deployment). */
export function catalogHref(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

/** Absolute URL on the live storefront — use for form actions and shared links. */
export function liveCatalogHref(path: string): string {
  return publicSiteHref(catalogHref(path));
}

export const CATALOG_SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name-asc', label: 'Name: A–Z' },
  { value: 'name-desc', label: 'Name: Z–A' },
] as const;

export type CatalogSort = (typeof CATALOG_SORT_OPTIONS)[number]['value'];

export type ProductsUrlParams = {
  category?: string;
  search?: string;
  sort?: CatalogSort;
  page?: number;
  minPrice?: number;
  maxPrice?: number;
};

function appendCatalogQuery(q: URLSearchParams, params: Omit<ProductsUrlParams, 'category'>) {
  if (params.search?.trim()) q.set('search', params.search.trim());
  if (params.sort && params.sort !== 'newest') q.set('sort', params.sort);
  if (params.page && params.page > 1) q.set('page', String(params.page));
  if (params.minPrice != null && params.minPrice > 0) q.set('min', String(params.minPrice));
  if (params.maxPrice != null && params.maxPrice > 0) q.set('max', String(params.maxPrice));
}

export type CategoryUrlParams = Omit<ProductsUrlParams, 'category'>;

export function buildProductsHref(params: ProductsUrlParams = {}): string {
  const { category, ...rest } = params;
  if (category) return buildCategoryHref(category, rest);
  const q = new URLSearchParams();
  appendCatalogQuery(q, rest);
  const qs = q.toString();
  return catalogHref(`/products${qs ? `?${qs}` : ''}`);
}

/** Category hub URL — canonical listing route for a taxonomy facet. */
export function buildCategoryHref(slug: string, params: CategoryUrlParams = {}): string {
  const q = new URLSearchParams();
  appendCatalogQuery(q, params);
  const qs = q.toString();
  return catalogHref(`/categories/${encodeURIComponent(slug)}${qs ? `?${qs}` : ''}`);
}

/** Prefer category hub when a facet is selected; otherwise full catalog. */
export function buildCatalogHref(params: ProductsUrlParams = {}): string {
  return buildProductsHref(params);
}

export const ANNOUNCEMENT_MESSAGES = [
  {
    id: 'shipping',
    highlight: 'Free shipping',
    text: 'on qualifying orders $400+',
  },
  {
    id: 'purity',
    highlight: '≥99% purity',
    text: 'HPLC release on qualified SKUs',
  },
  {
    id: 'coa',
    highlight: 'COA verified',
    text: 'batch documentation with every shipment',
  },
  {
    id: 'dispatch',
    highlight: 'Cold-chain dispatch',
    text: '24–48h fulfillment window',
  },
] as const;

export const MAIN_NAV_LINKS = [
  { href: catalogHref('/research'), label: 'Research' },
  { href: catalogHref('/coa'), label: 'COA' },
  { href: catalogHref('/contact'), label: 'Support' },
] as const;

export type BottomNavItem =
  | { id: string; label: string; href: string; icon: 'home' | 'shop' | 'cart' | 'account' }
  | { id: string; label: string; action: 'search'; icon: 'search' };

export const MOBILE_BOTTOM_NAV: BottomNavItem[] = [
  { id: 'home', label: 'Home', href: catalogHref('/'), icon: 'home' },
  { id: 'shop', label: 'Shop', href: catalogHref('/products'), icon: 'shop' },
  { id: 'search', label: 'Search', action: 'search', icon: 'search' },
  { id: 'cart', label: 'Cart', href: catalogHref('/cart'), icon: 'cart' },
  { id: 'account', label: 'Account', href: catalogHref('/account'), icon: 'account' },
];

export function splitCategoriesIntoColumns<T>(items: T[], columns = 3): T[][] {
  if (items.length === 0) return [];
  const perCol = Math.ceil(items.length / columns);
  return Array.from({ length: columns }, (_, i) => items.slice(i * perCol, (i + 1) * perCol)).filter(
    (col) => col.length > 0,
  );
}
