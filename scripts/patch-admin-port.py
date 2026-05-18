from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REPLACEMENTS = [
    ("@/lib/utils", "@/lib/cn"),
    ("@/lib/supabase", "@/lib/supabase/client"),
    ("@/lib/admin-fetch", "@/lib/admin/fetch"),
    ("@/lib/paymentMethods", "@/lib/checkout/paymentMethods"),
    ("Precision Health Research", "Premium Peptides Lab"),
    ("PH Admin", "PPL Admin"),
    ("Admin Panel", "PPL Admin"),
    ("Sign in to manage your precision health store", "Sign in to manage Premium Peptides Lab"),
    ('<motionless-div className="flex h-8 w-8', '<div className="flex h-8 w-8'),
    ("            PH\n", "            PPL\n"),
]

files = list((ROOT / "app/admin").rglob("*.tsx")) + list((ROOT / "components/admin").rglob("*.tsx"))

for f in files:
    if f.name in ("AdminPortalLanding.tsx", "AdminAuthGuard.tsx"):
        continue
    t = f.read_text(encoding="utf-8")
    orig = t
    for a, b in REPLACEMENTS:
        t = t.replace(a, b)
    t = t.replace("@/lib/supabase/client/client", "@/lib/supabase/client")

    if f.name == "page.tsx" and "orders/[id]" in str(f).replace("\\", "/"):
        t = t.replace(
            "export default function OrderDetailsPage({ params }: { params: any }) {\n"
            "  const unwrappedParams: any = React.use(params);\n"
            "  const id = unwrappedParams.id;",
            "export default function OrderDetailsPage({ params }: { params: { id: string } }) {\n"
            "  const id = params.id;",
        )

    if f.name == "layout.tsx":
        if "AdminAuthGuard" not in t:
            t = t.replace(
                'import { cn } from "@/lib/cn";',
                'import { cn } from "@/lib/cn";\nimport { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";',
            )
            t = t.replace(
                "  return (\n    <div className=\"min-h-screen bg-slate-50 dark:bg-slate-950\">",
                "  return (\n    <AdminAuthGuard>\n    <motionless-div className=\"min-h-screen bg-slate-50 dark:bg-slate-950\">",
            )
            t = t.replace(
                "    </div>\n  );\n}",
                "    </motionless-div>\n    </AdminAuthGuard>\n  );\n}",
            )

    if f.name == "Sidebar.tsx":
        if "ADMIN_NAV_ITEMS" not in t:
            t = t.replace(
                'import { supabase } from "@/lib/supabase/client";',
                'import { supabase } from "@/lib/supabase/client";\nimport { ADMIN_NAV_ITEMS } from "@/lib/admin/nav";',
            )
            start = t.find("const menuItems = [")
            end = t.find("];", start) + 2
            if start != -1:
                t = (
                    t[:start]
                    + "const menuItems = ADMIN_NAV_ITEMS.map((item) => ({\n"
                    + "  icon: item.icon,\n"
                    + "  label: item.label,\n"
                    + "  href: item.href,\n"
                    + "}));\n"
                    + t[end:]
                )

    if f.name == "login/page.tsx":
        t = t.replace(
            'const [email, setEmail] = useState("researchprecisionhealth@gmail.com");',
            'const [email, setEmail] = useState("");',
        )

    if t != orig:
        f.write_text(t, encoding="utf-8")
        print("patched", f.relative_to(ROOT))

# fix motionless in layout
layout = ROOT / "app/admin/layout.tsx"
if layout.exists():
    lt = layout.read_text(encoding="utf-8").replace("motionless-div", "motionless-div")
    lt = lt.replace("motionless-div", "div")
    layout.write_text(lt, encoding="utf-8")
