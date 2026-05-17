import type { Metadata } from 'next';
import { CoaPageClient } from '@/components/coa/CoaPageClient';
import { getCoaEntries } from '@/lib/data/coa';
import { getNavCategories } from '@/lib/data/catalog';
import { buildRootMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...buildRootMetadata(),
  title: 'COA library',
  description:
    'Batch-level certificates of analysis with HPLC purity, LC–MS identity confirmation, and verification metadata for active catalog SKUs.',
};

export default async function CoaPage() {
  const [categories, entries] = await Promise.all([getNavCategories(), getCoaEntries()]);
  return <CoaPageClient categories={categories} entries={entries} />;
};
