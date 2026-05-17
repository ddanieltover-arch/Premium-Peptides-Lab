'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import type { CategoryWithCount } from '@/lib/types/catalog';
import { catalogHref, MAIN_NAV_LINKS, splitCategoriesIntoColumns } from '@/lib/data/navigation';

type Props = {
  open: boolean;
  onClose: () => void;
  categories: CategoryWithCount[];
};

export function MobileMenu({ open, onClose, categories }: Props) {
  const reduce = useReducedMotion();
  const [productsOpen, setProductsOpen] = useState(true);
  const columns = splitCategoriesIntoColumns(categories, 3);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col bg-lab-base/95 backdrop-blur-2xl lg:hidden"
          initial={{ opacity: 0, x: '12%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '8%' }}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
            <span className="font-display text-lg">Menu</span>
            <button type="button" onClick={onClose} aria-label="Close menu" className="rounded-lg p-1 hover:bg-white/5">
              <span className="text-2xl leading-none">×</span>
            </button>
          </div>

          <motion.div
            className="flex-1 overflow-y-auto px-4 py-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <motion.div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-4 font-display text-lg text-white"
                onClick={() => setProductsOpen((o) => !o)}
                aria-expanded={productsOpen}
              >
                <span>Products</span>
                <motion.span
                  animate={{ rotate: productsOpen ? 180 : 0 }}
                  transition={{ duration: reduce ? 0 : 0.2 }}
                  className="text-sm text-slate-400"
                  aria-hidden
                >
                  ▾
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {productsOpen && (
                  <motion.div
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={reduce ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden border-t border-white/10"
                  >
                    <div className="space-y-4 px-4 py-3">
                      <Link
                        href={catalogHref('/products')}
                        className="block rounded-lg bg-lab-primary/10 px-3 py-2.5 font-display text-sm text-lab-primary"
                        onClick={onClose}
                      >
                        Shop all products →
                      </Link>
                      {columns.map((col, ci) => (
                        <motion.div
                          key={ci}
                          initial={reduce ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: ci * 0.04 }}
                        >
                          <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                            Catalog {columns.length > 1 ? ci + 1 : ''}
                          </p>
                          <ul className="space-y-1">
                            {col.map((cat) => (
                              <li key={cat.id}>
                                <Link
                                  href={catalogHref(`/products?category=${cat.slug}`)}
                                  className="flex items-center justify-between rounded-lg px-2 py-2.5 text-sm text-slate-200 hover:bg-white/5"
                                  onClick={onClose}
                                >
                                  <span>{cat.name}</span>
                                  <span className="font-mono text-[10px] text-slate-500">{cat.count}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="mt-4 space-y-1">
              {MAIN_NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block rounded-xl border border-transparent px-3 py-3.5 font-display text-lg text-slate-100 hover:border-white/10 hover:bg-white/5"
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={catalogHref('/faq')}
                className="block rounded-xl border border-transparent px-3 py-3.5 font-display text-lg text-slate-100 hover:border-white/10 hover:bg-white/5"
                onClick={onClose}
              >
                FAQ
              </Link>
            </div>
          </motion.div>

          <div className="border-t border-white/10 p-4 text-center text-xs text-slate-500">
            For research purposes only · Not for human consumption
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
