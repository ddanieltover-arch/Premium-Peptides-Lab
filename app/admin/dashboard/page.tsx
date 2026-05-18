"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { adminApiJson } from "@/lib/admin/fetch";
import { cn } from "@/lib/cn";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: "Total Revenue", value: "$0.00", change: "+0%", trend: "up", icon: TrendingUp, statClass: "admin-stat-revenue" },
    { label: "Active Orders", value: "0", change: "+0%", trend: "up", icon: ShoppingCart, statClass: "admin-stat-orders" },
    { label: "Total Products", value: "0", change: "+0%", trend: "up", icon: Package, statClass: "admin-stat-products" },
    { label: "Total Customers", value: "0", change: "+0%", trend: "up", icon: Users, statClass: "admin-stat-customers" },
  ]);

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchMetrics();
    fetchRecentOrders();
    fetchLowStock();
  }, []);

  async function fetchLowStock() {
    const { data } = await createClient()
      .from('products')
      .select('name, stock, slug')
      .lte('stock', 5)
      .order('stock', { ascending: true })
      .limit(5);
    if (data) setLowStockProducts(data);
  }

  async function fetchRecentOrders() {
    try {
      const { orders } = await adminApiJson<{ orders: any[] }>(
        "/api/admin/orders?limit=5&withCustomer=1"
      );
      setRecentOrders(orders ?? []);
    } catch (e) {
      console.error("Recent orders:", e);
      setRecentOrders([]);
    }
  }

  async function fetchMetrics() {
    setLoading(true);
    
    try {
      const [productsRes, ordersRows, customersRes] = await Promise.all([
        createClient().from('products').select('*', { count: 'exact', head: true }),
        adminApiJson<{ orders: Array<{ total?: unknown }> }>('/api/admin/orders?slim=1').then((r) => r.orders),
        createClient().from('customers').select('*', { count: 'exact', head: true }),
      ]);

      const totalRevenue = ordersRows.reduce(
        (acc: number, order: { total?: unknown }) => acc + Number(order.total),
        0,
      );
      const orderCount = ordersRows.length;
      const productCount = productsRes.count || 0;
      const customerCount = customersRes.count || 0;

      setStats([
        { label: "Total Revenue", value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, change: "+0%", trend: "up", icon: TrendingUp, statClass: "admin-stat-revenue" },
        { label: "Active Orders", value: orderCount.toString(), change: "+0%", trend: "up", icon: ShoppingCart, statClass: "admin-stat-orders" },
        { label: "Total Products", value: productCount.toString(), change: "+0%", trend: "up", icon: Package, statClass: "admin-stat-products" },
        { label: "Total Customers", value: customerCount.toString(), change: "+0%", trend: "up", icon: Users, statClass: "admin-stat-customers" },
      ]);
    } catch (error) {
      console.error("Dashboard metrics error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="mt-1 text-slate-600">Welcome back — here&apos;s what&apos;s happening today.</p>
        </div>
        {loading && <Loader2 className="h-5 w-5 animate-spin text-lab-primary" />}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-lab-primary/20 hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className={`rounded-xl p-3 ${stat.statClass}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts / More content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-96 flex items-center justify-center text-slate-400 italic">
          Revenue Analytics Chart Placeholder
        </div>
        
        <div className="space-y-6">
          {/* Recent Orders */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white">Recent Orders</h3>
              <Link href="/admin/orders" className="text-xs font-semibold text-primary hover:underline">View All</Link>
            </div>
            <div className="flex-1 divide-y divide-slate-50 dark:divide-slate-800">
              {recentOrders.map(order => (
                <div key={order.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">#{order.order_number}</p>
                    <p className="text-sm font-bold text-primary">${Number(order.total).toFixed(2)}</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {order.customer?.name || order.contact_email || "Guest checkout"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white">Low Stock Alerts</h3>
              <Link href="/admin/products" className="text-xs font-semibold text-primary hover:underline">Manage</Link>
            </div>
            <div className="flex-1 divide-y divide-slate-50 dark:divide-slate-800">
              {lowStockProducts.map(product => (
                <div key={product.slug} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{product.name}</p>
                    <p className="text-xs text-slate-500">Inventory level critical</p>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded text-xs font-bold",
                    product.stock === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                  )}>
                    {product.stock} left
                  </div>
                </div>
              ))}
              {lowStockProducts.length === 0 && (
                <div className="p-8 text-center text-slate-400 italic text-sm">
                  Inventory levels are healthy.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
