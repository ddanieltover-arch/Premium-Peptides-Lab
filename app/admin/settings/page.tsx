'use client';

import { useEffect, useState } from 'react';
import {
  Globe,
  Lock,
  Bell,
  Database,
  CreditCard,
  Save,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { adminApiJson } from '@/lib/admin/fetch';
import { PAYMENT_METHOD_IDS, PAYMENT_METHOD_LABELS } from '@/lib/checkout/payment-methods';
import type { StoreSettingsBundle } from '@/lib/admin/store-settings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tableMissing, setTableMissing] = useState(false);
  const [settings, setSettings] = useState<StoreSettingsBundle | null>(null);

  useEffect(() => {
    void loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApiJson<{
        settings: StoreSettingsBundle;
        tableMissing?: boolean;
      }>('/api/admin/settings');
      setSettings(res.settings);
      setTableMissing(!!res.tableMissing);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load settings');
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!settings) return;
    setIsSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await adminApiJson<{ settings: StoreSettingsBundle }>('/api/admin/settings', {
        method: 'PATCH',
        json: settings,
      });
      setSettings(res.settings);
      setSaved(true);
      setTableMissing(false);
      window.setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    }
    setIsSaving(false);
  }

  function togglePaymentMethod(id: string) {
    if (!settings) return;
    const enabled = new Set(settings.payments.enabledMethods);
    if (enabled.has(id)) {
      if (enabled.size <= 1) return;
      enabled.delete(id);
    } else {
      enabled.add(id);
    }
    setSettings({
      ...settings,
      payments: { enabledMethods: PAYMENT_METHOD_IDS.filter((m) => enabled.has(m)) },
    });
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'payment', label: 'Payments', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'database', label: 'Operations', icon: Database },
  ];

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white';

  if (loading || !settings) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Store name, checkout payment methods, and notification defaults — saved to Supabase.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            'flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all',
            saved
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90',
          )}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saved ? 'Saved' : isSaving ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      {tableMissing && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          Run <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/60">supabase/store_settings.sql</code> in
          the SQL editor to persist settings. Showing defaults until then.
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all',
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md shadow-primary/10'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white',
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </aside>

        <main className="space-y-6 lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="border-b border-slate-100 pb-4 text-lg font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                  Store configuration
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Store name
                    </label>
                    <input
                      type="text"
                      value={settings.general.storeName}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          general: { ...settings.general, storeName: e.target.value },
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Support email
                    </label>
                    <input
                      type="email"
                      value={settings.general.supportEmail}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          general: { ...settings.general, supportEmail: e.target.value },
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Site URL
                    </label>
                    <input
                      type="url"
                      value={settings.general.siteUrl}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          general: { ...settings.general, siteUrl: e.target.value },
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Compliance statement
                    </label>
                    <textarea
                      rows={3}
                      value={settings.general.complianceStatement}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          general: { ...settings.general, complianceStatement: e.target.value },
                        })
                      }
                      className={cn(inputClass, 'resize-none')}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h3 className="border-b border-slate-100 pb-4 text-lg font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                  Checkout payment methods
                </h3>
                <p className="text-sm text-slate-500">
                  Enabled methods appear on checkout. At least one must stay on.
                </p>
                <div className="space-y-3">
                  {PAYMENT_METHOD_IDS.map((id) => {
                    const on = settings.payments.enabledMethods.includes(id);
                    return (
                      <label
                        key={id}
                        className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/50"
                      >
                        <span className="font-bold text-slate-900 dark:text-white">
                          {PAYMENT_METHOD_LABELS[id]}
                        </span>
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => togglePaymentMethod(id)}
                          className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="border-b border-slate-100 pb-4 text-lg font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                  Email notifications
                </h3>
                <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Order confirmation emails</p>
                    <p className="text-sm text-slate-500">Send when checkout completes (requires SMTP env).</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.orderConfirmationEmail}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          orderConfirmationEmail: e.target.checked,
                        },
                      })
                    }
                    className="h-5 w-5 rounded border-slate-300 text-primary"
                  />
                </label>
                <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Status update emails</p>
                    <p className="text-sm text-slate-500">Send when admin changes fulfillment status.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.orderStatusEmail}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          orderStatusEmail: e.target.checked,
                        },
                      })
                    }
                    className="h-5 w-5 rounded border-slate-300 text-primary"
                  />
                </label>
              </div>
            )}

            {activeTab === 'database' && (
              <div className="space-y-6">
                <h3 className="border-b border-slate-100 pb-4 text-lg font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                  Operations
                </h3>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Scraper log retention (days)</p>
                    <p className="text-sm text-slate-500">Reference value for future log purge jobs.</p>
                  </div>
                  <select
                    value={settings.operations.scraperLogRetentionDays}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        operations: {
                          ...settings.operations,
                          scraperLogRetentionDays: Number(e.target.value),
                        },
                      })
                    }
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold dark:border-slate-800 dark:bg-slate-950"
                  >
                    <option value={7}>7 days</option>
                    <option value={30}>30 days</option>
                    <option value={90}>90 days</option>
                    <option value={365}>365 days</option>
                  </select>
                </div>
                <p className="text-xs text-slate-500">
                  Products and orders are edited under{' '}
                  <a href="/admin/products" className="font-semibold text-primary hover:underline">
                    Products
                  </a>{' '}
                  and{' '}
                  <a href="/admin/orders" className="font-semibold text-primary hover:underline">
                    Orders
                  </a>
                  .
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
