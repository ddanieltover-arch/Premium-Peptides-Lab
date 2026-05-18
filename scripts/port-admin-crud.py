"""Patch copied legacy admin CRUD files for rebrand conventions."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def patch_file(path: Path) -> None:
    if not path.exists():
        print("skip", path)
        return
    t = path.read_text(encoding="utf-8")
    t = t.replace("@/lib/utils", "@/lib/cn")
    t = t.replace('import { supabase } from "@/lib/supabase";', 'import { createClient } from "@/lib/supabase/client";')
    t = re.sub(r"\bsupabase\.", "createClient().", t)
    path.write_text(t, encoding="utf-8")
    print("patched", path.relative_to(ROOT))

for p in [
    ROOT / "components/admin/ProductForm.tsx",
    ROOT / "app/admin/products/page.tsx",
    ROOT / "app/admin/categories/page.tsx",
    ROOT / "app/admin/customers/page.tsx",
    ROOT / "app/admin/products/new/page.tsx",
]:
    patch_file(p)
