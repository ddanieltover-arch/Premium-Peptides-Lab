import type { Metadata } from 'next';
import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { getNavCategories } from '@/lib/data/catalog';
import { buildRootMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...buildRootMetadata(),
  title: 'Refund policy',
  description: 'Refund, replacement, and order adjustment policy for Premium Peptides Lab.',
};

export default async function RefundsPage() {
  const categories = await getNavCategories();
  return <LegalPageClient pageKey="refunds" categories={categories} />;
}
