import type { Metadata } from 'next';
import { AccountPageClient } from '@/components/account/AccountPageClient';
import { getNavCategories } from '@/lib/data/catalog';
import { getCustomerOrdersForEmail } from '@/lib/orders-server';
import { buildRootMetadata } from '@/lib/seo/metadata';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...buildRootMetadata(),
  title: 'Account',
  description: 'Sign in and view order history for Premium Peptides Lab research orders.',
};

type PageProps = {
  searchParams: Promise<{ auth?: string }>;
};

export default async function AccountPage({ searchParams }: PageProps) {
  const { auth } = await searchParams;
  const categories = await getNavCategories();

  let signedIn = false;
  let email: string | null = null;
  let orders: Awaited<ReturnType<typeof getCustomerOrdersForEmail>> = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data.user?.email) {
      signedIn = true;
      email = data.user.email;
      orders = await getCustomerOrdersForEmail(email);
    }
  } catch {
    // Supabase not configured — show sign-in UI without crashing
  }

  return (
    <AccountPageClient
      categories={categories}
      signedIn={signedIn}
      email={email}
      orders={orders}
      authError={auth === 'error'}
    />
  );
}
