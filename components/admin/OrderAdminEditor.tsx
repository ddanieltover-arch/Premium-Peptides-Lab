"use client";

import React, { useEffect, useState } from "react";
import { ClipboardList, Loader2, RotateCcw, Save } from "lucide-react";
import { cn } from "@/lib/cn";
import { adminApiJson } from "@/lib/admin/fetch";
import { createClient } from "@/lib/supabase/client";
import { PAYMENT_METHOD_IDS, PAYMENT_METHOD_LABELS } from "@/lib/checkout/payment-methods";

type ShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

type OrderRecord = {
  id: string;
  status: string;
  payment_status: string;
  payment_method: string | null;
  shipping_method: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  notes: string | null;
  subtotal: number;
  shipping_cost: number;
  total: number;
  shipping_address_json: ShippingAddress | null;
};

function addressFromOrder(order: OrderRecord): ShippingAddress {
  const a = order.shipping_address_json;
  return {
    fullName: a?.fullName ?? "",
    address: a?.address ?? "",
    city: a?.city ?? "",
    state: a?.state ?? "",
    zip: a?.zip ?? "",
    country: a?.country ?? "US",
  };
}

function snapshot(order: OrderRecord) {
  return JSON.stringify({
    status: order.status,
    payment_status: order.payment_status,
    payment_method: order.payment_method ?? "",
    shipping_method: order.shipping_method ?? "standard",
    contact_email: order.contact_email ?? "",
    contact_phone: order.contact_phone ?? "",
    notes: order.notes ?? "",
    subtotal: Number(order.subtotal),
    shipping_cost: Number(order.shipping_cost),
    total: Number(order.total),
    address: addressFromOrder(order),
  });
}

type Props = {
  order: OrderRecord;
  onSaved: (order: OrderRecord) => void;
};

export function OrderAdminEditor({ order, onSaved }: Props) {
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.payment_status);
  const [paymentMethod, setPaymentMethod] = useState(order.payment_method ?? "");
  const [shippingMethod, setShippingMethod] = useState(order.shipping_method ?? "standard");
  const [contactEmail, setContactEmail] = useState(order.contact_email ?? "");
  const [contactPhone, setContactPhone] = useState(order.contact_phone ?? "");
  const [notes, setNotes] = useState(order.notes ?? "");
  const [subtotal, setSubtotal] = useState(String(order.subtotal));
  const [shippingCost, setShippingCost] = useState(String(order.shipping_cost));
  const [total, setTotal] = useState(String(order.total));
  const [address, setAddress] = useState<ShippingAddress>(() => addressFromOrder(order));
  const [baseline, setBaseline] = useState(() => snapshot(order));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    setStatus(order.status);
    setPaymentStatus(order.payment_status);
    setPaymentMethod(order.payment_method ?? "");
    setShippingMethod(order.shipping_method ?? "standard");
    setContactEmail(order.contact_email ?? "");
    setContactPhone(order.contact_phone ?? "");
    setNotes(order.notes ?? "");
    setSubtotal(String(order.subtotal));
    setShippingCost(String(order.shipping_cost));
    setTotal(String(order.total));
    setAddress(addressFromOrder(order));
    setBaseline(snapshot(order));
    setMessage("idle");
  }, [order.id, order.status, order.payment_status, order.total]);

  const currentSnap = JSON.stringify({
    status,
    payment_status: paymentStatus,
    payment_method: paymentMethod,
    shipping_method: shippingMethod,
    contact_email: contactEmail,
    contact_phone: contactPhone,
    notes,
    subtotal: Number(subtotal),
    shipping_cost: Number(shippingCost),
    total: Number(total),
    address,
  });

  const dirty = currentSnap !== baseline;
  const statusChanged = status !== order.status;

  async function handleSave() {
    if (!dirty) return;
    setSaving(true);
    setMessage("idle");
    const previousStatus = order.status;

    const payload = {
      status,
      payment_status: paymentStatus,
      payment_method: paymentMethod || null,
      shipping_method: shippingMethod || null,
      contact_email: contactEmail || null,
      contact_phone: contactPhone || null,
      notes: notes || null,
      subtotal: Number(subtotal),
      shipping_cost: Number(shippingCost),
      total: Number(total),
      shipping_address_json: address,
    };

    try {
      const { order: updated } = await adminApiJson<{ order: OrderRecord }>(
        `/api/admin/orders/${order.id}`,
        { method: "PATCH", json: payload },
      );
      onSaved(updated);
      setBaseline(snapshot(updated));
      setMessage("saved");
      window.dispatchEvent(
        new CustomEvent("admin-order-updated", { detail: { id: updated.id, status: updated.status } }),
      );
      window.setTimeout(() => setMessage("idle"), 3500);

      if (statusChanged && status !== previousStatus) {
        try {
          const {
            data: { session },
          } = await createClient().auth.getSession();
          if (session?.access_token) {
            await fetch("/api/email/order-status", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({
                orderId: order.id,
                newStatus: status,
                previousStatus,
              }),
            });
          }
        } catch (e) {
          console.warn("[order-status email]", e);
        }
      }
    } catch (e: unknown) {
      setMessage("error");
      alert(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setStatus(order.status);
    setPaymentStatus(order.payment_status);
    setPaymentMethod(order.payment_method ?? "");
    setShippingMethod(order.shipping_method ?? "standard");
    setContactEmail(order.contact_email ?? "");
    setContactPhone(order.contact_phone ?? "");
    setNotes(order.notes ?? "");
    setSubtotal(String(order.subtotal));
    setShippingCost(String(order.shipping_cost));
    setTotal(String(order.total));
    setAddress(addressFromOrder(order));
    setMessage("idle");
  }

  const fieldClass =
    "h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white";

  return (
    <section
      className={cn(
        "rounded-2xl border bg-white p-4 sm:p-6 shadow-sm dark:bg-slate-900 print:hidden",
        dirty
          ? "border-amber-300/80 ring-1 ring-amber-200/60 dark:border-amber-700/50"
          : "border-slate-200 dark:border-slate-800",
      )}
      aria-label="Edit order"
    >
      <div className="mb-6 flex gap-3 sm:gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ClipboardList className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900 dark:text-white">
            Edit order
          </h2>
          <p className="mt-1 max-w-xl text-sm text-slate-600 dark:text-slate-400">
            Update fulfillment, payment, contact, totals, and shipping address. Changes are written to
            the database when you save.
          </p>
          {dirty && (
            <p className="mt-2 text-xs font-semibold text-amber-800 dark:text-amber-200">Unsaved changes</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Fulfillment status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={fieldClass}>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REFUNDED">Refunded</option>
            <option value="SUPPORT">Support</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Payment status</label>
          <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className={fieldClass}>
            <option value="UNPAID">Unpaid</option>
            <option value="PAID">Paid</option>
            <option value="PARTIAL">Partial</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Payment method</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={fieldClass}>
            <option value="">— None —</option>
            {PAYMENT_METHOD_IDS.map((id) => (
              <option key={id} value={id}>
                {PAYMENT_METHOD_LABELS[id]}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Shipping method</label>
          <select value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)} className={fieldClass}>
            <option value="standard">Standard</option>
            <option value="express">Express</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Contact email</label>
          <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className={fieldClass} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Contact phone</label>
          <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className={fieldClass} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Subtotal ($)</label>
          <input type="number" step="0.01" min="0" value={subtotal} onChange={(e) => setSubtotal(e.target.value)} className={fieldClass} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Shipping ($)</label>
          <input type="number" step="0.01" min="0" value={shippingCost} onChange={(e) => setShippingCost(e.target.value)} className={fieldClass} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Total ($)</label>
          <input type="number" step="0.01" min="0" value={total} onChange={(e) => setTotal(e.target.value)} className={fieldClass} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Internal notes</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            placeholder="Fulfillment notes visible to admins only…"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Shipping address</p>
        </div>
        <div className="space-y-2">
          <input
            placeholder="Full name"
            value={address.fullName}
            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
            className={fieldClass}
          />
        </div>
        <div className="space-y-2">
          <input
            placeholder="Country"
            value={address.country}
            onChange={(e) => setAddress({ ...address, country: e.target.value })}
            className={fieldClass}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <input
            placeholder="Street address"
            value={address.address}
            onChange={(e) => setAddress({ ...address, address: e.target.value })}
            className={fieldClass}
          />
        </div>
        <div className="space-y-2">
          <input
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            className={fieldClass}
          />
        </div>
        <div className="space-y-2">
          <input placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className={fieldClass} />
        </div>
        <div className="space-y-2">
          <input placeholder="ZIP" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} className={fieldClass} />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || saving}
          className={cn(
            "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold",
            dirty && !saving
              ? "bg-primary text-white shadow-md hover:bg-primary/90"
              : "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800",
          )}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save order
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={saving || !dirty}
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
        {message === "saved" && <span className="text-sm font-semibold text-emerald-600">Saved.</span>}
        {message === "error" && <span className="text-sm font-semibold text-red-600">Save failed.</span>}
      </div>
    </section>
  );
}
