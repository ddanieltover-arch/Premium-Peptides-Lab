import type { Metadata } from 'next';
import { PeptideCalculatorPageClient } from '@/components/calculator/PeptideCalculatorPageClient';
import { getNavCategories } from '@/lib/data/catalog';
import { buildRootMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...buildRootMetadata(),
  title: 'Peptide calculator',
  description:
    'Reconstitution and syringe draw-volume calculator for lyophilised peptide stocks—research protocol planning only.',
};

export default async function PeptideCalculatorPage() {
  const categories = await getNavCategories();
  return <PeptideCalculatorPageClient categories={categories} />;
};
