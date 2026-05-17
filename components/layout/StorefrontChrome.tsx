'use client';

import { useEffect, useState, type ReactNode } from 'react';
import type { CategoryWithCount, FeaturedProduct } from '@/lib/types/catalog';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { useCartStore } from '@/lib/cart/store';
import { useCartUIStore } from '@/lib/cart/ui-store';

function useHeaderScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

type Props = {
  children: ReactNode;
  categories: CategoryWithCount[];
  highlightProduct?: FeaturedProduct | null;
};

export function StorefrontChrome({ children, categories, highlightProduct = null }: Props) {
  const scrolled = useHeaderScrolled();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartCount = useCartStore((s) => s.count());
  const setCartDrawerOpen = useCartUIStore((s) => s.setCartDrawerOpen);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <div className="relative overflow-x-hidden">
      <ScrollProgress />
      <AnnouncementBar />
      <SiteHeader
        scrolled={scrolled}
        megaOpen={megaOpen}
        setMegaOpen={setMegaOpen}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        cartCount={cartCount}
        onCartClick={() => setCartDrawerOpen(true)}
        onMobileOpen={() => setMobileOpen(true)}
        categories={categories}
        highlightProduct={highlightProduct}
      />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} categories={categories} />
      {children}
      <SiteFooter />
      <MobileBottomNav
        cartCount={cartCount}
        onSearchTap={() => {
          setMobileOpen(false);
          setSearchOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
      <CartDrawer />
    </div>
  );
}
