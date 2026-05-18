"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { createClient } from "@/lib/supabase/client";

function randomEmailPlaceholder(): string {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 10)
      : Math.random().toString(36).slice(2, 12);
  return `admin-${id}@example.com`;
}

export default function LoginPage() {
  const router = useRouter();
  const emailPlaceholder = useMemo(() => randomEmailPlaceholder(), []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await createClient().auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid login credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-slate-50 to-lab-primary/5 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-lab-primary via-lab-mint/80 to-lab-primary text-2xl font-bold text-brand-secondary shadow-lg shadow-lab-primary/30 ring-2 ring-lab-primary/20">
            PPL
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-brand-secondary">Admin Portal</h1>
          <p className="mt-2 text-slate-600">Sign in to manage Premium Peptides Lab</p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40 ring-1 ring-lab-primary/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={emailPlaceholder}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-lab-primary focus:bg-white focus:ring-4 focus:ring-lab-primary/15"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-xs font-semibold text-lab-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-lab-primary focus:bg-white focus:ring-4 focus:ring-lab-primary/15"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 dark:bg-red-950/20 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "btn-primary group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-4 font-semibold transition-all focus:ring-4 focus:ring-lab-primary/30",
                isLoading && "opacity-80"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-slate-600">
          Not an administrator? <a href="/" className="font-semibold text-lab-primary hover:underline">Back to storefront</a>
        </p>
      </div>
    </div>
  );
}
