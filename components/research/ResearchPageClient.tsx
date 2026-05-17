import Link from 'next/link';
import type { CategoryWithCount } from '@/lib/types/catalog';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';
import { Button } from '@/components/ui/button';
import { RESEARCH_STATS, RESEARCH_TOPICS } from '@/lib/data/research';
import { catalogHref } from '@/lib/data/navigation';

type Props = { categories: CategoryWithCount[] };

const TAG_STYLES: Record<string, string> = {
  Metabolic: 'border-lab-primary/30 bg-lab-primary/10 text-lab-primary',
  Regenerative: 'border-lab-mint/30 bg-lab-mint/10 text-lab-mint',
  Mitochondrial: 'border-lab-violet/30 bg-lab-violet/10 text-lab-violet',
  Longevity: 'border-lab-energy/30 bg-lab-energy/10 text-lab-energy',
  Analytical: 'border-white/20 bg-white/5 text-slate-300',
};

function tagClass(tag: string) {
  return TAG_STYLES[tag] ?? 'border-white/15 bg-lab-base/60 text-slate-400';
}

export function ResearchPageClient({ categories }: Props) {
  return (
    <StorefrontChrome categories={categories}>
      <main id="main-content">
        <section className="relative overflow-hidden border-b border-white/10 bg-mesh-dark py-16 md:py-22">
          <div className="pointer-events-none absolute inset-0 bg-spectrum-radial opacity-50" />
          <div className="relative mx-auto max-w-7xl px-4">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-violet">Evidence briefs</p>
            <h1 className="mt-4 max-w-3xl font-display text-3xl text-white md:text-5xl">
              Research hub
              <span className="mt-2 block text-spectrum">Literature orientation</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
              Citation-minded summaries for qualified professionals who need fast orientation—not consumer blogs. Each
              brief is written for research-use context only.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={catalogHref('/products')} size="lg">
                Browse catalog
              </Button>
              <Link
                href={catalogHref('/coa')}
                className="inline-flex items-center rounded-2xl border border-white/15 px-5 py-3 font-display text-sm text-slate-200 hover:border-lab-primary/40 hover:text-white"
              >
                COA library
              </Link>
            </div>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {RESEARCH_STATS.map((stat) => (
                <li
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-lab-elevated/40 px-5 py-4 text-center backdrop-blur-sm"
                >
                  <p className="font-display text-2xl text-spectrum">{stat.value}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">{stat.label}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 md:py-16">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl text-white">How to use this library</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              These briefs are not medical advice. They accelerate literature navigation for qualified researchers
              building institutional protocols. Cross-check claims against primary papers and your compliance office.
            </p>
          </div>

          <h2 className="mt-12 font-display text-xl text-white">Featured briefs</h2>
          <ul className="mt-6 space-y-4">
            {RESEARCH_TOPICS.map((topic) => (
              <li
                key={topic.title}
                className="rounded-2xl border border-white/10 bg-lab-surface/60 p-5 transition hover:border-white/15 md:p-6"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${tagClass(topic.tag)}`}
                  >
                    {topic.tag}
                  </span>
                  <span className="font-mono text-[10px] text-slate-600">{topic.readMinutes} min read</span>
                </div>
                <h3 className="mt-3 font-display text-lg text-white">{topic.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{topic.blurb}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-white/5 bg-lab-surface py-14">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h2 className="font-display text-2xl text-white">Pair briefs with qualified materials</h2>
            <p className="mt-3 text-sm text-slate-400">
              Every catalogue SKU includes HPLC release documentation. Use the COA library to verify batch identity before
              designing assays.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href={catalogHref('/coa')} size="lg">
                View COA records
              </Button>
              <Link
                href={catalogHref('/peptide-calculator')}
                className="inline-flex items-center rounded-2xl border border-white/10 px-5 py-3 font-display text-sm text-slate-300 hover:border-lab-primary/40 hover:text-white"
              >
                Peptide calculator
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16">
          <div className="rounded-2xl border border-lab-energy/25 bg-lab-energy/5 p-6 md:p-8">
            <h2 className="font-display text-lg text-lab-energy">Research-use notice</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Content on this page is provided for laboratory and educational reference only. Nothing here constitutes
              medical guidance, diagnostic advice, or claims of clinical efficacy.
            </p>
          </div>
        </section>
      </main>
    </StorefrontChrome>
  );
}
