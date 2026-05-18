from pathlib import Path

p = Path(__file__).resolve().parents[1] / "app/admin/orders/[id]/page.tsx"
t = p.read_text(encoding="utf-8")

title_start = t.index("      {/* Title row */}")
grid_start = t.index('      <div className="grid grid-cols-1 lg:grid-cols-3')

replacement = '''      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between print:hidden">
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
                Order #{String(order.order_number)}
              </h1>
              <span
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
                  statusColors[String(order.status)] || "bg-slate-100",
                )}
              >
                {String(order.status)}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Placed on {new Date(String(order.created_at)).toLocaleString()}
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
        onSaved={(updated) => setOrder({ ...order, ...updated })}
      />

'''

t = t[:title_start] + replacement + t[grid_start:]
p.write_text(t, encoding="utf-8")
print("patched order page")
