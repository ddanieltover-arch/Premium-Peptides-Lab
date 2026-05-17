import Link from 'next/link';
import type { CategoryWithCount } from '@/lib/types/catalog';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';
import { Button } from '@/components/ui/button';
import { SITE_LINKS } from '@/lib/data/home-content';
import { catalogHref } from '@/lib/data/navigation';
import { SITE_EMAIL } from '@/lib/seo/site';

type Props = {
  categories: CategoryWithCount[];
  signedIn: boolean;
  email?: string | null;
};

const ACCOUNT_FEATURES = [
  {
    title: 'Order history',
    body: 'View past PPL- orders, payment status, and shipment tracking once account sign-in is enabled.',
  },
  {
    title: 'Saved institutions',
    body: 'Store receiving addresses and PO references for repeat institutional purchases.',
  },
  {
    title: 'COA archive',
    body: 'Quick access to certificates tied to your prior lots without re-requesting from support.',
  },
] as const;

export function AccountPageClient({ categories, signedIn, email }: Props) {
  return (
    <StorefrontChrome categories={categories}>
      <main id="main-content">
        <section className="border-b border-white/10 bg-mesh-dark py-14 md:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-violet">Account</p>
            <h1 className="mt-3 font-display text-3xl text-white md:text-5xl">
              {signedIn ? 'Your account' : 'Sign in & orders'}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 md:text-base">
              {signedIn
                ? `Signed in as ${email}. Order history will appear here as account features roll out.`
                : 'Guest checkout is available today. Full account sign-in and order history are coming soon—use your PPL- confirmation email for status updates.'}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-12 md:py-16">
          {!signedIn ? (
            <div className="rounded-2xl border border-lab-primary/30 bg-lab-primary/10 p-6 md:p-8">
              <h2 className="font-display text-lg text-white">Checkout without an account</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Place an order from the catalog and complete payment using the instructions on the confirmation page.
                Your order number starts with <span className="font-mono text-lab-primary">PPL-</span>—quote it when
                contacting support.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={catalogHref('/products')} size="md">
                  Browse catalog
                </Button>
                <Button href={catalogHref('/cart')} variant="secondary" size="md">
                  View cart
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-lab-mint/30 bg-lab-mint/10 p-6">
              <p className="font-mono text-[10px] uppercase tracking-wider text-lab-mint">Session active</p>
              <p className="mt-2 text-sm text-slate-300">{email}</p>
            </div>
          )}

          <h2 className="mt-12 font-display text-xl text-white">Planned account features</h2>
          <ul className="mt-6 space-y-4">
            {ACCOUNT_FEATURES.map((feature) => (
              <li
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-lab-elevated/40 p-5"
              >
                <h3 className="font-display text-sm text-lab-primary">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{feature.body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-12 rounded-2xl border border-white/10 bg-lab-surface/50 p-6">
            <h2 className="font-display text-lg text-white">Need help with an order?</h2>
            <p className="mt-2 text-sm text-slate-400">
              Email{' '}
              <a href={`mailto:${SITE_EMAIL}`} className="text-lab-primary hover:text-white">
                {SITE_LINKS.email}
              </a>{' '}
              with your PPL- order number. For shipping windows and documentation standards, see the FAQ.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={`mailto:${SITE_EMAIL}`} variant="secondary" size="md">
                Email support
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
