import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAdminAppOrigin, isSameSiteOrigin } from '@/lib/admin/config';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const adminOrigin = getAdminAppOrigin();
  const { pathname, search } = request.nextUrl;

  if (
    adminOrigin &&
    pathname.startsWith('/admin') &&
    !isSameSiteOrigin(request.nextUrl.origin, adminOrigin)
  ) {
    const target = new URL(`${pathname}${search}`, adminOrigin);
    return NextResponse.redirect(target);
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
