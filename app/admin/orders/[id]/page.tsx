"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Package,
  Truck,
  CreditCard,
  User,
  Mail,
  Phone,
  ArrowLeft,
  Printer,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { adminApiJson } from "@/lib/admin/fetch";
import { paymentMethodLabel } from "@/lib/checkout/paymentMethods";
import { OrderAdminEditor } from "@/components/admin/OrderAdminEditor";

export default function OrderDetailsPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [order, setOrder] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    void fetchOrder();
  }, [id]);

  async function fetchOrder() {
    setLoading(true);
    try {
      const { order: data } = await adminApiJson<{ order: Record<string, any> }>(
        `/api/admin/orders/${id}`,
      );
      setOrder(data ?? null);
    } catch (e) {
      console.error("Fetch order error:", e);
      setOrder(null);
    }
    setLoading(false);
  }

  function handlePrintInvoice() {
    window.print();
  }

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (!order) return <div className="p-8 text-center text-slate-500">Order not found.</div>;

  const statusColors: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-indigo-100 text-indigo-700",
    DELIVERED: "bg-emerald-100 text-emerald-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20 print:pb-4 print:text-black">
      {/* Print-only invoice header (hidden on screen) */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-6 mb-2">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-2xl font-black tracking-tight text-slate-900">Premium Peptides Lab</p>
            <p className="mt-1 text-sm text-slate-600">Order invoice — research materials</p>
          </div>
          <div className="text-left text-sm sm:text-right">
            <p className="text-lg font-bold text-slate-900">#{order.order_number}</p>
            <p className="text-slate-700">{new Date(order.created_at).toLocaleString()}</p>
            <p className="mt-1">
              <span className="font-semibold">Status:</span> {order.status}
            </p>
            <p>
              <span className="font-semibold">Payment:</span> {order.payment_status}
            </p>
            <p>
              <span className="font-semibold">Total:</span> ${Number(order.total).toFixed(2)} USD
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between print:hidden">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/admin/orders"
            className="shrink-0 rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Back to orders"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="truncate text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                Order #{order.order_number}
              </h1>
              <span
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
                  statusColors[order.status] || "bg-slate-100",
                )}
              >
                {order.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Placed on {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handlePrintInvoice}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <Printer className="h-4 w-4 shrink-0" />
          Print invoice
        </button>
      </div>

      <OrderAdminEditor
        order={order as Parameters<typeof OrderAdminEditor>[0]["order"]}
        onSaved={(updated) => setOrder((prev) => ({ ...prev, ...updated }))}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:gap-6 print:break-inside-avoid">
        {/* Left Column: Items & Payment */}
        <div className="lg:col-span-2 space-y-8 print:space-y-6">
          
          {/* Order Items */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden print:shadow-none print:border-slate-300">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Items ({order.items?.length || 0})
              </h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {order.items?.map((item: any) => (
                <div key={item.id} className="p-6 flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex-shrink-0">
                    <img src={item.product?.thumbnail_url} alt={item.product?.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.product?.name}</p>
                    <p className="text-xs text-slate-500 mt-1">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">${(Number(item.unit_price) * item.quantity).toFixed(2)}</p>
                    <p className="text-xs text-slate-500 mt-1">${Number(item.unit_price).toFixed(2)} / unit</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-900 dark:text-white">${Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span className="font-medium text-slate-900 dark:text-white">${Number(order.shipping_cost).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-3 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-900 dark:text-white">Total</span>
                <span className="text-primary">${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment & Shipping Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                    order.payment_status === 'PAID' ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                  )}>
                    {order.payment_status}
                  </span>
                </div>
                {order.payment_method ? (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Selected method</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {paymentMethodLabel(order.payment_method)}
                    </p>
                    <p className="text-xs text-slate-500">
                      Manual / offline settlement — mark as PAID in your records when funds are received.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic">No payment method was stored for this order.</p>
                )}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Shipping Method
              </h3>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {order.shipping_method === 'express' ? 'Priority Express' : 'Standard Shipping'}
                </p>
                <p className="text-xs text-slate-500">
                  {order.shipping_method === 'express'
                    ? '1–2 business days (priority)'
                    : 'Delivery within 3–5 business days'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Info */}
        <div className="space-y-8">
          {/* Customer Profile */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Customer Details
            </h3>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  {order.shipping_address_json?.fullName || order.contact_email?.split("@")[0] || "Guest checkout"}
                </p>
                <p className="text-xs text-slate-500">
                  Order placed {order.created_at ? new Date(order.created_at).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>{order.contact_email || "—"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{order.contact_phone || "No phone provided"}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Shipping Address
            </h3>
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">
                {order.shipping_address_json?.fullName || "Shipping recipient"}
              </p>
              {order.shipping_address_json ? (
                <>
                  <p>{order.shipping_address_json.address}</p>
                  <p>{order.shipping_address_json.city}, {order.shipping_address_json.state} {order.shipping_address_json.zip}</p>
                  <p>{order.shipping_address_json.country}</p>
                </>
              ) : (
                <p className="italic">No address information provided.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
