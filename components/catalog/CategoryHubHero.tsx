'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { CategoryHubContent } from '@/lib/data/category-hubs';
import { buildCategoryHref, buildProductsHref, catalogHref } from '@/lib/data/navigation';

type Props = {
  hub: CategoryHubContent;
  slug: string;
  productCount: number;
};

export function CategoryHubHero({ hub, slug, productCount }: Props) {
  return (
    <motion.section
      className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-lab-surface/80 to-lab-base"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <motion.div
        className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-lab-primary/10 blur-3xl"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        <nav className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">
          <Link href={catalogHref('/')} className="hover:text-lab-primary">
            Home
          </Link>
          <span aria-hidden>/</span>
          <Link href={buildProductsHref()} className="hover:text-lab-primary">
            Catalog
          </Link>
          <span aria-hidden>/</span>
          <span className="text-slate-300">{hub.title}</span>
        </nav>

        <p className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-lab-primary">{hub.eyebrow}</p>
        <h1 className="mt-2 max-w-3xl font-display text-3xl text-white md:text-4xl lg:text-5xl">{hub.title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">{hub.description}</p>

        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:max-w-xl">
          {hub.highlights.map((item) => (
            <motion.div
              key={item.label}
              className="rounded-xl border border-white/10 bg-lab-base/60 px-4 py-3"
            >
              <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{item.label}</dt>
              <dd className="mt-1 font-display text-lg text-white">{item.value}</dd>
            </motion.div>
          ))}
          <motion.div className="rounded-xl border border-lab-primary/30 bg-lab-primary/10 px-4 py-3">
            <dt className="font-mono text-[10px] uppercase tracking-wider text-lab-primary/80">Active SKUs</dt>
            <dd className="mt-1 font-display text-lg text-lab-primary">{productCount}</dd>
          </motion.div>
        </dl>

        <motion.div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={buildCategoryHref(slug)}
            className="rounded-xl border border-lab-primary/50 bg-lab-primary/20 px-5 py-2.5 font-mono text-[10px] uppercase tracking-wider text-lab-primary hover:bg-lab-primary/30"
          >
            Browse listings
          </Link>
          <Link
            href={catalogHref('/coa')}
            className="rounded-xl border border-white/10 px-5 py-2.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 hover:border-lab-primary/40 hover:text-white"
          >
            COA library
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
