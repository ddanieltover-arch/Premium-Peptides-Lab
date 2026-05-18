"use client";

import React, { useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  Package,
  FileText,
  Download,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { adminApiJson } from "@/lib/admin/fetch";

const statusConfig: Record<string, { label: string; icon: LucideIcon; class: string }> = {
  PENDING: { label: "Pending", icon: Clock, class: "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400" },
  CONFIRMED: { label: "Confirmed", icon: CheckCircle2, class: "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400" },
  PROCESSING: { label: "Processing", icon: Package, class: "bg-sky-100 text-sky-800 dark:bg-sky-950/30 dark:text-sky-400" },
  SHIPPED: { label: "Shipped", icon: Truck, class: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-400" },
  DELIVERED: { label: "Delivered", icon: CheckCircle2, class: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400" },
  CANCELLED: { label: "Cancelled", icon: XCircle, class: "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400" },
  REFUNDED: { label: "Refunded", icon: XCircle, class: "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300" },
  SUPPORT: { label: "Support", icon: CheckCircle2, class: "bg-violet-100 text-violet-800 dark:bg-violet-950/30 dark:text-violet-400" },
};

function statusBadge(orderStatus: string | undefined) {
  const key = (orderStatus || "").trim();
  if (key && statusConfig[key]) return statusConfig[key];
  return {
    label: key || "Unknown",
    icon: Clock,
    class: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    setFetchError(null);
    try {
      const { orders } = await adminApiJson<{ orders: any[] }>("/api/admin/orders");
      setOrders(orders ?? []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load orders";
      console.error("Fetch orders error:", e);
      setFetchError(msg);
      setOrders([]);
    }
    setLoading(false);
  }

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    return (
      (o.order_number && String(o.order_number).toLowerCase().includes(q)) ||
      (o.contact_email && String(o.contact_email).toLowerCase().includes(q)) ||
      (o.id && String(o.id).toLowerCase().includes(q))
    );
  });

  const toggleSelect = (orderId: string) => {
    setSelectedIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const toggleSelectAllFiltered = () => {
    if (
      filteredOrders.length > 0 &&
      filteredOrders.every((o) => selectedIds.includes(o.id))
    ) {
      setSelectedIds((prev) => prev.filter((id) => !filteredOrders.some((o) => o.id === id)));
    } else {
      const ids = new Set(selectedIds);
      filteredOrders.forEach((o) => ids.add(o.id));
      setSelectedIds(Array.from(ids));
    }
  };

  async function handleBulkDeleteOrders() {
    if (selectedIds.length === 0) return;
    if (
      !confirm(
        `Permanently delete ${selectedIds.length} order(s) and their line items? This cannot be undone.`
      )
    ) {
      return;
    }
    setIsBulkDeleting(true);
    try {
      await adminApiJson("/api/admin/orders/bulk-delete", {
        method: "POST",
        json: { ids: selectedIds },
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Delete failed";
      alert(msg);
      setIsBulkDeleting(false);
      return;
    }
    setIsBulkDeleting(false);
    setSelectedIds([]);
    fetchOrders();
  }

  return (
    <div className="space-y-6 animate-fade-in relative pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Orders</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track customer orders.</p>
        </div>
        <button className="flex items-center gap-2 px-4 h-10 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
          <Download className="h-4 w-4" />
          <span className="text-sm font-medium">Export Orders</span>
        </button>
      </div>

      {fetchError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
          <strong className="font-semibold">Could not load orders.</strong> {fetchError}
          {fetchError.includes("SERVICE_ROLE") || fetchError.includes("service role") ? (
            <span className="block mt-1 text-xs opacity-90">
              Add <code className="rounded bg-red-100/80 px-1">SUPABASE_SERVICE_ROLE_KEY</code> to the storefront environment (same as email routes), then redeploy.
            </span>
          ) : null}
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 shrink-0">
          <input
            type="checkbox"
            checked={
              filteredOrders.length > 0 &&
              filteredOrders.every((o) => selectedIds.includes(o.id))
            }
            onChange={toggleSelectAllFiltered}
            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
          />
          Select all in view
        </label>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders (ID, customer...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button type="button" className="flex items-center gap-2 px-4 h-10 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filter Status</span>
          </button>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 flex-wrap items-center justify-center gap-4 rounded-2xl border border-slate-700 bg-slate-900 px-6 py-4 text-white shadow-2xl">
          <span className="text-sm font-medium">{selectedIds.length} order(s) selected</span>
          <div className="hidden h-8 w-px bg-slate-700 sm:block" />
          <button
            type="button"
            onClick={handleBulkDeleteOrders}
            disabled={isBulkDeleting}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-500 disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            {isBulkDeleting ? "Deleting…" : "Delete selected"}
          </button>
          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="text-sm text-slate-400 hover:text-white"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-4 py-4 w-12">
                  <span className="sr-only">Select</span>
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Order Info</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Total</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4"><div className="h-4 w-4 bg-slate-100 dark:bg-slate-800 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-10 w-32 bg-slate-100 dark:bg-slate-800 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-10 w-40 bg-slate-100 dark:bg-slate-800 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-100 dark:bg-slate-800 rounded-full"></div></td>
                    <td className="px-6 py-4"><div className="h-8 w-8 ml-auto bg-slate-100 dark:bg-slate-800 rounded"></div></td>
                  </tr>
                ))
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const status = statusBadge(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-4 py-4 align-middle">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(order.id)}
                          onChange={() => toggleSelect(order.id)}
                          className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                          aria-label={`Select order ${order.order_number}`}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">#{order.order_number}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">VIA Web Store</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">Guest</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{order.contact_email || "—"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                        ${Number(order.total).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all",
                          status.class
                        )}>
                          <status.icon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={`/admin/orders/${order.id}`}
                            className="p-2 text-slate-400 hover:text-primary transition-colors" 
                            title="View Order"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button className="p-2 text-slate-400 hover:text-primary transition-colors" title="Invoice">
                            <FileText className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
