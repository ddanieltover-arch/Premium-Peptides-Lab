"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, LogOut } from "lucide-react";
import { cn } from "@/lib/cn";
import { createClient } from "@/lib/supabase/client";
import { ADMIN_NAV_ITEMS } from "@/lib/admin/nav";

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await createClient().auth.signOut();
      if (error) throw error;
      router.replace("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
      window.location.href = "/admin/login";
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-brand-secondary/40 backdrop-blur-sm lg:hidden print:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 border-r border-slate-200 bg-white shadow-sm transition-transform duration-300 ease-in-out print:hidden",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5">
            <Link href="/admin/dashboard" className="flex min-w-0 items-center gap-3">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg ring-2 ring-lab-primary/30">
                <Image src="/brand-logo.png" alt="" fill className="object-cover" sizes="36px" />
              </div>
              <div className="min-w-0">
                <span className="block truncate text-sm font-bold tracking-tight text-brand-secondary">
                  Premium Peptides Lab
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-widest text-lab-primary">
                  Admin
                </span>
              </div>
            </Link>
          </div>

          <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-5">
            {ADMIN_NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center justify-between rounded-lg py-2.5 pl-3 pr-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "admin-nav-active"
                      : "border-l-[3px] border-transparent text-slate-600 hover:bg-slate-50 hover:text-brand-secondary",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isActive ? "text-lab-primary" : "text-slate-400 group-hover:text-lab-primary",
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 text-lab-primary/60" />}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-100 p-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
