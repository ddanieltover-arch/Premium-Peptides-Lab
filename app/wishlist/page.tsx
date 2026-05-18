import type { Metadata } from 'next';
import { WishlistPageClient } from '@/components/wishlist/WishlistPageClient';
import { getNavCategories } from '@/lib/data/catalog';
import { buildRootMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...buildRootMetadata(),
  title: 'Wishlist',
  description: 'Saved research compounds for later review.',
};

export default async function WishlistPage() {
  const categories = await getNavCategories();
  return <WishlistPageClient categories={categories} />;
}
