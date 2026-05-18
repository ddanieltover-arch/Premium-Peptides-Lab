import type { Metadata } from 'next';
import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { getNavCategories } from '@/lib/data/catalog';
import { buildRootMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...buildRootMetadata(),
  title: 'Privacy policy',
  description: 'How Premium Peptides Lab collects, uses, and protects your information.',
};

export default async function PrivacyPage() {
  const categories = await getNavCategories();
  return <LegalPageClient pageKey="privacy" categories={categories} />;
}
