"""Patch analytics, audit-logs, settings for rebrand."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def patch_analytics():
    p = ROOT / "app/admin/analytics/page.tsx"
    t = p.read_text(encoding="utf-8")
    t = t.replace("@/lib/utils", "@/lib/cn")
    t = t.replace('import { supabase } from "@/lib/supabase";\n', "")
    t = t.replace("import { adminApiJson } from '@/lib/admin-fetch';", "import { adminApiJson } from '@/lib/admin/fetch';")
    old_fetch = """async function fetchAllRows<T>(table: string, select: string): Promise<T[]> {
  const pageSize = 1000;
  let from = 0;
  const out: T[] = [];
  while (true) {
    const q = supabase.from(table).select(select);
    const { data, error } = await q.range(from, from + pageSize - 1);
    if (error) throw new Error(error.message);
    const chunk = (data as T[]) || [];
    out.push(...chunk);
    if (chunk.length < pageSize) break;
    from += pageSize;
  }
  return out;
}

"""
    t = t.replace(old_fetch, "")
    old_analytics_fetch = """      const [orders, customersRows, orderItems] = await Promise.all([
        adminApiJson<{ orders: Array<{ total: unknown; created_at: string }> }>(
          '/api/admin/orders?slim=1'
        ).then((r) => r.orders ?? []),
        fetchAllRows<{ created_at: string }>('customers', 'created_at'),
        fetchAllRows<{
          product_id: string;
          quantity: unknown;
          unit_price: unknown;
          product: { name: string } | { name: string }[] | null;
        }>('order_items', 'product_id, quantity, unit_price, product:products(name)'),
      ]);

      const customerCount = customersRows.length;
      const custLast30 = customersRows.filter((c) => new Date(c.created_at) >= thirtyDaysAgo).length;
      const custPrev30 = customersRows.filter((c) => {
"""
    new_analytics_fetch = """      const { orders, customers: customersRows, orderItems } = await adminApiJson<{
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
"""
    t = t.replace(old_analytics_fetch, new_analytics_fetch)
    p.write_text(t, encoding="utf-8")
    print("patched analytics")


def patch_audit_logs():
    p = ROOT / "app/admin/audit-logs/page.tsx"
    t = p.read_text(encoding="utf-8")
    t = t.replace("@/lib/utils", "@/lib/cn")
    t = t.replace('import { supabase } from "@/lib/supabase";', 'import { adminApiJson } from "@/lib/admin/fetch";')
    old = """    const { data, error: qErr } = await supabase
      .from("audit_logs")
      .select("id,created_at,action,entity_type,entity_id,actor_id,actor_email,metadata")
      .order("created_at", { ascending: false })
      .limit(400);

    if (qErr) {
      setError(qErr.message);
      setRows([]);
    } else {
      setRows((data as AuditRow[]) || []);
    }
"""
    new = """    try {
      const { logs } = await adminApiJson<{ logs: AuditRow[] }>("/api/admin/audit-logs");
      setRows(logs);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load audit logs");
      setRows([]);
    }
"""
    t = t.replace(old, new)
    p.write_text(t, encoding="utf-8")
    print("patched audit-logs")


def patch_settings():
    p = ROOT / "app/admin/settings/page.tsx"
    t = p.read_text(encoding="utf-8")
    t = t.replace("@/lib/utils", "@/lib/cn")
    t = t.replace("Precision Health Research", "Premium Peptides Lab")
    t = t.replace("info@ph-research.store", "support@premiumpeptideslab.online")
    t = t.replace("precision health platform", "storefront")
    p.write_text(t, encoding="utf-8")
    print("patched settings")


if __name__ == "__main__":
    patch_analytics()
    patch_audit_logs()
    patch_settings()
