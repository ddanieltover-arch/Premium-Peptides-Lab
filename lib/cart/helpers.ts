import type { CartItem } from '@/lib/cart/store';
import type { FeaturedProduct, ProductDetail, ProductVariant } from '@/lib/types/catalog';

export function featuredToCartItem(product: FeaturedProduct): Omit<CartItem, 'quantity'> {
  return {
    productId: product.id,
    name: product.name,
    slug: product.slug,
    price: product.priceMin,
    compareAt: product.compareAt,
    thumbnailUrl: product.image,
  };
}

export function productToCartItem(
  product: ProductDetail,
  unitPrice: number,
  variant: ProductVariant | null,
): Omit<CartItem, 'quantity'> {
  return {
    productId: product.id,
    name: product.name,
    slug: product.slug,
    price: unitPrice,
    compareAt: product.compareAt,
    thumbnailUrl: product.image,
    variantId: variant?.id,
    variantLabel: variant ? `${variant.name}: ${variant.value}` : undefined,
  };
}
