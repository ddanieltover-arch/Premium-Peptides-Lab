import type { Metadata } from 'next';
import { CatalogPageClient } from '@/components/catalog/CatalogPageClient';
import { getCatalogProducts, getNavCategories, normalizeCatalogSort } from '@/lib/data/catalog';
import { buildRootMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<{ category?: string; search?: string; sort?: string; page?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { category, search } = await searchParams;
  const base = buildRootMetadata();
  const title = search
    ? `Search · ${search}`
    : category
      ? `Catalog · ${category}`
      : 'Analytical catalog';
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

  const [catalog, categories] = await Promise.all([
    getCatalogProducts({
      categorySlug: params.category,
      search: params.search,
      sort,
      page,
    }),
    getNavCategories(),
  ]);

  return (
    <CatalogPageClient
      catalog={catalog}
      categories={categories}
      activeCategory={params.category}
      search={params.search}
      sort={sort}
    />
  );
}
