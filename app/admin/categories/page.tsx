"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Folder, 
  ChevronRight,
  MoreVertical,
  Layers,
  Loader2,
  X,
  Save
} from "lucide-react";
import { cn } from "@/lib/cn";
import { adminApiJson } from "@/lib/admin/fetch";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const { categories } = await adminApiJson<{
        categories: Array<Record<string, unknown> & { product_count?: number }>;
      }>("/api/admin/categories");
      setCategories(
        categories.map((c) => ({
          ...c,
          products: [{ count: c.product_count ?? 0 }],
        })),
      );
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to load categories");
    }
    setLoading(false);
  }

  const handleOpenSidebar = (category: any = null) => {
    setEditingCategory(category || { name: "", slug: "", description: "", sort_order: 0 });
    setIsSidebarOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { id, name, slug, description, sort_order } = editingCategory;
      const payload = { name, slug, description, sort_order };
      if (id) {
        await adminApiJson(`/api/admin/categories/${id}`, { method: "PATCH", json: payload });
      } else {
        await adminApiJson("/api/admin/categories", { method: "POST", json: payload });
      }
      fetchCategories();
      setIsSidebarOpen(false);
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will not delete products, but they will be uncategorized.")) return;
    try {
      await adminApiJson(`/api/admin/categories/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCategories.length && filteredCategories.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCategories.map((c) => c.id));
    }
  };

  async function handleBulkDelete() {
    if (selectedIds.length === 0) return;
    if (
      !confirm(
        `Delete ${selectedIds.length} categor${selectedIds.length === 1 ? "y" : "ies"}? Products in ${selectedIds.length === 1 ? "this group" : "these groups"} become uncategorized (not deleted).`
      )
    ) {
      return;
    }
    setIsBulkDeleting(true);
    try {
      await Promise.all(
        selectedIds.map((id) =>
          adminApiJson(`/api/admin/categories/${id}`, { method: "DELETE" }),
        ),
      );
    } catch (e: unknown) {
      setIsBulkDeleting(false);
      alert(e instanceof Error ? e.message : "Delete failed");
      return;
    }
    setIsBulkDeleting(false);
    setSelectedIds([]);
    fetchCategories();
  }

  return (
    <div className="space-y-6 animate-fade-in relative min-h-screen pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Categories</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Organize your products into logical groups.</p>
        </div>
        <button 
          onClick={() => handleOpenSidebar()}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          <span>New Category</span>
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={
              filteredCategories.length > 0 &&
              selectedIds.length === filteredCategories.length
            }
            onChange={toggleSelectAll}
            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
          />
          Select all visible ({filteredCategories.length})
        </label>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by name…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-800"
          />
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 animate-in items-center gap-4 rounded-2xl border border-slate-700 bg-slate-900 px-6 py-4 text-white shadow-2xl">
          <span className="text-sm font-medium">{selectedIds.length} selected</span>
          <div className="h-8 w-px bg-slate-700" />
          <button
            type="button"
            onClick={handleBulkDelete}
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
            Clear
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && categories.length === 0 ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse"></div>
          ))
        ) : filteredCategories.map(category => (
          <div
            key={category.id}
            className={cn(
              "bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all group",
              selectedIds.includes(category.id)
                ? "border-primary ring-2 ring-primary/20"
                : "border-slate-200 dark:border-slate-800"
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(category.id)}
                  onChange={() => toggleSelect(category.id)}
                  className="h-4 w-4 shrink-0 rounded border-slate-300 text-primary focus:ring-primary"
                  aria-label={`Select ${category.name}`}
                />
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Folder className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center gap-1 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenSidebar(category)}
                  className="p-2 text-slate-400 hover:text-primary transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(category.id)}
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white">{category.name}</h3>
              <p className="text-xs text-slate-500 font-mono">{category.slug}</p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Layers className="h-3.5 w-3.5" />
                <span className="font-bold text-slate-900 dark:text-white">{category.products?.[0]?.count || 0}</span>
                <span>Products</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Side Editor Panel */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-950 shadow-2xl animate-slide-in-right">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingCategory?.id ? "Edit Category" : "New Category"}
                </h2>
                <button onClick={() => setIsSidebarOpen(false)} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category Name</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setEditingCategory({ ...editingCategory, name, slug });
                    }}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800"
                    placeholder="e.g. Peptides"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Slug</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.slug}
                    onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-mono outline-none focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                  <textarea
                    rows={4}
                    value={editingCategory.description || ""}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800"
                    placeholder="Describe this category..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Sort Order</label>
                  <input
                    type="number"
                    value={editingCategory.sort_order}
                    onChange={(e) => setEditingCategory({ ...editingCategory, sort_order: Number(e.target.value) })}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </form>

              <div className="border-t border-slate-100 dark:border-slate-800 p-6">
                <button 
                  type="submit" 
                  onClick={handleSave}
                  disabled={loading}
                  className="btn-primary w-full h-12"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  <span>Save Category</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
