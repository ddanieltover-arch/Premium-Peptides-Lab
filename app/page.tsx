import type { Metadata } from 'next';
import { HomePage } from '@/components/home/HomePage';
import { buildHomeMetadata } from '@/lib/seo/metadata';
import {
  getActiveProductCount,
  getCategoryShowcase,
  getFeaturedProducts,
} from '@/lib/data/catalog';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildHomeMetadata();

export default async function Page() {
  const [featuredProducts, categories, productCount] = await Promise.all([
    getFeaturedProducts(4),
    getCategoryShowcase(6),
    getActiveProductCount(),
  ]);

  return (
    <HomePage
      featuredProducts={featuredProducts}
      categories={categories}
      productCount={productCount}
    />
  );
}
