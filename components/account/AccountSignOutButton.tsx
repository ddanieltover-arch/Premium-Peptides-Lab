'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function AccountSignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void signOut()}
      disabled={loading}
      className="rounded-xl border border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-slate-400 hover:border-white/20 hover:text-white disabled:opacity-50"
    >
      {loading ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
