/** Production storefront — use for customer-facing links in forms and emails. */
export const LIVE_SITE_URL = 'https://premiumpeptideslab.online';

const DEFAULT_SITE_URL = LIVE_SITE_URL;

export const SITE_NAME = 'Premium Peptides Lab';

export const SITE_DESCRIPTION =
  'Third-party verified, HPLC-characterized research peptides. Stringent release criteria, full analytical traceability, and documentation suitable for institutional protocols.';

export const SITE_EMAIL = 'info@premiumpeptideslab.online';

/** Primary brand mark served from `public/`. */
export const BRAND_LOGO_PATH = '/brand-logo.png';

/** Social / Open Graph preview image (brand logo). */
export const OG_IMAGE_PATH = '/og-image.png';

/** Canonical origin for metadata, sitemap, and JSON-LD. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  return raw.replace(/\/$/, '');
}

/**
 * Live storefront origin for links in forms, emails, and shared UI.
 * Never returns localhost so buttons always reach the public site.
 */
export function getPublicSiteUrl(): string {
  const explicit = process.env.EMAIL_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, '');
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv && !/localhost|127\.0\.0\.1|0\.0\.0\.0/i.test(fromEnv)) {
    return fromEnv.replace(/\/$/, '');
  }
  return LIVE_SITE_URL;
}

/** Absolute URL on the live storefront (forms, emails, external CTAs). */
export function publicSiteHref(path: string): string {
  return absoluteUrl(path, getPublicSiteUrl());
}

export function absoluteUrl(path: string, siteUrl = getSiteUrl()): string {
  if (!path) return siteUrl;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
