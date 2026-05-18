"use client";

import React, { useEffect, useState } from "react";
import { Bell, Search, User, Menu } from "lucide-react";
import { cn } from "@/lib/cn";
import { createClient } from "@/lib/supabase/client";

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const [user, setUser] = useState<{ email?: string; user_metadata?: { full_name?: string; avatar_url?: string } } | null>(null);

  useEffect(() => {
    createClient().auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  return (
    <header className="admin-topbar-brand fixed right-0 top-0 z-30 h-16 w-full bg-white/95 backdrop-blur-md transition-all duration-300 lg:w-[calc(100%-16rem)] print:hidden">
      <div className="flex h-full items-center justify-between px-4 md:px-8">
        <div className="flex flex-1 items-center gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-lab-primary/10 hover:text-lab-primary lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="relative hidden w-full max-w-md sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search orders, products, customers…"
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-lab-primary focus:bg-white focus:ring-4 focus:ring-lab-primary/15"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="relative rounded-full p-2 text-slate-600 transition-colors hover:bg-lab-primary/10 hover:text-lab-primary"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-lab-rose" />
          </button>

          <div className="mx-2 h-8 w-px bg-slate-200" />

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-none text-slate-900">
                {user?.user_metadata?.full_name || "Admin"}
              </p>
              <p className="mt-1 text-xs text-slate-500">{user?.email ?? "—"}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-lab-primary/25 bg-gradient-to-br from-lab-primary/15 to-brand-secondary/10 text-lab-primary">
              {user?.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-5 w-5" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
