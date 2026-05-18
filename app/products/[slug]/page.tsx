import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductPageClient } from '@/components/product/ProductPageClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { getNavCategories, getProductBySlug, getRelatedProducts } from '@/lib/data/catalog';
import { getProductReviews } from '@/lib/data/reviews';
import { productBreadcrumbJsonLd, productJsonLd } from '@/lib/seo/json-ld';
import { buildProductMetadata } from '@/lib/seo/metadata';

type PageProps = { params: Promise<{ slug: string }> };

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product not found' };
  return buildProductMetadata(product);
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, categories, reviewSummary] = await Promise.all([
    getRelatedProducts(product.id, product.category?.id ?? null),
    getNavCategories(),
    getProductReviews(product.id, product.name),
  ]);

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <JsonLd data={productBreadcrumbJsonLd(product)} />
      <ProductPageClient
        product={product}
        related={related}
        categories={categories}
        reviewSummary={reviewSummary}
      />
    </>
  );
}
