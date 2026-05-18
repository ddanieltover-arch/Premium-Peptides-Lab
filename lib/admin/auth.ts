import { createClient } from '@supabase/supabase-js';

/**
 * Validates a Supabase user JWT from the admin UI, then allows server routes to use the service role.
 * Optional: ADMIN_ALLOWED_EMAILS=comma@separated,emails
 */
export async function getUserFromAdminBearer(accessToken: string | null | undefined) {
  if (!accessToken) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const authClient = createClient(url, anonKey);
  const {
    data: { user },
    error,
  } = await authClient.auth.getUser(accessToken);
  if (error || !user) return null;

  const raw = process.env.ADMIN_ALLOWED_EMAILS;
  const allowed = raw
    ?.split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (allowed?.length) {
    const em = (user.email || '').toLowerCase();
    if (!allowed.includes(em)) return null;
  }

  return user;
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return new Response(JSON.stringify({ error: message }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
