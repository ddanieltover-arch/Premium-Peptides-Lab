import type { CategoryWithCount } from '@/lib/types/catalog';
import { PeptideCalculatorClient } from '@/components/calculator/PeptideCalculatorClient';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';
import { Button } from '@/components/ui/button';
import { catalogHref } from '@/lib/data/navigation';

type Props = { categories: CategoryWithCount[] };

export function PeptideCalculatorPageClient({ categories }: Props) {
  return (
    <StorefrontChrome categories={categories}>
      <main id="main-content">
        <section className="border-b border-white/10 bg-mesh-dark py-14 md:py-20">
          <div className="relative mx-auto max-w-3xl px-4 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-violet">Lab tools</p>
            <h1 className="mt-3 font-display text-3xl text-white md:text-5xl">Peptide calculator</h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 md:text-base">
              Reconstitution and draw-volume planning for lyophilised stocks. For research protocol design only—not
              medical dosing guidance.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <PeptideCalculatorClient />
          <div className="mx-auto mt-10 flex max-w-3xl justify-center">
            <Button href={catalogHref('/products')} variant="secondary" size="lg">
              Browse catalog
            </Button>
          </div>
        </section>
      </main>
    </StorefrontChrome>
  );
}
