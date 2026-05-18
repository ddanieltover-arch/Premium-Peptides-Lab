"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";
import { adminApiJson } from "@/lib/admin/fetch";

export default function EditProductPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [product, setProduct] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { product: data } = await adminApiJson<{ product: Record<string, unknown> }>(
          `/api/admin/products/${id}`,
        );
        if (!cancelled) setProduct(data);
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load product");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to products
        </Link>
        <p className="text-red-600">{error ?? "Product not found"}</p>
      </div>
    );
  }

  const name = typeof product.name === "string" ? product.name : "Product";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:text-primary dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Product</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Update details for &ldquo;{name}&rdquo;.</p>
        </div>
      </div>

      <ProductForm initialData={product} productId={id} />
    </div>
  );
}
