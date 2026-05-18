'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { formatPriceRange } from '@/lib/pricing';
import type { CategoryWithCount, FeaturedProduct } from '@/lib/types/catalog';
import { SITE_LINKS } from '@/lib/data/home-content';
import { buildCategoryHref, buildProductsHref, catalogHref } from '@/lib/data/navigation';

type Props = {
  scrolled: boolean;
  megaOpen: boolean;
  setMegaOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean | ((s: boolean) => boolean)) => void;
  cartCount: number;
  wishlistCount: number;
  onCartClick: () => void;
  onMobileOpen: () => void;
  categories: CategoryWithCount[];
  highlightProduct: FeaturedProduct | null;
};

export function SiteHeader({
  scrolled,
  megaOpen,
  setMegaOpen,
  searchOpen,
  setSearchOpen,
  cartCount,
  wishlistCount,
  onCartClick,
  onMobileOpen,
  categories,
  highlightProduct,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (searchOpen && pathname === '/products') {
      setSearchQuery(searchParams.get('search') ?? '');
    }
  }, [searchOpen, pathname, searchParams]);

  const onSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(buildProductsHref({ search: q }));
    setSearchOpen(false);
  };

  const base = SITE_LINKS.catalog;
  const cols = [
    categories.slice(0, Math.ceil(categories.length / 3)),
    categories.slice(Math.ceil(categories.length / 3), Math.ceil((categories.length * 2) / 3)),
    categories.slice(Math.ceil((categories.length * 2) / 3)),
  ].filter((c) => c.length > 0);

  return (
    <header
      className={`relative transition-colors duration-300 ${
        scrolled ? 'border-b border-white/10 bg-lab-base/90 shadow-card backdrop-blur-xl' : 'bg-lab-base/40 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/10 bg-white shadow-inner">
            <Image src="/brand-logo.png" alt="Premium Peptides Lab" fill className="object-cover" sizes="40px" priority />
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="font-display text-sm font-semibold tracking-tight text-white">Premium Peptides Lab</span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Analytical-grade supply
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <motion.div
            className="relative"
            onHoverStart={() => setMegaOpen(true)}
            onHoverEnd={() => setMegaOpen(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1 font-display text-sm text-slate-200 transition hover:text-white"
              aria-expanded={megaOpen}
            >
              Products
              <motion.span animate={{ rotate: megaOpen ? 180 : 0 }} className="text-xs">
                ▾
              </motion.span>
            </button>
            <AnimatePresence>
              {megaOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-1/2 top-full z-50 mt-3 w-[min(920px,92vw)] -translate-x-1/2"
                >
                  <div className="glass-panel grid gap-0 overflow-hidden rounded-2xl shadow-card md:grid-cols-[1.15fr_0.85fr]">
                    <motion.div
                      className="grid gap-6 bg-gradient-to-br from-lab-elevated/80 to-lab-base/90 p-6 md:grid-cols-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {cols.map((col, ci) => (
                        <div key={ci}>
                          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-lab-primary">
                            Catalog
                          </p>
                          <ul className="space-y-3 text-sm text-slate-300">
                            {col.map((cat) => (
                              <li key={cat.id}>
                                <Link
                                  href={buildCategoryHref(cat.slug)}
                                  className="group flex items-center justify-between rounded-lg px-2 py-1.5 transition hover:bg-white/5"
                                >
                                  <span>{cat.name}</span>
                                  <span className="font-mono text-[10px] text-slate-500 group-hover:text-lab-mint">
                                    {cat.count} SKUs
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </motion.div>
                    <div className="relative border-t border-white/10 bg-lab-base/90 p-6 md:border-l md:border-t-0">
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-lab-energy">Featured construct</p>
                      {highlightProduct ? (
                        <>
                          <p className="mt-3 font-display text-xl text-white">{highlightProduct.name}</p>
                          <p className="mt-2 line-clamp-2 text-sm text-slate-400">{highlightProduct.spec}</p>
                          <p className="mt-2 font-display text-lab-primary tabular-nums">
                            {formatPriceRange(highlightProduct.priceMin, highlightProduct.priceMax, 0)}
                          </p>
                        </>
                      ) : (
                        <p className="mt-3 text-sm text-slate-400">Browse the full analytical catalog.</p>
                      )}
                      <Link
                        href={`${base}/products`}
                        className="mt-6 inline-flex items-center gap-2 font-display text-sm text-lab-primary hover:text-white"
                      >
                        Open catalog →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          {[
            { href: `${base}/research`, label: 'Research' },
            { href: `${base}/coa`, label: 'COA' },
            { href: `${base}/contact`, label: 'Support' },
          ].map((l) => (
            <Link key={l.label} href={l.href} className="font-display text-sm text-slate-300 transition hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>

        <motion.div
          className="flex items-center gap-1 sm:gap-2"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            type="button"
            onClick={() => setSearchOpen((s) => !s)}
            className="hidden rounded-full border border-white/10 bg-white/5 p-2.5 text-slate-200 backdrop-blur-sm transition hover:border-lab-primary/40 hover:text-white lg:inline-flex"
            aria-label="Search"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeWidth={1.8} d="M21 21l-4.35-4.35M10 18a8 8 0 110-16 8 8 0 010 16z" />
            </svg>
          </button>
          <Link
            href={catalogHref('/account')}
            className="hidden items-center rounded-full bg-spectrum px-4 py-2 font-display text-sm font-semibold text-lab-base shadow-glow transition hover:opacity-90 lg:inline-flex"
          >
            Sign up
          </Link>
          <Link
            href={catalogHref('/wishlist')}
            className="relative hidden rounded-full border border-white/10 bg-white/5 p-2.5 text-slate-200 transition hover:border-lab-rose/40 hover:text-lab-rose sm:inline-flex"
            aria-label="Wishlist"
          >
            <span className="text-base leading-none" aria-hidden>
              ♡
            </span>
            {wishlistCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-lab-rose px-1 text-[10px] font-bold text-white">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            ) : null}
          </Link>
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={onCartClick}
            className="relative inline-flex items-center gap-2 rounded-full border border-lab-primary/40 bg-lab-primary/10 px-3 py-2 text-sm font-medium text-lab-primary shadow-glow transition hover:bg-lab-primary/20"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="1.8" d="M6 6h15l-1.5 9h-12zM6 6L5 3H2M9 20a1 1 0 102 0 1 1 0 00-2 0zm8 0a1 1 0 102 0 1 1 0 00-2 0z" />
            </svg>
            <span className="hidden font-display sm:inline">Cart</span>
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-lab-energy px-1 text-[10px] font-bold text-lab-base">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            ) : null}
          </motion.button>
          <button
            type="button"
            className="inline-flex rounded-full border border-white/15 p-2.5 text-white lg:hidden"
            onClick={onMobileOpen}
            aria-label="Open menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth={1.8} d="M4 7h16M4 12h10M4 17h16" />
            </svg>
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5 bg-lab-surface/90 backdrop-blur-xl"
          >
            <form className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3" onSubmit={onSearchSubmit}>
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                name="search"
                placeholder="Search by peptide name, CAS, or catalog ID…"
                className="flex-1 rounded-xl border border-white/10 bg-lab-base/80 px-4 py-2.5 font-mono text-sm text-white outline-none placeholder:text-slate-600 focus:border-lab-primary/50"
              />
              <button
                type="submit"
                className="rounded-xl bg-spectrum px-4 py-2.5 font-display text-sm font-semibold text-lab-base"
              >
                Search
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
