import Link from 'next/link';
import type { CategoryWithCount } from '@/lib/types/catalog';
import type { CoaEntry } from '@/lib/types/coa';
import { CoaTableClient } from '@/components/coa/CoaTableClient';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';
import { Button } from '@/components/ui/button';
import { SITE_LINKS } from '@/lib/data/home-content';
import { catalogHref } from '@/lib/data/navigation';

type Props = {
  categories: CategoryWithCount[];
  entries: CoaEntry[];
};

const PROTOCOL_STEPS = [
  {
    title: '1) Batch sampling',
    desc: 'Representative aliquots are taken from production lots under documented handling procedures.',
  },
  {
    title: '2) Orthogonal testing',
    desc: 'Independent laboratories perform HPLC purity quantification and LC–MS identity confirmation.',
  },
  {
    title: '3) COA release',
    desc: 'Results are recorded with batch identifiers and linked to catalog SKUs for verification requests.',
  },
] as const;

export function CoaPageClient({ categories, entries }: Props) {
  return (
    <StorefrontChrome categories={categories}>
      <main id="main-content">
        <section className="relative overflow-hidden border-b border-white/10 bg-mesh-dark py-16 md:py-22">
          <div className="pointer-events-none absolute inset-0 bg-spectrum-radial opacity-60" />
          <div className="relative mx-auto max-w-7xl px-4">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-energy">Quality dossier</p>
            <h1 className="mt-4 max-w-3xl font-display text-3xl text-white md:text-5xl">
              COA library
              <span className="mt-2 block text-spectrum">Batch-level verification</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
              Product-level certificates and verification metadata for active catalog SKUs. Every listed record
              includes testing method references and release purity outcomes for research transparency.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={catalogHref('/products')} size="lg">
                Browse catalog
              </Button>
              <Link
                href="#coa-table"
                className="inline-flex items-center rounded-2xl border border-white/15 px-5 py-3 font-display text-sm text-slate-200 hover:border-lab-primary/40 hover:text-white"
              >
                Jump to records
              </Link>
            </div>
          </div>
        </section>

        <section id="coa-table" className="mx-auto max-w-7xl px-4 py-14 md:py-16">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl text-white md:text-3xl">Current COA records</h2>
              <p className="mt-2 text-sm text-slate-500">
                {entries.length} active listing{entries.length === 1 ? '' : 's'} · updated from live catalog
              </p>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-lab-primary">HPLC release</span>
          </div>

          <CoaTableClient entries={entries} />

          <p className="mt-4 text-xs text-slate-500">
            Need a specific certificate file? Contact{' '}
            <a href={`mailto:${SITE_LINKS.email}`} className="text-lab-primary hover:text-white">
              {SITE_LINKS.email}
            </a>{' '}
            with the product name and batch ID.
          </p>
        </section>

        <section className="border-t border-white/5 bg-lab-surface py-14 md:py-16">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-2xl text-white">Analytical standard</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                Premium Peptides Lab partners with accredited laboratories for release testing. HPLC defines purity;
                orthogonal LC–MS confirms identity on qualified materials.
              </p>
              <ul className="mt-8 space-y-4">
                {PROTOCOL_STEPS.map((step) => (
                  <li
                    key={step.title}
                    className="rounded-2xl border border-white/10 bg-lab-base/60 p-5"
                  >
                    <h3 className="font-mono text-[10px] uppercase tracking-wider text-lab-primary">{step.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{step.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-lab-primary/20 via-lab-base to-lab-violet/20 p-10 text-center shadow-glow">
              <p className="font-display text-5xl text-spectrum">≥99%</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                Target release purity
              </p>
              <p className="mt-6 text-sm text-slate-400">
                Exemplar chromatograms and method parameters are available on request for institutional review packages.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16">
          <div className="rounded-2xl border border-lab-energy/25 bg-lab-energy/5 p-6 md:p-8">
            <h2 className="font-display text-lg text-lab-energy">Research-use notice</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              COA records on this page are provided for laboratory and educational reference only. Nothing here constitutes
              medical guidance, diagnostic advice, or claims of clinical efficacy. Buyers must comply with applicable
              regulations and institutional governance.
            </p>
          </div>
        </section>
      </main>
    </StorefrontChrome>
  );
}
