import Link from 'next/link';
import Image from 'next/image';
import type { CategoryWithCount } from '@/lib/types/catalog';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';
import { Button } from '@/components/ui/button';
import { ABOUT_PILLARS, ABOUT_STATS, ABOUT_VALUES } from '@/lib/data/about';
import { catalogHref } from '@/lib/data/navigation';

type Props = { categories: CategoryWithCount[] };

export function AboutPageClient({ categories }: Props) {
  return (
    <StorefrontChrome categories={categories}>
      <main id="main-content">
        <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden border-b border-white/10">
          <Image src="/brand-logo.png" alt="" fill className="object-cover opacity-25" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-lab-base/60 via-lab-base/85 to-lab-base" />
          <div className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-primary">Company</p>
            <h1 className="mt-4 font-display text-3xl text-white md:text-5xl">
              Built on purity.
              <span className="mt-2 block text-spectrum">Driven by science.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
              Premium Peptides Lab supplies analytical-grade peptide standards with documented release criteria,
              third-party verification, and batch traceability for qualified research programs.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 md:py-16">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_STATS.map((stat) => (
              <li
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-lab-elevated/40 px-5 py-4 text-center"
              >
                <p className="font-display text-2xl text-spectrum">{stat.value}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">{stat.label}</p>
              </li>
            ))}
          </ul>

          <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="font-display text-2xl text-white">Our mission</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                Consistent research outcomes depend on materials that meet defensible release standards. We connect
                manufacturing discipline with institutional buyers who need COA-backed lots, not ambiguous catalogue
                claims.
              </p>
              <ul className="mt-8 space-y-4">
                {ABOUT_VALUES.map((value) => (
                  <li key={value.title} className="rounded-2xl border border-white/10 bg-lab-surface/50 p-5">
                    <h3 className="font-display text-sm text-lab-primary">{value.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{value.body}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10">
              <Image src="/brand-logo.png" alt="Premium Peptides Lab" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-lab-base via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-lab-base/80 p-5 backdrop-blur-sm">
                <p className="font-mono text-[10px] uppercase tracking-wider text-lab-mint">Quality dossier</p>
                <p className="mt-2 font-display text-lg text-white">HPLC release on qualified SKUs</p>
                <p className="mt-1 text-xs text-slate-500">Orthogonal identity where applicable</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 bg-lab-surface py-14 md:py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-center font-display text-2xl text-white">What we stand for</h2>
            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {ABOUT_PILLARS.map((pillar) => (
                <li
                  key={pillar.title}
                  className="rounded-2xl border border-white/10 bg-lab-base/60 p-6"
                >
                  <p className="font-display text-2xl text-lab-primary">{pillar.stat}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">{pillar.statLabel}</p>
                  <h3 className="mt-4 font-display text-sm text-white">{pillar.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{pillar.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-2xl px-4 py-14 text-center">
          <h2 className="font-display text-2xl text-white">Explore the catalog</h2>
          <p className="mt-3 text-sm text-slate-400">
            Browse active SKUs with batch documentation, or review our COA library before placing an institutional order.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={catalogHref('/products')} size="lg">
              Analytical catalog
            </Button>
            <Link
              href={catalogHref('/coa')}
              className="inline-flex items-center rounded-2xl border border-white/15 px-5 py-3 font-display text-sm text-slate-200 hover:border-lab-primary/40 hover:text-white"
            >
              COA library
            </Link>
            <Link
              href={catalogHref('/contact')}
              className="inline-flex items-center rounded-2xl border border-white/15 px-5 py-3 font-display text-sm text-slate-200 hover:border-lab-primary/40 hover:text-white"
            >
              Partner with us
            </Link>
          </div>
        </section>
      </main>
    </StorefrontChrome>
  );
}
