import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { CatalogPageClient } from '@/components/catalog/CatalogPageClient';
import { getCatalogPriceBounds, getCatalogProducts, getNavCategories, normalizeCatalogSort } from '@/lib/data/catalog';
import { normalizePriceRange, parseCatalogPriceParam } from '@/lib/catalog/price-params';
import { buildCategoryHref } from '@/lib/data/navigation';
import { buildRootMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
    min?: string;
    max?: string;
  }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { search } = await searchParams;
  const base = buildRootMetadata();
  const title = search ? `Search · ${search}` : 'Analytical catalog';
  return {
    ...base,
    title,
    description: 'Browse research-grade peptides with HPLC release documentation and batch traceability.',
  };
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);
  const sort = normalizeCatalogSort(params.sort);
  const { minPrice, maxPrice } = normalizePriceRange(
    parseCatalogPriceParam(params.min),
    parseCatalogPriceParam(params.max),
  );

  if (params.category?.trim()) {
    redirect(
      buildCategoryHref(params.category.trim(), {
        search: params.search,
        sort,
        page,
        minPrice,
        maxPrice,
      }),
    );
  }

  const [catalog, categories, priceBounds] = await Promise.all([
    getCatalogProducts({
      search: params.search,
      sort,
      page,
      minPrice,
      maxPrice,
    }),
    getNavCategories(),
    getCatalogPriceBounds(),
  ]);

  return (
    <CatalogPageClient
      catalog={catalog}
      categories={categories}
      search={params.search}
      sort={sort}
      priceBounds={priceBounds}
      minPrice={minPrice}
      maxPrice={maxPrice}
    />
  );
}
