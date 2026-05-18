/** Parse catalog min/max price from URL search params. */
export function parseCatalogPriceParam(raw?: string | null): number | undefined {
  if (raw == null || raw === '') return undefined;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return undefined;
  return Math.round(n * 100) / 100;
}

export function normalizePriceRange(
  min?: number,
  max?: number,
): { minPrice?: number; maxPrice?: number } {
  if (min == null && max == null) return {};
  let lo = min;
  let hi = max;
  if (lo != null && hi != null && lo > hi) {
    [lo, hi] = [hi, lo];
  }
  return {
    minPrice: lo,
    maxPrice: hi,
  };
}
