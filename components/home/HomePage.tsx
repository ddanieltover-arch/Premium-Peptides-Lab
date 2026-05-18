'use client';

import { useCallback, useState } from 'react';
import type { CategoryWithCount, FeaturedProduct } from '@/lib/types/catalog';
import { featuredToCartItem } from '@/lib/cart/helpers';
import { useAddToCart } from '@/lib/cart/use-add-to-cart';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';
import { CategoryShowcaseSection } from '@/components/sections/CategoryShowcaseSection';
import { CtaBannerSection } from '@/components/sections/CtaBannerSection';
import { FeaturedProductsSection } from '@/components/sections/FeaturedProductsSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { PillarsSection } from '@/components/sections/PillarsSection';
import { QualityTrustSection } from '@/components/sections/QualityTrustSection';
import { RecentlyViewedSection } from '@/components/product/RecentlyViewedSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';

export type HomePageProps = {
  featuredProducts: FeaturedProduct[];
  categories: (CategoryWithCount & { tone: string })[];
  productCount: number;
};

export function HomePage({ featuredProducts, categories, productCount }: HomePageProps) {
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const addToCartAction = useAddToCart();

  const addToCart = useCallback(
    (id: string) => {
      const product = featuredProducts.find((p) => p.id === id);
      if (!product) return;
      addToCartAction(featuredToCartItem(product));
      setAdded((a) => ({ ...a, [id]: true }));
      window.setTimeout(() => setAdded((a) => ({ ...a, [id]: false })), 900);
    },
    [addToCartAction, featuredProducts],
  );

  const navCategories = categories.map(({ id, name, slug, count }) => ({ id, name, slug, count }));

  return (
    <StorefrontChrome categories={navCategories} highlightProduct={featuredProducts[0] ?? null}>
      <main>
        <HeroSection />
        <FeaturedProductsSection products={featuredProducts} added={added} onAddToCart={addToCart} />
        <RecentlyViewedSection />
        <PillarsSection />
        <CategoryShowcaseSection categories={categories} />
        <QualityTrustSection productCount={productCount} />
        <TestimonialsSection />
        <CtaBannerSection />
      </main>
    </StorefrontChrome>
  );
}
