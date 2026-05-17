import { SITE_EMAIL, SITE_NAME, getPublicSiteUrl, publicSiteHref } from '@/lib/seo/site';

/** Operational inbox for contact and order alerts. */
export const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_EMAIL?.trim() || SITE_EMAIL;

/** Storefront origin for links in transactional email (always the live site). */
export function siteOrigin(): string {
  return getPublicSiteUrl();
}

/** @deprecated Alias for siteOrigin */
export function emailPublicOrigin(): string {
  return siteOrigin();
}

export function absoluteUrl(path: string): string {
  return publicSiteHref(path);
}

/** Resend `from` — must use a domain verified in your Resend dashboard. */
export function emailFrom(): string {
  const explicit = process.env.EMAIL_FROM?.trim() || process.env.RESEND_FROM?.trim();
  if (explicit) return explicit;
  return `${SITE_NAME} <${SITE_EMAIL}>`;
}
