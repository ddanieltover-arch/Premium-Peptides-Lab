import type { Metadata } from 'next';
import { AccountPageClient } from '@/components/account/AccountPageClient';
import { getNavCategories } from '@/lib/data/catalog';
import { buildRootMetadata } from '@/lib/seo/metadata';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...buildRootMetadata(),
  title: 'Account',
  description: 'Sign in, order history, and institutional account tools for Premium Peptides Lab.',
};

export default async function AccountPage() {
  const categories = await getNavCategories();

  let signedIn = false;
  let email: string | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      signedIn = true;
      email = data.user.email ?? null;
    }
  } catch {
    // Auth optional until configured
  }

  return <AccountPageClient categories={categories} signedIn={signedIn} email={email} />;
};
