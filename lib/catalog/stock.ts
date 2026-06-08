const LOW_STOCK_THRESHOLD = 5;

export type StockDisplay = {
  total: number;
  inStock: boolean;
  lowStock: boolean;
  label: string | null;
};

export function isProductInStock(
  baseStock: number | null | undefined,
  variants?: { stock?: number | null }[] | null,
): boolean {
  return resolveProductStock(baseStock, variants).inStock;
}

export function resolveProductStock(
  baseStock: number | null | undefined,
  variants?: { stock?: number | null }[] | null,
): StockDisplay {
  const hasVariants = (variants?.length ?? 0) > 0;
  const total = hasVariants
    ? (variants ?? []).reduce((sum, v) => sum + Math.max(0, Number(v.stock) || 0), 0)
    : Math.max(0, Number(baseStock) || 0);

  if (total <= 0) {
    return { total: 0, inStock: true, lowStock: false, label: null };
  }
  if (total <= LOW_STOCK_THRESHOLD) {
    return {
      total,
      inStock: true,
      lowStock: true,
      label: total === 1 ? 'Only 1 left' : `Only ${total} left`,
    };
  }
  return { total, inStock: true, lowStock: false, label: null };
}
