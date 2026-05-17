import type { ProductVariant } from '@/lib/types/catalog';

/** Per-variant total: base + modifier (matches PDP). */
export function variantTotalPrice(basePrice: number, variant: ProductVariant): number {
  return Number(basePrice) + Number(variant.priceModifier);
}

export function getVariantPriceBounds(
  basePrice: number,
  variants: ProductVariant[] | undefined,
): { min: number; max: number } {
  const base = Number(basePrice) || 0;
  const list = variants ?? [];
  if (list.length === 0) {
    return { min: base, max: base };
  }
  const totals = list.map((v) => variantTotalPrice(base, v));
  return { min: Math.min(...totals), max: Math.max(...totals) };
}

/** Catalog list row: `base_price`, nested `variants[].price_modifier`. */
export function getVariantPriceBoundsFromRow(row: {
  base_price?: unknown;
  variants?: Array<{ price_modifier?: unknown }> | null;
}): { min: number; max: number } {
  const base = Number(row.base_price ?? 0);
  const variants = row.variants ?? [];
  if (variants.length === 0) {
    return { min: base, max: base };
  }
  const totals = variants.map((v) => base + Number(v.price_modifier ?? 0));
  return { min: Math.min(...totals), max: Math.max(...totals) };
}

export function formatPriceRange(min: number, max: number, fractionDigits = 2): string {
  const fmt = (n: number) => n.toFixed(fractionDigits);
  if (Number.isNaN(min) || Number.isNaN(max)) return '—';
  if (Math.abs(max - min) < 0.005) {
    return `$${fmt(min)}`;
  }
  return `$${fmt(min)} – $${fmt(max)}`;
}
