"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Save, 
  X, 
  Upload, 
  Trash2, 
  Plus, 
  Info,
  ChevronDown,
  AlertCircle,
  Loader2,
  Beaker
} from "lucide-react";
import { cn } from "@/lib/cn";
import { adminApiJson } from "@/lib/admin/fetch";

interface ProductFormProps {
  initialData?: any;
  productId?: string;
}

export function ProductForm({ initialData, productId }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    short_desc: initialData?.short_desc || "",
    category_id: initialData?.category_id || "",
    base_price: initialData?.base_price || 0,
    compare_price: initialData?.compare_price || 0,
    stock: initialData?.stock || 0,
    is_active: initialData?.is_active ?? true,
    is_featured: initialData?.is_featured ?? false,
    thumbnail_url: initialData?.thumbnail_url || "",
    molecular_formula: initialData?.molecular_formula || "",
    molecular_weight: initialData?.molecular_weight || "",
    cas_number: initialData?.cas_number || "",
    sequence: initialData?.sequence || "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!initialData) return;
    setFormData({
      name: initialData.name || "",
      slug: initialData.slug || "",
      description: initialData.description || "",
      short_desc: initialData.short_desc || "",
      category_id: initialData.category_id || "",
      base_price: initialData.base_price || 0,
      compare_price: initialData.compare_price || 0,
      stock: initialData.stock || 0,
      is_active: initialData.is_active ?? true,
      is_featured: initialData.is_featured ?? false,
      thumbnail_url: initialData.thumbnail_url || "",
      molecular_formula: initialData.molecular_formula || "",
      molecular_weight: initialData.molecular_weight || "",
      cas_number: initialData.cas_number || "",
      sequence: initialData.sequence || "",
    });
  }, [initialData]);

  async function fetchCategories() {
    try {
      const { categories } = await adminApiJson<{ categories: { id: string; name: string }[] }>(
        "/api/admin/categories",
      );
      setCategories(categories);
    } catch {
      setCategories([]);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleToggle = (name: string) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }));
  };

  const generateSlug = () => {
    const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (productId) {
        await adminApiJson(`/api/admin/products/${productId}`, {
          method: "PATCH",
          json: formData,
        });
      } else {
        await adminApiJson("/api/admin/products", {
          method: "POST",
          json: formData,
        });
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* General Info */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              General Information
            </h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Product Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                onBlur={generateSlug}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800"
                placeholder="e.g. BPC-157 5mg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Slug</label>
                <input
                  type="text"
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-mono outline-none focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800"
                  placeholder="bpc-157-5mg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                <div className="relative">
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none appearance-none focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Short Description</label>
              <textarea
                name="short_desc"
                rows={2}
                value={formData.short_desc}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800"
                placeholder="Brief summary for product cards..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Description</label>
              <textarea
                name="description"
                rows={6}
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800"
                placeholder="Detailed product information..."
              />
            </div>
          </div>

          {/* Scientific Specifications */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Beaker className="h-5 w-5 text-primary" />
              Scientific Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Molecular Formula</label>
                <input
                  type="text"
                  name="molecular_formula"
                  value={formData.molecular_formula}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800"
                  placeholder="e.g. C62H98N16O22"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Molecular Weight</label>
                <input
                  type="text"
                  name="molecular_weight"
                  value={formData.molecular_weight}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800"
                  placeholder="e.g. 1419.5 g/mol"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">CAS Number</label>
                <input
                  type="text"
                  name="cas_number"
                  value={formData.cas_number}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800"
                  placeholder="e.g. 137525-51-0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Sequence</label>
                <input
                  type="text"
                  name="sequence"
                  value={formData.sequence}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800"
                  placeholder="e.g. L-Valyl-L-alanyl-..."
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Pricing & Inventory
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Base Price ($)</label>
                <input
                  type="number"
                  name="base_price"
                  step="0.01"
                  value={formData.base_price}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Compare Price ($)</label>
                <input
                  type="number"
                  name="compare_price"
                  step="0.01"
                  value={formData.compare_price}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Stock Level</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Status & Visibility */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 dark:text-white">Status & Visibility</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Active Status</p>
                <p className="text-xs text-slate-500">Visible to customers</p>
              </div>
              <button 
                type="button"
                onClick={() => handleToggle('is_active')}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                  formData.is_active ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
                )}
              >
                <span className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  formData.is_active ? "translate-x-6" : "translate-x-1"
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Featured Product</p>
                <p className="text-xs text-slate-500">Show on homepage</p>
              </div>
              <button 
                type="button"
                onClick={() => handleToggle('is_featured')}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                  formData.is_featured ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
                )}
              >
                <span className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  formData.is_featured ? "translate-x-6" : "translate-x-1"
                )} />
              </button>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">Product Image</h3>
            <div className="space-y-4">
              <div className="aspect-square rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group relative overflow-hidden">
                {formData.thumbnail_url ? (
                  <>
                    <img src={formData.thumbnail_url} alt="Thumbnail" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Trash2 className="h-6 w-6 text-white hover:text-red-400" onClick={(e) => { e.stopPropagation(); setFormData(prev => ({ ...prev, thumbnail_url: "" })); }} />
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-slate-400 mb-2" />
                    <p className="text-xs text-slate-500 font-medium text-center px-4">Click or drag to upload thumbnail</p>
                  </>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Image URL (Optional)</label>
                <input
                  type="text"
                  name="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-800"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-8 left-64 right-8 z-20 flex justify-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-3 px-6 flex items-center gap-6 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90">
          <div className="hidden md:block border-r border-slate-100 dark:border-slate-800 pr-6">
            <p className="text-xs text-slate-500 font-medium">Draft saved at 12:45 PM</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>{productId ? "Update Product" : "Publish Product"}</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
