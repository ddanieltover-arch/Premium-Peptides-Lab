import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
for f in list((ROOT / "app/admin").rglob("*.tsx")) + list((ROOT / "components/admin").rglob("*.tsx")):
    t = f.read_text(encoding="utf-8")
    if "supabase" not in t:
        continue
    t = t.replace(
        'import { supabase } from "@/lib/supabase/client";',
        'import { createClient } from "@/lib/supabase/client";',
    )
    t = re.sub(r"\bsupabase\.", "createClient().", t)
    f.write_text(t, encoding="utf-8")
    print("fixed", f.relative_to(ROOT))
