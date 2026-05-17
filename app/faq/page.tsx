import type { Metadata } from 'next';
import { FaqPageClient } from '@/components/faq/FaqPageClient';
import { getNavCategories } from '@/lib/data/catalog';
import { buildRootMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...buildRootMetadata(),
  title: 'FAQ',
  description:
    'Shipping windows, COA documentation, purity standards, and research-use policies for Premium Peptides Lab institutional buyers.',
};

export default async function FaqPage() {
  const categories = await getNavCategories();
  return <FaqPageClient categories={categories} />;
};
