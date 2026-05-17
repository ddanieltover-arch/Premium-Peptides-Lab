import type { Metadata } from 'next';
import Link from 'next/link';
import { StorefrontPageShell } from '@/components/layout/StorefrontPageShell';
import { Button } from '@/components/ui/button';
import { getNavCategories } from '@/lib/data/catalog';
import { catalogHref } from '@/lib/data/navigation';
import { buildRootMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...buildRootMetadata(),
  title: 'Order confirmed',
  description: 'Your Premium Peptides Lab order has been received.',
};

type PageProps = {
  searchParams: Promise<{ orderNumber?: string; orderId?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { orderNumber, orderId } = await searchParams;
  const orderRef = orderNumber ?? orderId;
  const categories = await getNavCategories();

  return (
    <StorefrontPageShell categories={categories}>
      <main id="main-content" className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-mint">Order received</p>
        <h1 className="mt-4 font-display text-3xl text-white">Thank you for your order</h1>
        {orderRef ? (
          <p className="mt-4 font-mono text-sm text-slate-400">
            Reference: <span className="text-lab-primary">{orderRef}</span>
          </p>
        ) : null}
        <p className="mt-6 text-sm leading-relaxed text-slate-400">
          We will confirm availability and send fulfillment details to the email provided at checkout. For
          technical questions about your lot documentation, contact our support team.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href={catalogHref('/products')} size="lg">
            Continue shopping
          </Button>
          <Link href={catalogHref('/contact')} className="inline-flex items-center text-sm text-lab-primary hover:text-white">
            Contact support →
          </Link>
        </div>
      </main>
    </StorefrontPageShell>
  );
}
