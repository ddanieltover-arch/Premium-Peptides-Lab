/**
 * Optional: redirect `/admin/*` to another deployment (legacy fallback).
 * Leave unset to use the in-app admin UI on this domain (phased port from precision-health-store).
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
