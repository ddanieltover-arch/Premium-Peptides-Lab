import type { Metadata } from 'next';
import { CheckoutSuccessClient } from '@/components/checkout/CheckoutSuccessClient';
import { StorefrontPageShell } from '@/components/layout/StorefrontPageShell';
import { getNavCategories } from '@/lib/data/catalog';
import { buildRootMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...buildRootMetadata(),
  title: 'Order confirmed',
  description: 'Your Premium Peptides Lab order has been received.',
};

type PageProps = {
  searchParams: Promise<{ orderNumber?: string; orderId?: string; emailFailed?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { orderNumber, orderId, emailFailed } = await searchParams;
  const categories = await getNavCategories();

  return (
    <StorefrontPageShell categories={categories}>
      <CheckoutSuccessClient
        orderId={orderId}
        orderNumber={orderNumber}
        emailFailed={emailFailed === '1'}
      />
    </StorefrontPageShell>
  );
}
