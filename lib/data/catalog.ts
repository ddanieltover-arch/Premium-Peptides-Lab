import { createClient } from '@/lib/supabase/server';
import type { CatalogSort } from '@/lib/data/navigation';
import { CATALOG_SORT_OPTIONS } from '@/lib/data/navigation';
import { getVariantPriceBoundsFromRow } from '@/lib/pricing';
import type {
  CategoryWithCount,
  FeaturedProduct,
  ProductCategory,
  ProductDetail,
  ProductImage,
  ProductVariant,
} from '@/lib/types/catalog';

const PLACEHOLDER_IMAGE = '/brand-logo.png';
const DEFAULT_PURITY = 99.0;

const SHOWCASE_TONES = [
  'from-lab-primary/40 to-lab-mint/20',
  'from-lab-mint/35 to-lab-primary/20',
  'from-lab-violet/40 to-lab-rose/20',
  'from-lab-rose/35 to-lab-violet/25',
  'from-lab-primary/30 to-lab-violet/30',
  'from-lab-energy/25 to-lab-primary/25',
] as const;

const PRODUCT_LIST_SELECT =
  'id,name,slug,short_desc,description,base_price,compare_price,thumbnail_url,variants(price_modifier)';

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  short_desc: string | null;
  description: string | null;
  base_price: number | string;
  compare_price: number | string | null;
  thumbnail_url: string | null;
  variants?: { price_modifier: number | string | null }[];
};

function mapProduct(row: ProductRow): FeaturedProduct {
  const spec =
    row.short_desc?.trim() ||
    (row.description ? row.description.slice(0, 72) + (row.description.length > 72 ? '…' : '') : 'Research-grade · COA on file');

  const base = Number(row.base_price) || 0;
  const { min, max } = getVariantPriceBoundsFromRow(row);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    spec,
    purity: DEFAULT_PURITY,
    price: base,
    priceMin: min,
    priceMax: max,
    compareAt: row.compare_price != null ? Number(row.compare_price) : null,
    image: row.thumbnail_url?.trim() || PLACEHOLDER_IMAGE,
  };
}

export async function getFeaturedProducts(limit = 4): Promise<FeaturedProduct[]> {
  const supabase = await createClient();

  const { data: featured, error } = await supabase
    .from('products')
    .select(PRODUCT_LIST_SELECT)
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(limit);

  if (error) {
    console.error('[catalog] featured:', error.message);
    return [];
  }

  const rows: ProductRow[] = [...(featured ?? [])];
  const seen = new Set(rows.map((r) => r.id));

  if (rows.length < limit) {
    const { data: backfill } = await supabase
      .from('products')
      .select(PRODUCT_LIST_SELECT)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit * 2);

    for (const row of backfill ?? []) {
      if (rows.length >= limit) break;
      if (!seen.has(row.id)) {
        seen.add(row.id);
        rows.push(row);
      }
    }
  }

  return rows.slice(0, limit).map(mapProduct);
}

export async function getCategoryShowcase(limit = 6): Promise<(CategoryWithCount & { tone: string })[]> {
  const supabase = await createClient();

  const [{ data: categories, error: catErr }, { data: products, error: prodErr }] = await Promise.all([
    supabase.from('categories').select('id,name,slug,sort_order').order('sort_order', { ascending: true }).limit(limit),
    supabase.from('products').select('category_id').eq('is_active', true),
  ]);

  if (catErr) console.error('[catalog] categories:', catErr.message);
  if (prodErr) console.error('[catalog] product counts:', prodErr.message);

  const counts = new Map<string, number>();
  for (const p of products ?? []) {
    if (p.category_id) counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
  }

  return (categories ?? []).map((cat, i) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    count: counts.get(cat.id) ?? 0,
    tone: SHOWCASE_TONES[i % SHOWCASE_TONES.length],
  }));
}

export async function getActiveProductCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  if (error) {
    console.error('[catalog] count:', error.message);
    return 0;
  }
  return count ?? 0;
}

const PRODUCT_DETAIL_SELECT = `
  id,name,slug,description,short_desc,category_id,thumbnail_url,base_price,compare_price,source_url,stock,
  molecular_formula,molecular_weight,cas_number,sequence,
  category:categories(id,name,slug),
  images(id,url,alt_text,sort_order),
  variants(id,name,value,price_modifier,stock,sku)
`;

type CategoryJoin = { id: string; name: string; slug: string } | { id: string; name: string; slug: string }[];

function normalizeCategory(category: CategoryJoin | null | undefined): ProductCategory | null {
  if (!category) return null;
  const row = Array.isArray(category) ? category[0] : category;
  if (!row) return null;
  return { id: row.id, name: row.name, slug: row.slug };
}

type DetailRow = Omit<ProductRow, 'variants'> & {
  stock: number | null;
  source_url: string | null;
  molecular_formula: string | null;
  molecular_weight: string | null;
  cas_number: string | null;
  sequence: string | null;
  category?: CategoryJoin | null;
  images?: { id: string; url: string; alt_text: string | null; sort_order: number | null }[];
  variants?: {
    id: string;
    name: string;
    value: string;
    price_modifier: number | string | null;
    stock: number | null;
    sku: string | null;
  }[];
};

function mapProductDetail(row: DetailRow): ProductDetail {
  const base = mapProduct(row);
  const images: ProductImage[] = (row.images ?? [])
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((img) => ({
      id: img.id,
      url: img.url,
      altText: img.alt_text ?? undefined,
      sortOrder: img.sort_order ?? 0,
    }));

  const thumb = row.thumbnail_url?.trim();
  if (thumb && !images.some((i) => i.url === thumb)) {
    images.unshift({
      id: 'thumb',
      url: thumb,
      altText: row.name,
      sortOrder: -1,
    });
  }

  const gallery = images.length > 0 ? images : [{ id: 'placeholder', url: PLACEHOLDER_IMAGE, sortOrder: 0 }];

  return {
    ...base,
    description: row.description?.trim() || row.short_desc?.trim() || '',
    stock: row.stock ?? 0,
    category: normalizeCategory(row.category ?? null),
    variants: (row.variants ?? []).map(
      (v): ProductVariant => ({
        id: v.id,
        name: v.name,
        value: v.value,
        priceModifier: Number(v.price_modifier) || 0,
        stock: v.stock ?? 0,
        sku: v.sku ?? undefined,
      }),
    ),
    images: gallery,
    image: gallery[0]?.url ?? PLACEHOLDER_IMAGE,
    molecularFormula: row.molecular_formula ?? undefined,
    molecularWeight: row.molecular_weight ?? undefined,
    casNumber: row.cas_number ?? undefined,
    sequence: row.sequence ?? undefined,
    coaUrl: row.source_url?.trim() || undefined,
  };
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from('products')
    .select(PRODUCT_DETAIL_SELECT)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error(`[catalog] product "${slug}":`, error.message);
    return null;
  }
  if (!row) return null;
  return mapProductDetail(row as DetailRow);
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string | null,
  limit = 4,
): Promise<FeaturedProduct[]> {
  if (!categoryId) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_LIST_SELECT)
    .eq('is_active', true)
    .eq('category_id', categoryId)
    .neq('id', productId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[catalog] related:', error.message);
    return [];
  }
  return (data ?? []).map((row) => mapProduct(row as ProductRow));
}

const CATALOG_SORT_SET = new Set<CatalogSort>(CATALOG_SORT_OPTIONS.map((o) => o.value));

export function normalizeCatalogSort(raw?: string | null): CatalogSort {
  if (raw && CATALOG_SORT_SET.has(raw as CatalogSort)) return raw as CatalogSort;
  return 'newest';
}

function applyCatalogSort<T extends { order: (col: string, opts: { ascending: boolean }) => T }>(
  builder: T,
  sort: CatalogSort,
): T {
  switch (sort) {
    case 'name-asc':
      return builder.order('name', { ascending: true });
    case 'name-desc':
      return builder.order('name', { ascending: false });
    case 'oldest':
      return builder.order('created_at', { ascending: true });
    case 'price-asc':
      return builder.order('base_price', { ascending: true });
    case 'price-desc':
      return builder.order('base_price', { ascending: false });
    default:
      return builder.order('created_at', { ascending: false });
  }
}

/** Nav mega-menu: all categories with counts (not limited to showcase tiles). */
export type CatalogQuery = {
  categorySlug?: string;
  search?: string;
  sort?: CatalogSort;
  page?: number;
  limit?: number;
};

export type CatalogResult = {
  products: FeaturedProduct[];
  total: number;
  page: number;
  totalPages: number;
};

/** Paginated catalog for `/products` — respects category + search query params. */
export async function getCatalogProducts(query: CatalogQuery = {}): Promise<CatalogResult> {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(48, Math.max(1, query.limit ?? 24));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();

  let categoryId: string | null = null;
  if (query.categorySlug?.trim()) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', query.categorySlug.trim())
      .maybeSingle();
    if (!cat) return { products: [], total: 0, page, totalPages: 0 };
    categoryId = cat.id;
  }

  let builder = supabase
    .from('products')
    .select(PRODUCT_LIST_SELECT, { count: 'exact' })
    .eq('is_active', true);

  if (categoryId) builder = builder.eq('category_id', categoryId);

  const search = query.search?.trim().replace(/[%_,.()]/g, ' ');
  if (search) {
    const term = `%${search}%`;
    builder = builder.or(
      `name.ilike.${term},slug.ilike.${term},short_desc.ilike.${term},description.ilike.${term},cas_number.ilike.${term}`,
    );
  }

  const sort = normalizeCatalogSort(query.sort);
  builder = applyCatalogSort(builder, sort);

  const { data, count, error } = await builder.range(from, to);

  if (error) {
    console.error('[catalog] list:', error.message);
    return { products: [], total: 0, page, totalPages: 0 };
  }

  const total = count ?? 0;
  return {
    products: (data ?? []).map((row) => mapProduct(row as ProductRow)),
    total,
    page,
    totalPages: total > 0 ? Math.ceil(total / limit) : 0,
  };
}

/** Active product slugs for `app/sitemap.ts`. */
export async function getSitemapProductSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('products').select('slug').eq('is_active', true);

  if (error) {
    console.error('[catalog] sitemap slugs:', error.message);
    return [];
  }
  return (data ?? []).map((row) => row.slug).filter(Boolean);
}

export async function getNavCategories(): Promise<CategoryWithCount[]> {
  const supabase = await createClient();
  const [{ data: categories, error: catErr }, { data: products, error: prodErr }] = await Promise.all([
    supabase.from('categories').select('id,name,slug,sort_order').order('sort_order', { ascending: true }),
    supabase.from('products').select('category_id').eq('is_active', true),
  ]);

  if (catErr) console.error('[catalog] nav categories:', catErr.message);
  if (prodErr) console.error('[catalog] nav counts:', prodErr.message);

  const counts = new Map<string, number>();
  for (const p of products ?? []) {
    if (p.category_id) counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
  }

  return (categories ?? []).map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    count: counts.get(cat.id) ?? 0,
  }));
}
