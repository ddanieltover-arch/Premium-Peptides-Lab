import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumbs / Back */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/products"
          className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Product</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Create a new listing in your catalog.</p>
        </div>
      </div>

      <ProductForm />
    </div>
  );
}
