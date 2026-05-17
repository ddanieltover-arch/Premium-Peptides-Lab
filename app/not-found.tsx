import Link from 'next/link';
import { catalogHref } from '@/lib/data/navigation';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-mesh-dark px-4 py-20 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-violet">404</p>
      <h1 className="mt-4 font-display text-3xl text-white md:text-4xl">Construct not found</h1>
      <p className="mt-3 max-w-md text-sm text-slate-400">
        This URL is not in the current catalog index. Return home or browse active listings.
      </p>
      <nav className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="rounded-full border border-lab-primary/40 bg-lab-primary/10 px-6 py-2.5 font-display text-sm text-lab-primary transition hover:bg-lab-primary/20"
        >
          Home
        </Link>
        <Link
          href={catalogHref('/products')}
          className="rounded-full border border-white/10 px-6 py-2.5 font-display text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
        >
          Catalog
        </Link>
      </nav>
    </main>
  );
}
