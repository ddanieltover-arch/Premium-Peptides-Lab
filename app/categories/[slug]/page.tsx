import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CatalogPageClient } from '@/components/catalog/CatalogPageClient';
import {
  getCatalogPriceBounds,
  getCatalogProducts,
  getCategoryBySlug,
  getNavCategories,
  normalizeCatalogSort,
} from '@/lib/data/catalog';
import { normalizePriceRange, parseCatalogPriceParam } from '@/lib/catalog/price-params';
import { getCategoryHubContent } from '@/lib/data/category-hubs';
import { buildRootMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ search?: string; sort?: string; page?: string; min?: string; max?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) {
    return { title: 'Category not found' };
  }
  const base = buildRootMetadata();
  const hub = getCategoryHubContent(slug, category.name, category.description);
  return {
    ...base,
    title: category.name,
    description: hub.description,
  };
}

export default async function CategoryHubPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1);
  const sort = normalizeCatalogSort(sp.sort);
  const { minPrice, maxPrice } = normalizePriceRange(
    parseCatalogPriceParam(sp.min),
    parseCatalogPriceParam(sp.max),
  );

  const [catalog, categories, priceBounds] = await Promise.all([
    getCatalogProducts({
      categorySlug: slug,
      search: sp.search,
      sort,
      page,
      minPrice,
      maxPrice,
    }),
    getNavCategories(),
    getCatalogPriceBounds(slug),
  ]);

  const hub = getCategoryHubContent(slug, category.name, category.description);

  return (
    <CatalogPageClient
      catalog={catalog}
      categories={categories}
      activeCategory={slug}
      search={sp.search}
      sort={sort}
      hub={hub}
      priceBounds={priceBounds}
      minPrice={minPrice}
      maxPrice={maxPrice}
    />
  );
}
