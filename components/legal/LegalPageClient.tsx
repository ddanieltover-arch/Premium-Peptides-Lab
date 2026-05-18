import Link from 'next/link';
import type { CategoryWithCount } from '@/lib/types/catalog';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';
import { Button } from '@/components/ui/button';
import { LEGAL_FOOTER_LINKS, LEGAL_PAGES, type LegalPageKey } from '@/lib/data/legal';
import { catalogHref } from '@/lib/data/navigation';
import { cn } from '@/lib/cn';

type Props = {
  pageKey: LegalPageKey;
  categories: CategoryWithCount[];
};

export function LegalPageClient({ pageKey, categories }: Props) {
  const page = LEGAL_PAGES[pageKey];
  const otherLinks = LEGAL_FOOTER_LINKS.filter((l) => !l.href.includes(pageKey));

  return (
    <StorefrontChrome categories={categories}>
      <main id="main-content">
        <section className="relative overflow-hidden border-b border-white/10 bg-mesh-dark py-14 md:py-20">
          <div className="pointer-events-none absolute inset-0 bg-spectrum-radial opacity-50" />
          <div className="relative mx-auto max-w-3xl px-4 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-violet">{page.eyebrow}</p>
            <h1 className="mt-3 font-display text-3xl text-white md:text-5xl">{page.title}</h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 md:text-base">{page.description}</p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-slate-600">
              Last updated {page.lastUpdated}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
          <nav className="mb-8 flex flex-wrap justify-center gap-2" aria-label="Other legal policies">
            {otherLinks.map((link) => (
              <Link
                key={link.href}
                href={catalogHref(link.href)}
                className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 transition hover:border-lab-primary/40 hover:text-lab-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="space-y-4">
            {page.sections.map((section) => (
              <article
                key={section.id}
                className={cn(
                  'rounded-2xl border p-5 md:p-6',
                  section.emphasis
                    ? 'border-lab-rose/30 bg-lab-rose/5'
                    : 'border-white/10 bg-lab-surface/50',
                )}
              >
                <h2
                  className={cn(
                    'font-display text-lg',
                    section.emphasis ? 'text-lab-rose' : 'text-white',
                  )}
                >
                  {section.title}
                </h2>
                <p
                  className={cn(
                    'mt-2 text-sm leading-relaxed',
                    section.emphasis ? 'text-slate-300' : 'text-slate-400',
                  )}
                >
                  {section.body}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Button href={catalogHref('/contact')} variant="secondary" size="lg">
              Contact support
            </Button>
            <Link
              href={catalogHref('/faq')}
              className="inline-flex items-center rounded-2xl border border-white/10 px-5 py-3 font-display text-sm text-slate-300 hover:border-lab-primary/40 hover:text-white"
            >
              FAQ
            </Link>
          </div>

          <div className="mt-10 rounded-2xl border border-lab-energy/25 bg-lab-energy/5 p-6">
            <h2 className="font-display text-sm text-lab-energy">Research-use only</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Premium Peptides Lab supplies analytical-grade peptides for laboratory research. Buyers are responsible
              for institutional approval, safe handling, and regulatory compliance in their jurisdiction.
            </p>
          </div>
        </section>
      </main>
    </StorefrontChrome>
  );
}
