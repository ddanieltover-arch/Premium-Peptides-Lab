"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  MoreHorizontal,
  User,
  ShoppingBag
} from "lucide-react";
import { adminApiJson } from "@/lib/admin/fetch";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    try {
      const { customers: rows } = await adminApiJson<{ customers: Record<string, unknown>[] }>(
        "/api/admin/customers",
      );
      setCustomers(rows);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to load customers");
    }
    setLoading(false);
  }

  const q = searchQuery.toLowerCase();
  const filteredCustomers = customers.filter((c) => {
    const name = (c.name || "").toLowerCase();
    const email = (c.email || "").toLowerCase();
    const phone = (c.phone || "").toLowerCase();
    return (
      name.includes(q) ||
      email.includes(q) ||
      phone.includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customers</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and view your customer base.</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse"></div>
          ))
        ) : filteredCustomers.map(customer => (
          <div key={customer.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                <User className="h-6 w-6" />
              </div>
              <button className="p-2 text-slate-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white truncate">{customer.name || "Guest Checkout"}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Mail className="h-3 w-3" />
                <span className="truncate">{customer.email}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <ShoppingBag className="h-3.5 w-3.5" />
                <span className="font-bold text-slate-900 dark:text-white">{customer.orders?.[0]?.count || 0}</span>
                <span>Orders</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>Joined {new Date(customer.created_at).getFullYear()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
