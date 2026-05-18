"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ExternalLink, 
  Edit2, 
  Trash2,
  Package,
  Eye
} from "lucide-react";
import { cn } from "@/lib/cn";
import { adminApiJson } from "@/lib/admin/fetch";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleBulkStockUpdate(adjustment: number) {
    if (selectedIds.length === 0) return;
    setIsBulkUpdating(true);
    
    // In a real app, you'd use a RPC or a bulk update logic
    // For now, we'll do individual updates (simplest with Supabase client)
    await Promise.all(
      selectedIds.map(async (id) => {
        const product = products.find((p) => p.id === id);
        if (!product) return;
        await adminApiJson(`/api/admin/products/${id}`, {
          method: "PATCH",
          json: { stock: Math.max(0, product.stock + adjustment) },
        });
      }),
    );
    await fetchProducts();
    setSelectedIds([]);
    setIsBulkUpdating(false);
  }

  async function handleBulkDelete() {
    if (selectedIds.length === 0) return;
    if (
      !confirm(
        `Permanently delete ${selectedIds.length} product(s)? Variants and images will be removed. This cannot be undone.`
      )
    ) {
      return;
    }
    setIsBulkDeleting(true);
    try {
      await Promise.all(
        selectedIds.map((id) =>
          adminApiJson(`/api/admin/products/${id}`, { method: "DELETE" }),
        ),
      );
    } catch (e: unknown) {
      setIsBulkDeleting(false);
      alert(e instanceof Error ? e.message : "Delete failed");
      return;
    }
    setIsBulkDeleting(false);
    setSelectedIds([]);
    await fetchProducts();
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  async function fetchProducts() {
    setLoading(true);
    try {
      const { products: data } = await adminApiJson<{ products: Record<string, unknown>[] }>(
        "/api/admin/products",
      );
      setProducts(data);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to load products");
    }
    setLoading(false);
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Products</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your inventory and product listings.</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 h-10 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-8 animate-slide-in-bottom border border-slate-700">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold">
              {selectedIds.length}
            </span>
            <span className="text-sm font-medium">Items selected</span>
          </div>
          <div className="h-8 w-px bg-slate-700" />
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Stock Adjustment:</span>
            <button 
              onClick={() => handleBulkStockUpdate(1)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-bold"
            >
              +1
            </button>
            <button 
              onClick={() => handleBulkStockUpdate(-1)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-bold"
            >
              -1
            </button>
            <button 
              onClick={() => {
                const val = prompt("Enter stock increase amount:");
                if (val) handleBulkStockUpdate(Number(val));
              }}
              className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 transition-colors text-sm font-bold"
            >
              Custom
            </button>
          </div>
          <div className="h-8 w-px bg-slate-700" />
          <button
            type="button"
            onClick={handleBulkDelete}
            disabled={isBulkDeleting}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-500 disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            {isBulkDeleting ? "Deleting…" : `Delete ${selectedIds.length}`}
          </button>
          <div className="h-8 w-px bg-slate-700" />
          <button 
            onClick={() => setSelectedIds([])}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4" 
                  />
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Product</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 hidden sm:table-cell">Category</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Price</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">Stock</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 hidden lg:table-cell">Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-10 w-40 bg-slate-100 dark:bg-slate-800 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-12 bg-slate-100 dark:bg-slate-800 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-full"></div></td>
                    <td className="px-6 py-4"><div className="h-8 w-8 ml-auto bg-slate-100 dark:bg-slate-800 rounded"></div></td>
                  </tr>
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4" 
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                          {product.thumbnail_url ? (
                            <img src={product.thumbnail_url} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <Package className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">{product.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell text-sm text-slate-600 dark:text-slate-400">
                      {product.category?.name || "Uncategorized"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                      ${Number(product.base_price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-sm font-medium",
                          product.stock <= 5 ? "text-red-600" : "text-slate-600 dark:text-slate-400"
                        )}>
                          {product.stock}
                        </span>
                        {product.stock <= 5 && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        product.is_active 
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400"
                      )}>
                        {product.is_active ? "Active" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="p-2 text-slate-400 hover:text-primary transition-colors" 
                          title="View on Storefront"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <Link 
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 text-slate-400 hover:text-primary transition-colors" 
                          title="Edit product"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button 
                          onClick={async () => {
                            if (!confirm("Are you sure you want to delete this product?")) return;
                            try {
                              await adminApiJson(`/api/admin/products/${product.id}`, {
                                method: "DELETE",
                              });
                              fetchProducts();
                            } catch (e: unknown) {
                              alert(e instanceof Error ? e.message : "Delete failed");
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors" 
                          title="Delete product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No products found.
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
