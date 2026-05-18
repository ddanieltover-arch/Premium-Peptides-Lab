'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';

type Props = { children: ReactNode };

/** Redirect unauthenticated users to admin login (client-side; APIs still enforce JWT). */
export function AdminAuthGuard({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setReady(true);
      return;
    }

    const supabase = createClient();
    createClient().auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/admin/login');
        return;
      }
      setReady(true);
    });
  }, [pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-slate-500">Loading admin…</p>
      </div>
    );
  }
  return <>{children}</>;
}
