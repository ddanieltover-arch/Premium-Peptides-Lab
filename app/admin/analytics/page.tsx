'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  ArrowUpRight,
  DollarSign,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { adminApiJson } from '@/lib/admin/fetch';

type RangeMode = 'week' | 'month';

function localDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseOrderDateKey(iso: string): string {
  const d = new Date(iso);
  return localDateKey(d);
}

/** Last `n` calendar days ending today (local), oldest first. */
function rollingDayKeys(n: number): string[] {
  const keys: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    keys.push(localDateKey(d));
  }
  return keys;
}

function pctChangeLabel(current: number, previous: number): { text: string; trend: 'up' | 'down' | 'flat' } {
  if (previous === 0 && current === 0) return { text: '—', trend: 'flat' };
  if (previous === 0) return { text: '+100%', trend: 'up' };
  const p = ((current - previous) / previous) * 100;
  const rounded = Math.round(p * 10) / 10;
  if (Math.abs(rounded) < 0.05) return { text: '0%', trend: 'flat' };
  const sign = rounded > 0 ? '+' : '';
  return {
    text: `${sign}${rounded}%`,
    trend: rounded > 0 ? 'up' : 'down',
  };
}

function formatMoney(n: number): string {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<RangeMode>('month');
  const [stats, setStats] = useState<
    Array<{
      label: string;
      value: string;
      change: string;
      icon: typeof DollarSign;
      trend: 'up' | 'down' | 'flat';
    }>
  >([]);
  const [topProducts, setTopProducts] = useState<
    Array<{ id: string; name: string; units: number; revenue: number }>
  >([]);
  const [chartOrders, setChartOrders] = useState<Array<{ total: unknown; created_at: string }>>([]);

  useEffect(() => {
    void fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    setLoading(true);
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const sixtyDaysAgo = new Date(now);
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const { orders, customers: customersRows, orderItems } = await adminApiJson<{
        orders: Array<{ total: unknown; created_at: string }>;
        customers: Array<{ created_at: string }>;
        orderItems: Array<{
          product_id: string;
          quantity: unknown;
          unit_price: unknown;
          product: { name: string } | { name: string }[] | null;
        }>;
      }>('/api/admin/analytics');

      const customerCount = customersRows.length;
      const custLast30 = customersRows.filter((c) => new Date(c.created_at) >= thirtyDaysAgo).length;
      const custPrev30 = customersRows.filter((c) => {
        const t = new Date(c.created_at);
        return t >= sixtyDaysAgo && t < thirtyDaysAgo;
      }).length;

      const ordersLast30 = orders.filter((o) => new Date(o.created_at) >= thirtyDaysAgo);
      const newOrdersCount = ordersLast30.length;

      const revenueLast30 = ordersLast30.reduce((acc, o) => acc + Number(o.total ?? 0), 0);
      const ordersPrev30 = orders.filter((o) => {
        const t = new Date(o.created_at);
        return t >= sixtyDaysAgo && t < thirtyDaysAgo;
      });
      const revenuePrev30 = ordersPrev30.reduce((acc, o) => acc + Number(o.total ?? 0), 0);

      const ordersPrev30Count = ordersPrev30.length;

      const revDelta = pctChangeLabel(revenueLast30, revenuePrev30);
      const ordDelta = pctChangeLabel(newOrdersCount, ordersPrev30Count);
      const custDelta = pctChangeLabel(custLast30, custPrev30);
      const aovCurrent =
        ordersLast30.length > 0 ? revenueLast30 / ordersLast30.length : 0;
      const aovPrev =
        ordersPrev30.length > 0 ? revenuePrev30 / ordersPrev30.length : 0;
      const aovDelta = pctChangeLabel(aovCurrent, aovPrev);

      setStats([
        {
          label: 'Revenue (30d)',
          value: formatMoney(revenueLast30),
          change: revDelta.text,
          icon: DollarSign,
          trend: revDelta.trend === 'flat' ? 'up' : revDelta.trend,
        },
        {
          label: 'Customers',
          value: customerCount.toLocaleString(),
          change: custDelta.text,
          icon: Users,
          trend: custDelta.trend === 'flat' ? 'up' : custDelta.trend,
        },
        {
          label: 'Orders (30d)',
          value: newOrdersCount.toLocaleString(),
          change: ordDelta.text,
          icon: ShoppingBag,
          trend: ordDelta.trend === 'flat' ? 'up' : ordDelta.trend,
        },
        {
          label: 'Avg. order (30d)',
          value: `$${aovCurrent.toFixed(2)}`,
          change: aovDelta.text,
          icon: TrendingUp,
          trend: aovDelta.trend === 'flat' ? 'up' : aovDelta.trend,
        },
      ]);

      // Top products by order_lines (quantity × unit_price), grouped by product_id
      const agg = new Map<string, { name: string; units: number; revenue: number }>();
      for (const row of orderItems) {
        const qty = Number(row.quantity ?? 0);
        const unit = Number(row.unit_price ?? 0);
        const rev = qty * unit;
        const raw = row.product as { name?: string } | null;
        const name =
          raw && !Array.isArray(raw)
            ? raw.name ?? 'Unknown'
            : Array.isArray(raw) && raw[0]
              ? raw[0].name ?? 'Unknown'
              : 'Unknown';
        const id = row.product_id;
        const cur = agg.get(id) || { name, units: 0, revenue: 0 };
        cur.units += qty;
        cur.revenue += rev;
        cur.name = name;
        agg.set(id, cur);
      }
      const top = Array.from(agg.entries())
        .sort((a, b) => b[1].revenue - a[1].revenue)
        .slice(0, 8)
        .map(([id, row]) => ({ id, ...row }));
      setTopProducts(top);

      // Chart series built after orders in memory — recomputed when range toggles via useMemo below
      setChartOrders(orders);
    } catch (error) {
      console.error('Analytics error:', error);
    } finally {
      setLoading(false);
    }
  }

  const chartData = useMemo(() => {
    const days = range === 'week' ? 7 : 30;
    const keys = rollingDayKeys(days);
    const revenueByDay: Record<string, number> = {};
    for (const k of keys) revenueByDay[k] = 0;

    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - (days - 1));

    for (const o of chartOrders) {
      const t = new Date(o.created_at);
      if (t < cutoff) continue;
      const key = parseOrderDateKey(o.created_at);
      if (revenueByDay[key] === undefined) continue;
      revenueByDay[key] += Number(o.total ?? 0);
    }

    const maxRev = Math.max(...keys.map((k) => revenueByDay[k]), 1);

    return keys.map((key, i) => {
      const rev = revenueByDay[key];
      const d = new Date(key + 'T12:00:00');
      let label: string;
      if (range === 'week') {
        label = d.toLocaleDateString(undefined, { weekday: 'short' });
      } else {
        label =
          days > 14 && i % 5 !== 0 && i !== keys.length - 1
            ? ''
            : String(d.getDate());
      }
      return {
        key,
        label,
        revenue: rev,
        pct: (rev / maxRev) * 100,
      };
    });
  }, [chartOrders, range]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Revenue and sales from live <code className="text-xs">orders</code> and{' '}
            <code className="text-xs">order_items</code>. Comparison uses the prior 30-day window.
          </p>
        </div>
        {loading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <stat.icon className="h-5 w-5" />
              </div>
              <div
                className={cn(
                  'flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full',
                  stat.trend === 'down'
                    ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                    : stat.change === '—'
                      ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                )}
              >
                {stat.change}
                <ArrowUpRight
                  className={cn('h-3 w-3', stat.trend === 'down' && 'rotate-90')}
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Order revenue</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRange('week')}
                className={cn(
                  'px-3 py-1 text-xs font-bold rounded-lg transition-colors',
                  range === 'week'
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                )}
              >
                7 days
              </button>
              <button
                type="button"
                onClick={() => setRange('month')}
                className={cn(
                  'px-3 py-1 text-xs font-bold rounded-lg transition-colors',
                  range === 'month'
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                )}
              >
                30 days
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-[280px]">
            {chartData.length === 0 ? (
              <p className="text-sm text-slate-500 m-auto">No orders in this range.</p>
            ) : (
              <>
                <div className="flex-1 flex items-end justify-between gap-1 sm:gap-2 pt-4 min-h-[220px] border-b border-slate-100 dark:border-slate-800">
                  {chartData.map((bar) => (
                    <div
                      key={bar.key}
                      className="flex-1 flex flex-col items-center gap-2 group min-w-0"
                      title={`${bar.key}: ${formatMoney(bar.revenue)}`}
                    >
                      <div className="w-full flex flex-col items-center justify-end h-[200px]">
                        <div
                          className="w-full max-w-[48px] mx-auto bg-primary/25 hover:bg-primary rounded-t-lg transition-all duration-300 min-h-[6px]"
                          style={{ height: `${Math.max(bar.pct, 2)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate w-full text-center">
                        {bar.label || '·'}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  Bar height scales to the largest day in range. Hover a bar for date and amount.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Top products</h3>
          <p className="text-xs text-slate-500 mb-6">By line revenue (Σ qty × unit price)</p>
          <div className="space-y-5 flex-1">
            {topProducts.length === 0 ? (
              <p className="text-sm text-slate-500">No order lines yet.</p>
            ) : (
              topProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between gap-3 group">
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
                      {product.name}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {product.units.toLocaleString()} units
                    </span>
                  </div>
                  <span className="text-sm font-black text-slate-900 dark:text-white shrink-0 tabular-nums">
                    {formatMoney(product.revenue)}
                  </span>
                </div>
              ))
            )}
          </div>
          <Link
            href="/admin/orders"
            className="mt-8 w-full py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-center block"
          >
            View orders
          </Link>
        </div>
      </div>
    </div>
  );
}
