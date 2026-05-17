import type { Metadata } from 'next';
import { ResearchPageClient } from '@/components/research/ResearchPageClient';
import { getNavCategories } from '@/lib/data/catalog';
import { buildRootMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...buildRootMetadata(),
  title: 'Research hub',
  description:
    'Evidence-based peptide research briefs on mechanisms, metabolic models, regenerative signalling, and analytical standards—for qualified professionals.',
};

export default async function ResearchPage() {
  const categories = await getNavCategories();
  return <ResearchPageClient categories={categories} />;
};
