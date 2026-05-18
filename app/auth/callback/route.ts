import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** Exchange magic-link / OAuth code for a session, then return to account. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/account';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next.startsWith('/') ? next : '/account'}`);
    }
  }

  return NextResponse.redirect(`${origin}/account?auth=error`);
}
