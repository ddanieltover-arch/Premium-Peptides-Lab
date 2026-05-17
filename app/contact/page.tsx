import type { Metadata } from 'next';
import { ContactPageClient } from '@/components/contact/ContactPageClient';
import { getNavCategories } from '@/lib/data/catalog';
import { buildRootMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...buildRootMetadata(),
  title: 'Contact',
  description:
    'Technical support for orders, COA retrieval, product availability, and institutional onboarding at Premium Peptides Lab.',
};

export default async function ContactPage() {
  const categories = await getNavCategories();
  return <ContactPageClient categories={categories} />;
};
