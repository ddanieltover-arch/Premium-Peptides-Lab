"use client";

import React, { useEffect, useMemo, useState } from "react";
import { RefreshCw, ChevronDown, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { adminApiJson } from "@/lib/admin/fetch";

type AuditRow = {
  id: string;
  created_at: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  actor_id: string | null;
  actor_email: string | null;
  metadata: Record<string, unknown>;
};

function formatShortId(id: string | null | undefined) {
  if (!id) return "—";
  return id.length > 12 ? `${id.slice(0, 8)}…` : id;
}

export default function AuditLogsPage() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  async function fetchLogs() {
    setLoading(true);
    setError(null);
    try {
      const { logs } = await adminApiJson<{ logs: AuditRow[] }>("/api/admin/audit-logs");
      setRows(logs);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load audit logs");
      setRows([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    void fetchLogs();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const blob = [
        r.action,
        r.entity_type,
        r.entity_id ?? "",
        r.actor_email ?? "",
        r.actor_id ?? "",
        JSON.stringify(r.metadata ?? {}),
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [rows, query]);

  function toggleExpand(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Audit log</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Database changes to orders, products, and categories (latest 400 entries). Actor is set when
            the change runs with a logged-in Supabase session.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void fetchLogs()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Refresh
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Filter by action, table, email, id, JSON…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-900"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error}
          <span className="block mt-1 text-xs opacity-90">
            Run <code className="rounded bg-red-100 px-1 dark:bg-red-900/60">supabase/audit_logs.sql</code> in the
            SQL editor if this table does not exist yet.
          </span>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">When</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Action</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Entity</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Actor</th>
                <th className="px-4 py-3 w-10" aria-hidden />
              </tr>
            </thead>
            <tbody>
              {loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-slate-500">
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-slate-500">
                    No audit entries match your filter.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <React.Fragment key={r.id}>
                    <tr className="border-b border-slate-100 hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-400 tabular-nums">
                        {new Date(r.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-800 dark:text-slate-200">
                        {r.action}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-900 dark:text-white">{r.entity_type}</span>
                        <span className="ml-2 font-mono text-xs text-slate-500" title={r.entity_id ?? undefined}>
                          {formatShortId(r.entity_id)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {r.actor_email || (
                          <span className="text-slate-400 italic">Anonymous / system</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggleExpand(r.id)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                          aria-expanded={!!expanded[r.id]}
                          aria-label={expanded[r.id] ? "Collapse details" : "Expand details"}
                        >
                          {expanded[r.id] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expanded[r.id] && (
                      <tr className="border-b border-slate-100 bg-slate-50/90 dark:border-slate-800 dark:bg-slate-950/50">
                        <td colSpan={5} className="px-4 py-4">
                          <pre className="max-h-72 overflow-auto rounded-lg border border-slate-200 bg-white p-4 text-xs font-mono text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                            {JSON.stringify(r.metadata, null, 2)}
                          </pre>
                          {r.actor_id && (
                            <p className="mt-2 text-xs text-slate-500 font-mono">Actor id: {r.actor_id}</p>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Showing {filtered.length} of {rows.length} loaded entries. New checkouts and admin edits appear here
        automatically after triggers are installed.
      </p>
    </div>
  );
}
