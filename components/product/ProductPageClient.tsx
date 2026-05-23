'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PageEnter } from '@/components/shared/PageEnter';
import type { CategoryWithCount, FeaturedProduct, ProductDetail, ProductVariant } from '@/lib/types/catalog';
import { featuredToCartItem, productToCartItem } from '@/lib/cart/helpers';
import { useAddToCart } from '@/lib/cart/use-add-to-cart';
import { getVariantPriceBounds } from '@/lib/pricing';
import { productToWishlistItem } from '@/lib/wishlist/helpers';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';
import { ProductDetailAccordions } from '@/components/product/ProductDetailAccordions';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductPurchaseModule } from '@/components/product/ProductPurchaseModule';
import { ProductReviewsSection } from '@/components/product/ProductReviewsSection';
import { RecentlyViewedSection } from '@/components/product/RecentlyViewedSection';
import { RelatedProductsSection } from '@/components/product/RelatedProductsSection';
import { productToRecentlyViewedItem } from '@/lib/recently-viewed/helpers';
import { useRecentlyViewedStore } from '@/lib/recently-viewed/store';
import type { ProductReviewSummary } from '@/lib/types/reviews';
import { catalogHref } from '@/lib/data/navigation';
import { useMotionConfig } from '@/lib/motion';

type Props = {
  product: ProductDetail;
  related: FeaturedProduct[];
  categories: CategoryWithCount[];
  reviewSummary: ProductReviewSummary;
};

export function ProductPageClient({ product, related, categories, reviewSummary }: Props) {
  const trackRecentlyViewed = useRecentlyViewedStore((s) => s.track);

  useEffect(() => {
    trackRecentlyViewed(productToRecentlyViewedItem(product));
  }, [product, trackRecentlyViewed]);
  const { reduce } = useMotionConfig();
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const [coaSectionOpen, setCoaSectionOpen] = useState(false);
  const addToCartAction = useAddToCart();

  useEffect(() => {
    const syncHash = () => setCoaSectionOpen(window.location.hash === '#coa');
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  const priceBounds = useMemo(
    () => getVariantPriceBounds(product.price, product.variants),
    [product.price, product.variants],
  );

  const handleAddToCart = useCallback(
    (qty: number, variant: ProductVariant | null, unitPrice: number) => {
      addToCartAction(productToCartItem(product, unitPrice, variant), { quantity: qty });
    },
    [addToCartAction, product],
  );

  const handleRelatedAdd = useCallback(
    (id: string) => {
      const item = related.find((p) => p.id === id);
      if (!item) return;
      addToCartAction(featuredToCartItem(item));
      setAdded((a) => ({ ...a, [id]: true }));
      window.setTimeout(() => setAdded((a) => ({ ...a, [id]: false })), 900);
    },
    [addToCartAction, related],
  );

  const inStock = product.stock > 0 || product.variants.some((v) => v.stock > 0);
  const highlight: FeaturedProduct = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    spec: product.spec,
    purity: product.purity,
    price: product.price,
    priceMin: priceBounds.min,
    priceMax: priceBounds.max,
    compareAt: product.compareAt,
    image: product.image,
    stock: product.stock,
    ratingAverage: 0,
    ratingCount: 0,
  };

  const purchaseMotion = reduce
    ? { initial: { opacity: 1, x: 0 }, animate: { opacity: 1, x: 0 } }
    : { initial: { opacity: 0, x: 12 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.45 } };

  return (
    <StorefrontChrome categories={categories} highlightProduct={highlight}>
      <PageEnter className="pb-8">
        <div className="mx-auto max-w-7xl px-4 pt-6 md:pt-10">
          <Link
            href={catalogHref('/products')}
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-slate-500 transition hover:text-lab-primary"
          >
            ← Back to catalog
          </Link>
        </div>

        <motion.div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 lg:grid-cols-2 lg:items-start lg:gap-12 lg:py-12">
          <motion.div className="mx-auto w-full max-w-sm lg:max-w-md lg:justify-self-start">
            <ProductGallery
              name={product.name}
              images={product.images}
              coaUrl={product.coaUrl}
              inStock={inStock}
            />
          </motion.div>
          <motion.div {...purchaseMotion}>
            <ProductPurchaseModule
              product={product}
              wishlistItem={productToWishlistItem(product)}
              onAddToCart={handleAddToCart}
            />
          </motion.div>
        </motion.div>

        <div className="mx-auto max-w-3xl px-4 pb-16 lg:max-w-4xl">
          <ProductDetailAccordions product={product} defaultOpenId={coaSectionOpen ? 'coa' : undefined} />
        </div>

        <section className="border-t border-white/5 py-12">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="font-display text-lg text-white">Research citations</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Peer-reviewed literature referencing this compound class is maintained for institutional buyers.
              Request bibliography support through our technical inbox when preparing IBC or core-facility
              submissions.
            </p>
          </div>
        </section>

        <ProductReviewsSection productName={product.name} summary={reviewSummary} />

        <RecentlyViewedSection excludeProductId={product.id} />

        <RelatedProductsSection products={related} added={added} onAddToCart={handleRelatedAdd} />
      </PageEnter>
    </StorefrontChrome>
  );
}
