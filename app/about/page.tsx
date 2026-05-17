import type { Metadata } from 'next';
import { AboutPageClient } from '@/components/about/AboutPageClient';
import { getNavCategories } from '@/lib/data/catalog';
import { buildRootMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...buildRootMetadata(),
  title: 'About',
  description:
    'Premium Peptides Lab — analytical peptide standards with HPLC release documentation, third-party verification, and research-first logistics.',
};

export default async function AboutPage() {
  const categories = await getNavCategories();
  return <AboutPageClient categories={categories} />;
};
