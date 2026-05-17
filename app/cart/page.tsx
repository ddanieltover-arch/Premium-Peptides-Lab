import type { Metadata } from 'next';
import { CartPageClient } from '@/components/cart/CartPageClient';
import { getNavCategories } from '@/lib/data/catalog';
import { buildRootMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...buildRootMetadata(),
  title: 'Cart',
  description: 'Review your research catalog selections before checkout.',
};

export default async function CartPage() {
  const categories = await getNavCategories();
  return <CartPageClient categories={categories} />;
}
