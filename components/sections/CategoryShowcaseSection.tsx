'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { SITE_LINKS } from '@/lib/data/home-content';
import type { CategoryWithCount } from '@/lib/types/catalog';

type CategoryTile = CategoryWithCount & { tone: string };

type Props = { categories: CategoryTile[] };

export function CategoryShowcaseSection({ categories }: Props) {
  const reduce = useReducedMotion();
  const base = SITE_LINKS.catalog;

  return (
    <section className="border-t border-white/5 bg-lab-base py-20">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          className="flex flex-col justify-between gap-4 md:flex-row md:items-end"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-violet">Category lattice</p>
            <h2 className="mt-2 font-display text-3xl text-white md:text-4xl">
              Navigate by <span className="text-spectrum">research vector</span>
            </h2>
          </motion.div>
          <p className="max-w-md text-sm text-slate-400">
            Categories and listing counts from your live catalog.
          </p>
        </motion.div>
        <motion.div
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-8%' }}
          variants={{ visible: { transition: { staggerChildren: reduce ? 0 : 0.06 } } }}
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              variants={{ hidden: { opacity: 0, scale: 0.96 }, visible: { opacity: 1, scale: 1 } }}
              whileHover={reduce ? undefined : { y: -6 }}
            >
              <Link
                href={`${base}/products?category=${cat.slug}`}
                className={`relative block overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${cat.tone} p-[1px] text-left shadow-card`}
              >
                <div className="flex h-full flex-col justify-between rounded-[0.95rem] bg-lab-base/88 p-6 backdrop-blur-xl">
                  <div>
                    <p className="font-display text-xl text-white">{cat.name}</p>
                    <p className="mt-2 font-mono text-xs text-slate-400">{cat.count} active listings</p>
                  </div>
                  <span className="mt-10 inline-flex items-center gap-2 text-sm text-lab-primary">
                    Explore facet →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
