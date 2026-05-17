const DEFAULT_SITE_URL = 'https://premiumpeptideslab.online';

export const SITE_NAME = 'Premium Peptides Lab';

export const SITE_DESCRIPTION =
  'Third-party verified, HPLC-characterized research peptides. Stringent release criteria, full analytical traceability, and documentation suitable for institutional protocols.';

export const SITE_EMAIL = 'info@premiumpeptideslab.online';

/** Canonical origin for metadata, sitemap, and JSON-LD. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  return raw.replace(/\/$/, '');
}

export function absoluteUrl(path: string, siteUrl = getSiteUrl()): string {
  if (!path) return siteUrl;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
