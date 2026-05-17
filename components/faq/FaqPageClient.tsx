'use client';

import Link from 'next/link';
import type { CategoryWithCount } from '@/lib/types/catalog';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';
import { Button } from '@/components/ui/button';
import { FAQ_CATEGORIES } from '@/lib/data/faq';
import { SITE_LINKS } from '@/lib/data/home-content';
import { catalogHref } from '@/lib/data/navigation';

type Props = { categories: CategoryWithCount[] };

export function FaqPageClient({ categories }: Props) {
  return (
    <StorefrontChrome categories={categories}>
      <main id="main-content">
        <section className="border-b border-white/10 bg-lab-surface/80 py-14 md:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-violet">Help center</p>
            <h1 className="mt-3 font-display text-3xl text-white md:text-5xl">Frequently asked questions</h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 md:text-base">
              Documentation standards, shipping windows, and research-use policies for institutional buyers.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 md:py-16">
          <div className="grid gap-10 lg:grid-cols-2">
            {FAQ_CATEGORIES.map((category) => (
              <div key={category.id} className="space-y-4">
                <h2 className="font-display text-lg text-lab-primary">{category.title}</h2>
                <ul className="space-y-3">
                  {category.questions.map((faq) => (
                    <li
                      key={faq.q}
                      className="rounded-2xl border border-white/10 bg-lab-elevated/40 p-5 backdrop-blur-sm transition hover:border-white/15"
                    >
                      <h3 className="font-display text-sm text-white">{faq.q}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-400">{faq.a}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/5 bg-mesh-dark py-14">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h2 className="font-display text-2xl text-white">Still need assistance?</h2>
            <p className="mt-3 text-sm text-slate-400">
              Technical support can help with batch-specific COA retrieval, institutional onboarding, and catalog questions.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href={`mailto:${SITE_LINKS.email}`} size="lg">
                Email support
              </Button>
              <Link
                href={catalogHref('/contact')}
                className="inline-flex items-center rounded-2xl border border-white/10 px-5 py-3 font-display text-sm text-slate-300 hover:border-lab-primary/40 hover:text-white"
              >
                Contact page
              </Link>
            </div>
          </div>
        </section>
      </main>
    </StorefrontChrome>
  );
}
