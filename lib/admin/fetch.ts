'use client';

import { createClient } from '@/lib/supabase/client';

type AdminFetchOptions = {
  method?: string;
  json?: unknown;
};

/** Call admin API routes with the current Supabase session (JWT verified server-side). */
export async function adminApiJson<T>(path: string, options?: AdminFetchOptions): Promise<T> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('Not signed in. Refresh the page and log in again.');
  }
  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.access_token}`,
  };
  let body: string | undefined;
  if (options?.json !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.json);
  }
  const res = await fetch(path, {
    method: options?.method ?? 'GET',
    headers,
    body,
  });
  const text = await res.text();
  let parsed: unknown = {};
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error(text.slice(0, 200) || res.statusText);
    }
  }
  if (!res.ok) {
    const err = (parsed as { error?: string })?.error;
    throw new Error(typeof err === 'string' ? err : `Request failed (${res.status})`);
  }
  return parsed as T;
}
