import type { Metadata } from 'next';
import { CheckoutPageClient } from '@/components/checkout/CheckoutPageClient';
import { getNavCategories } from '@/lib/data/catalog';
import { buildRootMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...buildRootMetadata(),
  title: 'Checkout',
  description: 'Complete your institutional order with secure checkout.',
};

export default async function CheckoutPage() {
  const categories = await getNavCategories();
  return <CheckoutPageClient categories={categories} />;
}
