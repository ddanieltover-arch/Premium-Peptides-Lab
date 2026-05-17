'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { NavIcon } from '@/components/layout/NavIcon';
import { MOBILE_BOTTOM_NAV } from '@/lib/data/navigation';

type Props = {
  cartCount: number;
  onSearchTap?: () => void;
};

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileBottomNav({ cartCount, onSearchTap }: Props) {
  const pathname = usePathname();

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex items-stretch justify-between border-t border-white/10 bg-lab-base/92 px-1 py-1.5 text-[10px] text-slate-400 backdrop-blur-xl lg:hidden"
        aria-label="Primary mobile"
      >
        {MOBILE_BOTTOM_NAV.map((item) => {
          const active =
            'href' in item && item.href ? isActive(pathname, item.href) : false;

          if ('action' in item && item.action === 'search') {
            return (
              <motion.button
                key={item.id}
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={onSearchTap}
                className="relative flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-slate-400 hover:text-white"
                aria-label="Open search"
              >
                <NavIcon name="search" className="h-5 w-5" />
                {item.label}
              </motion.button>
            );
          }

          const href = 'href' in item ? item.href : '/';
          const badge = item.icon === 'cart' ? cartCount : 0;

          return (
            <Link
              key={item.id}
              href={href}
              className={`relative flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 transition ${
                active ? 'text-lab-primary' : 'text-slate-400 hover:text-white'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <motion.span whileTap={{ scale: 0.92 }} className="flex flex-col items-center gap-0.5">
                <NavIcon name={item.icon} className="h-5 w-5" />
                {item.label}
              </motion.span>
              {badge > 0 ? (
                <span className="absolute right-2 top-0 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-lab-energy px-1 text-[9px] font-bold text-lab-base">
                  {badge > 9 ? '9+' : badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
      <motion.div className="h-[3.75rem] lg:hidden" aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
    </>
  );
}
