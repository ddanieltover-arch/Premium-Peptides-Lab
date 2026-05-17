import { SITE_EMAIL, SITE_NAME, getSiteUrl } from '@/lib/seo/site';

/** Operational inbox for contact and order alerts. */
export const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_EMAIL?.trim() || SITE_EMAIL;

export function siteOrigin(): string {
  return getSiteUrl();
}

export function emailFrom(): string {
  const explicit = process.env.EMAIL_FROM?.trim();
  if (explicit) return explicit;
  const user = process.env.SMTP_USER?.trim();
  if (user) return `${SITE_NAME} <${user}>`;
  return `${SITE_NAME} <${SITE_EMAIL}>`;
}
