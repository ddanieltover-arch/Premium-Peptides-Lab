import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { catalogHref } from '@/lib/data/navigation';
import type { PlaceholderRoute } from '@/lib/data/routes';

type Props = PlaceholderRoute;

export function RoutePlaceholder({ eyebrow, title, description, primaryLabel, primaryHref }: Props) {
  const href = primaryHref?.startsWith('mailto:') ? primaryHref : catalogHref(primaryHref ?? '/');

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 md:py-24">
      {eyebrow ? (
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-violet">{eyebrow}</p>
      ) : null}
      <h1 className="mt-3 font-display text-3xl text-white md:text-4xl">{title}</h1>
      <p className="mt-4 text-sm leading-relaxed text-slate-400">{description}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        {primaryHref?.startsWith('mailto:') ? (
          <Button href={href} size="lg">
            {primaryLabel ?? 'Contact'}
          </Button>
        ) : (
          <Button href={href} size="lg">
            {primaryLabel ?? 'Continue'}
          </Button>
        )}
        <Link
          href={catalogHref('/products')}
          className="inline-flex items-center rounded-2xl border border-white/10 px-5 py-3 font-display text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
        >
          Catalog
        </Link>
      </div>
    </main>
  );
}
