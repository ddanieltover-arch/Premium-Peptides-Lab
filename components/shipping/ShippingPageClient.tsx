import Link from 'next/link';
import type { CategoryWithCount } from '@/lib/types/catalog';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';
import { Button } from '@/components/ui/button';
import { SHIPPING_HIGHLIGHTS, SHIPPING_SECTIONS } from '@/lib/data/shipping';
import { catalogHref } from '@/lib/data/navigation';

type Props = { categories: CategoryWithCount[] };

export function ShippingPageClient({ categories }: Props) {
  return (
    <StorefrontChrome categories={categories}>
      <main id="main-content">
        <section className="relative overflow-hidden border-b border-white/10 bg-mesh-dark py-14 md:py-20">
          <div className="pointer-events-none absolute inset-0 bg-spectrum-radial opacity-50" />
          <div className="relative mx-auto max-w-3xl px-4 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-violet">Logistics</p>
            <h1 className="mt-3 font-display text-3xl text-white md:text-5xl">Shipping information</h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 md:text-base">
              How orders are processed, dispatched, and delivered to institutional receiving points.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SHIPPING_HIGHLIGHTS.map((item) => (
              <li
                key={item.label}
                className="rounded-2xl border border-white/10 bg-lab-elevated/40 px-4 py-5 text-center"
              >
                <p className="font-display text-xl text-spectrum">{item.value}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">{item.label}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10 space-y-4">
            {SHIPPING_SECTIONS.map((section) => (
              <article
                key={section.id}
                className="rounded-2xl border border-white/10 bg-lab-surface/50 p-5 md:p-6"
              >
                <h2 className="font-display text-lg text-white">{section.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{section.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Button href={catalogHref('/products')} size="lg">
              Browse catalog
            </Button>
            <Link
              href={catalogHref('/faq')}
              className="inline-flex items-center rounded-2xl border border-white/10 px-5 py-3 font-display text-sm text-slate-300 hover:border-lab-primary/40 hover:text-white"
            >
              FAQ
            </Link>
            <Link
              href={catalogHref('/contact')}
              className="inline-flex items-center rounded-2xl border border-white/10 px-5 py-3 font-display text-sm text-slate-300 hover:border-lab-primary/40 hover:text-white"
            >
              Contact support
            </Link>
          </div>

          <div className="mt-10 rounded-2xl border border-lab-energy/25 bg-lab-energy/5 p-6">
            <h2 className="font-display text-sm text-lab-energy">Research-use materials</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Peptides require appropriate storage on receipt. Premium Peptides Lab ships research-use-only (RUO)
              compounds; buyers are responsible for institutional handling and regulatory compliance.
            </p>
          </div>
        </section>
      </main>
    </StorefrontChrome>
  );
}
