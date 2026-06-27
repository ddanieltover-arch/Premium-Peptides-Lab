/** Supabase public bucket where uploaded COA PDFs/images are stored. */
export const COA_STORAGE_MARKER = '/coa-documents/';

/** Products with an uploaded COA on file (Premiumlab batch). */
export const COA_PRODUCT_SLUGS = [
  'ghk-cu',
  'mots-c',
  'retatrutide',
  'nad-plus',
  'tb-500-10mg',
  'tirzepatide',
  'cjc-1295-without-dac-ipa-5mg',
  'vip',
  'tesamorelin',
  'epitalon',
  'hgh-191aa-somatropin',
  '5-amino-1mq',
] as const;

export type CoaProductSlug = (typeof COA_PRODUCT_SLUGS)[number];

const COA_SLUG_SET = new Set<string>(COA_PRODUCT_SLUGS);

export function isCoaDocumentUrl(url: string | null | undefined): boolean {
  const value = url?.trim();
  if (!value) return false;
  return value.includes(COA_STORAGE_MARKER);
}

/** True when `source_url` points at our COA storage bucket (not legacy scrape URLs). */
export function resolveCoaDocumentUrl(sourceUrl: string | null | undefined): string | undefined {
  const value = sourceUrl?.trim();
  if (!value || !isCoaDocumentUrl(value)) return undefined;
  return value;
}

export function isCoaProductSlug(slug: string): slug is CoaProductSlug {
  return COA_SLUG_SET.has(slug);
}
