'use client';

import { useCallback, useState } from 'react';
import type { CategoryWithCount, FeaturedProduct } from '@/lib/types/catalog';
import { featuredToCartItem } from '@/lib/cart/helpers';
import { useCartStore } from '@/lib/cart/store';
import { useCartUIStore } from '@/lib/cart/ui-store';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';
import { CategoryShowcaseSection } from '@/components/sections/CategoryShowcaseSection';
import { CtaBannerSection } from '@/components/sections/CtaBannerSection';
import { FeaturedProductsSection } from '@/components/sections/FeaturedProductsSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { PillarsSection } from '@/components/sections/PillarsSection';
import { QualityTrustSection } from '@/components/sections/QualityTrustSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';

export type HomePageProps = {
  featuredProducts: FeaturedProduct[];
  categories: (CategoryWithCount & { tone: string })[];
  productCount: number;
};

export function HomePage({ featuredProducts, categories, productCount }: HomePageProps) {
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const addItem = useCartStore((s) => s.addItem);
  const setCartDrawerOpen = useCartUIStore((s) => s.setCartDrawerOpen);

  const addToCart = useCallback(
    (id: string) => {
      const product = featuredProducts.find((p) => p.id === id);
      if (!product) return;
      addItem(featuredToCartItem(product));
      setCartDrawerOpen(true);
      setAdded((a) => ({ ...a, [id]: true }));
      window.setTimeout(() => setAdded((a) => ({ ...a, [id]: false })), 900);
    },
    [addItem, featuredProducts, setCartDrawerOpen],
  );

  const navCategories = categories.map(({ id, name, slug, count }) => ({ id, name, slug, count }));

  return (
    <StorefrontChrome categories={navCategories} highlightProduct={featuredProducts[0] ?? null}>
      <main>
        <HeroSection />
        <FeaturedProductsSection products={featuredProducts} added={added} onAddToCart={addToCart} />
        <PillarsSection />
        <CategoryShowcaseSection categories={categories} />
        <QualityTrustSection productCount={productCount} />
        <TestimonialsSection />
        <CtaBannerSection />
      </main>
    </StorefrontChrome>
  );
}
