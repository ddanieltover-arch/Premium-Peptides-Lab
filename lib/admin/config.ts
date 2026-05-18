/** Strip www. so apex and www hosts compare equal (avoids redirect loops). */
export function normalizeSiteHost(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, '');
}

/** True when two origins are the same site (ignores www vs apex). */
export function isSameSiteOrigin(a: string, b: string): boolean {
  try {
    const left = new URL(a);
    const right = new URL(b);
    return (
      left.protocol === right.protocol &&
      normalizeSiteHost(left.hostname) === normalizeSiteHost(right.hostname)
    );
  } catch {
    return false;
  }
}

/**
 * Optional: redirect `/admin/*` to another deployment (legacy fallback).
 * Leave unset to use the in-app admin UI on this domain (phased port from precision-health-store).
 * Do not set to this site's own URL — that causes ERR_TOO_MANY_REDIRECTS (especially with www ↔ apex).
 */
export function getAdminAppOrigin(): string | null {
  const raw = process.env.NEXT_PUBLIC_ADMIN_APP_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.origin;
  } catch {
    return null;
  }
}

export function adminAppUrl(path = '/admin'): string | null {
  const origin = getAdminAppOrigin();
  if (!origin) return null;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${normalized}`;
}

/** Default local legacy storefront (precision-health-store). */
export const LEGACY_ADMIN_DEV_ORIGIN = 'http://localhost:3000';

export const LEGACY_ADMIN_REPO_PATH = 'precision-health-store/apps/storefront';
