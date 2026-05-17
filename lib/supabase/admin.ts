import { createClient } from '@supabase/supabase-js';

/** Service-role client — server-only (checkout, admin scripts). */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    const misnamed = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
    if (misnamed) {
      throw new Error(
        'SUPABASE_SERVICE_ROLE_KEY must not use the NEXT_PUBLIC_ prefix (that exposes the service role to the browser). Rename it in .env.local and Vercel.',
      );
    }
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
