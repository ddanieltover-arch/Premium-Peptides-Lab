import type { Metadata } from 'next';
import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { getNavCategories } from '@/lib/data/catalog';
import { buildRootMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...buildRootMetadata(),
  title: 'Terms of service',
  description: 'Terms governing use of Premium Peptides Lab and purchase of research-use-only materials.',
};

export default async function TermsPage() {
  const categories = await getNavCategories();
  return <LegalPageClient pageKey="terms" categories={categories} />;
}
