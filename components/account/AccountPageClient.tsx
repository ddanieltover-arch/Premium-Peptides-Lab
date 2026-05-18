'use client';

import Link from 'next/link';
import type { CategoryWithCount } from '@/lib/types/catalog';
import type { CustomerOrderSummary } from '@/lib/orders';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';
import { Button } from '@/components/ui/button';
import { AccountSignInForm } from '@/components/account/AccountSignInForm';
import { AccountSignOutButton } from '@/components/account/AccountSignOutButton';
import { OrderHistoryList } from '@/components/account/OrderHistoryList';
import { catalogHref } from '@/lib/data/navigation';
import { SITE_EMAIL } from '@/lib/seo/site';

type Props = {
  categories: CategoryWithCount[];
  signedIn: boolean;
  email?: string | null;
  orders: CustomerOrderSummary[];
  authError?: boolean;
};

export function AccountPageClient({ categories, signedIn, email, orders, authError }: Props) {
  return (
    <StorefrontChrome categories={categories}>
      <main id="main-content">
        <section className="border-b border-white/10 bg-mesh-dark py-14 md:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-violet">Account</p>
            <h1 className="mt-3 font-display text-3xl text-white md:text-5xl">
              {signedIn ? 'Your orders' : 'Sign in'}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 md:text-base">
              {signedIn
                ? `Signed in as ${email}. Orders are matched to the email used at checkout.`
                : 'Request a one-time sign-in link. No password—use the same email as your PPL- checkout.'}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-12 md:py-16">
          {signedIn ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="rounded-2xl border border-lab-mint/30 bg-lab-mint/10 px-5 py-4">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-lab-mint">Session</p>
                  <p className="mt-1 text-sm text-slate-200">{email}</p>
                </div>
                <AccountSignOutButton />
              </div>

              <h2 className="mt-10 font-display text-xl text-white">Order history</h2>
              <p className="mt-2 text-sm text-slate-500">
                Select an order for line items, shipping, and payment status.
              </p>
              <div className="mt-6">
                <OrderHistoryList orders={orders} />
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-lab-primary/30 bg-lab-primary/10 p-6 md:p-8">
              <h2 className="font-display text-lg text-white">Sign in with email</h2>
              <p className="mt-2 text-sm text-slate-400">
                Guest checkout stays available. Sign in to see all orders tied to your checkout email.
              </p>
              <div className="mt-6">
                <AccountSignInForm authError={authError} />
              </div>
            </div>
          )}

          <div className="mt-12 rounded-2xl border border-white/10 bg-lab-surface/50 p-6">
            <h2 className="font-display text-lg text-white">Track a single order</h2>
            <p className="mt-2 text-sm text-slate-400">
              Have a PPL- reference from confirmation email? Open the order link from that email, or contact{' '}
              <a href={`mailto:${SITE_EMAIL}`} className="text-lab-primary hover:text-white">
                {SITE_EMAIL}
              </a>{' '}
              with your order number.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={catalogHref('/products')} variant="secondary" size="md">
                Browse catalog
              </Button>
              <Link
                href={catalogHref('/faq')}
                className="inline-flex items-center rounded-2xl border border-white/10 px-5 py-2.5 font-display text-sm text-slate-300 hover:border-lab-primary/40 hover:text-white"
              >
                FAQ
              </Link>
            </div>
          </div>
        </section>
      </main>
    </StorefrontChrome>
  );
}
