/** Session key: product slug that should open the certificate accordion after navigation. */
export const COA_OPEN_SESSION_KEY = 'ppl:open-coa';

export function wantsCoaSection(productSlug: string): boolean {
  if (typeof window === 'undefined') return false;
  if (window.location.hash === '#coa') return true;
  try {
    return sessionStorage.getItem(COA_OPEN_SESSION_KEY) === productSlug;
  } catch {
    return false;
  }
}

export function markCoaSectionIntent(productSlug: string): void {
  try {
    sessionStorage.setItem(COA_OPEN_SESSION_KEY, productSlug);
  } catch {
    // ignore private browsing / storage blocks
  }
}

export function clearCoaSectionIntent(): void {
  try {
    sessionStorage.removeItem(COA_OPEN_SESSION_KEY);
  } catch {
    // ignore
  }
}

export function ensureCoaHashInUrl(): void {
  if (typeof window === 'undefined') return;
  if (window.location.hash === '#coa') return;
  const url = `${window.location.pathname}${window.location.search}#coa`;
  window.history.replaceState(window.history.state, '', url);
}

export function scrollToCoaSection(): void {
  document.getElementById('coa')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function notifyCoaSectionTarget(): void {
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

export function normalizePathname(pathname: string): string {
  const base = pathname.replace(/\/$/, '') || '/';
  return base;
}

export function isProductPath(pathname: string, productPath: string): boolean {
  const current = normalizePathname(pathname);
  const target = normalizePathname(productPath);
  return current === target || current.endsWith(target);
}
