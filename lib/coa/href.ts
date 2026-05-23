import { catalogHref } from '@/lib/data/navigation';

/** COA table / library links target the on-site PDP COA section (not legacy source_url). */
export function coaProductHref(productSlug: string): string {
  return catalogHref(`/products/${encodeURIComponent(productSlug)}#coa`);
}
