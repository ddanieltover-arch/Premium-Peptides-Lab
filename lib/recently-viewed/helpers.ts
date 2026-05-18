import type { ProductDetail } from '@/lib/types/catalog';
import type { RecentlyViewedItem } from '@/lib/recently-viewed/store';
import { getVariantPriceBounds } from '@/lib/pricing';

export function productToRecentlyViewedItem(product: ProductDetail): Omit<RecentlyViewedItem, 'viewedAt'> {
  const { min, max } = getVariantPriceBounds(product.price, product.variants);
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: product.image,
    priceMin: min,
    priceMax: max,
    purity: product.purity,
    spec: product.spec,
  };
}
