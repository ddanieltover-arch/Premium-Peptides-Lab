import type { WishlistItem } from '@/lib/wishlist/store';
import type { FeaturedProduct, ProductDetail } from '@/lib/types/catalog';

export function featuredToWishlistItem(product: FeaturedProduct): WishlistItem {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: product.image,
    priceMin: product.priceMin,
    priceMax: product.priceMax,
    purity: product.purity,
    spec: product.spec,
  };
}

export function productToWishlistItem(product: ProductDetail): WishlistItem {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: product.image,
    priceMin: product.price,
    priceMax: product.price,
    purity: product.purity,
    spec: product.spec,
  };
}
