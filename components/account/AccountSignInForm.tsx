'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { publicSiteHref } from '@/lib/seo/site';

type Props = {
  authError?: boolean;
};

export function AccountSignInForm({ authError }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setStatus('error');
      setMessage('Enter the email you use at checkout.');
      return;
    }

    setStatus('sending');
    setMessage(null);

    try {
      const supabase = createClient();
      const redirectTo = publicSiteHref('/auth/callback?next=/account');
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser: true,
        },
      });
      if (error) throw error;
      setStatus('sent');
      setMessage(`Check ${trimmed} for a sign-in link. It expires in about an hour.`);
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Could not send sign-in link.');
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
      {authError ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">
          Sign-in link expired or was invalid. Request a new link below.
        </p>
      ) : null}

      <div>
        <label htmlFor="account-email" className="block font-mono text-[10px] uppercase tracking-wider text-slate-500">
          Email
        </label>
        <input
          id="account-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@institution.edu"
          className="mt-2 w-full rounded-xl border border-white/10 bg-lab-base/80 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-lab-primary/50"
        />
      </div>

      {message ? (
        <p
          className={`text-sm ${status === 'error' ? 'text-red-300' : 'text-lab-mint'}`}
          role={status === 'error' ? 'alert' : 'status'}
        >
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-xl border border-lab-primary/50 bg-lab-primary/20 py-3 font-mono text-[10px] uppercase tracking-wider text-lab-primary hover:bg-lab-primary/30 disabled:opacity-50"
      >
        {status === 'sending' ? 'Sending link…' : status === 'sent' ? 'Resend sign-in link' : 'Email me a sign-in link'}
      </button>

      <p className="text-xs leading-relaxed text-slate-500">
        Use the same email as checkout. We match orders by contact email—no password required.
      </p>
    </form>
  );
}
