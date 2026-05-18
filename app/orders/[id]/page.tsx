import type { Metadata } from 'next';
import { PublicOrderPageClient } from '@/components/orders/PublicOrderPageClient';
import { getNavCategories } from '@/lib/data/catalog';
import { buildRootMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...buildRootMetadata(),
  title: 'Order details',
  description: 'View your Premium Peptides Lab order status, items, and shipping details.',
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const categories = await getNavCategories();

  return <PublicOrderPageClient orderId={id} categories={categories} />;
}
