export type FeaturedProduct = {
  id: string;
  slug: string;
  name: string;
  spec: string;
  purity: number;
  /** Base catalog price (before variant modifiers). */
  price: number;
  /** Lowest variant-inclusive price for display. */
  priceMin: number;
  /** Highest variant-inclusive price for display. */
  priceMax: number;
  compareAt: number | null;
  image: string;
};

export type CategoryWithCount = {
  id: string;
  name: string;
  slug: string;
  count: number;
};

export type ProductVariant = {
  id: string;
  name: string;
  value: string;
  priceModifier: number;
  stock: number;
  sku?: string;
};

export type ProductImage = {
  id: string;
  url: string;
  altText?: string;
  sortOrder: number;
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
};

export type ProductDetail = {
  id: string;
  slug: string;
  name: string;
  spec: string;
  description: string;
  purity: number;
  price: number;
  compareAt: number | null;
  image: string;
  stock: number;
  category: ProductCategory | null;
  variants: ProductVariant[];
  images: ProductImage[];
  molecularFormula?: string;
  molecularWeight?: string;
  casNumber?: string;
  sequence?: string;
  coaUrl?: string;
};
