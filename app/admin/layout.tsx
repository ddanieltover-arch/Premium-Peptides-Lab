"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import { cn } from "@/lib/cn";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import "./admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <div className="admin-shell min-h-screen bg-white text-slate-900">
        {children}
      </div>
    );
  }

  return (
    <AdminAuthGuard>
      <div className="admin-shell min-h-screen bg-[#f8fafc] text-slate-900">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div
          className={cn(
            "transition-all duration-300 ease-in-out",
            "lg:pl-64 print:pl-0",
          )}
        >
          <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="min-h-[calc(100vh-4rem)] pt-16 print:min-h-0 print:pt-0">
            <div className="p-4 md:p-8 print:p-0">{children}</div>
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
