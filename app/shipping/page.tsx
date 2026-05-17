import type { Metadata } from 'next';
import { ShippingPageClient } from '@/components/shipping/ShippingPageClient';
import { getNavCategories } from '@/lib/data/catalog';
import { buildRootMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...buildRootMetadata(),
  title: 'Shipping',
  description:
    'Order processing, cold-chain dispatch, delivery windows, and shipping rates for Premium Peptides Lab research materials.',
};

export default async function ShippingPage() {
  const categories = await getNavCategories();
  return <ShippingPageClient categories={categories} />;
};
