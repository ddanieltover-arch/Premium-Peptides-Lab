# Migrating to your own Supabase project (Premium Peptides Lab)

You already have **SQL migrations and schema** under the legacy app:

`precision-health-store/supabase/`

The new storefront (`pharma-ecommerce-rebrand/`) will point at a **new** Supabase project via `NEXT_PUBLIC_SUPABASE_URL` and keys. Below are practical ways to move **Postgres (public schema)**, **Auth**, **Storage**, and **runtime config** without redoing your data model.

---

## Choose a strategy

| Strategy | Best when | Notes |
|----------|-----------|--------|
| **A. Logical replay** | You trust the repo SQL as the full story, or prod ≈ repo | Create empty project → run scripts in order (below) → load data (CSV/API/dump). |
| **B. `pg_dump` / restore (public only)** | Production DB has changes not in git | Dump from **source** DB connection string → restore into **target** (extensions + order matter). |
| **C. Supabase Dashboard “Backups / restore”** | Same org / plan supports restore to new project | Use host’s docs for point-in-time or backup import (varies by tier). |

Most teams: **B** if production is source of truth, **A** if repo + seeds are enough for a clean relaunch.

---

## 1. Postgres: `public` schema (tables you said you’re keeping)

### Option A — Replay repo SQL (greenfield DB)

Run in the **new** project’s **SQL Editor** in a sensible order (resolve errors if a file overlaps `schema.sql`):

1. `schema.sql` — core tables, triggers, `get_public_order`, baseline `audit_logs` + RLS on audit (last section of file).
2. `add_order_checkout_fields.sql`
3. `add_customers_sync.sql`
4. `repair_customers_checkout_columns.sql`
5. `v_product_prices_view.sql`
6. `get_public_order_rpc.sql` — safe re-run (`create or replace`); skip if identical to what `schema.sql` already applied.
7. `audit_logs.sql` — **skip or verify**: may duplicate objects already in `schema.sql`; use only if your `schema.sql` predates this file.
8. `rls.sql`
9. `rls_admin_orders.sql`
10. `rls_admin_mutations.sql`
11. `fix_checkout_orders_rls.sql`
12. `storage_catalog_heroes.sql` — storage **policies** (after buckets exist; see §3).

Then run **`seed_products.sql`** only on non-production or if you want demo data.

### Option B — Copy live data (recommended if shop’s been live)

1. In **source** Supabase: **Database → Connection string** (use **pooler** or direct as appropriate).
2. Dump **schema + data** for `public` only:

   ```bash
   pg_dump "$SOURCE_DATABASE_URL" \
     --schema=public \
     --no-owner --no-acl \
     -Fc -f public_schema_data.dump
   ```

   Or schema-only first, then data-only, if you need to adjust extensions on the target first.

3. In **target** Supabase: ensure extensions used by your schema exist (e.g. `pgcrypto` from `schema.sql`).

   ```sql
   create extension if not exists "pgcrypto";
   ```

4. Restore:

   ```bash
   pg_restore --clean --if-exists --no-owner \
     -d "$TARGET_DATABASE_URL" public_schema_data.dump
   ```

5. **Re-apply RLS policy files** if the dump omitted them or you use a partial dump — match whatever production relied on (`rls*.sql`).

**Do not** blindly restore the **`auth`**, **`storage`, or `realtime` internal schemas** unless Supabase support confirms it’s supported for your plan—`auth.users` is special.

---

## 2. Auth (`auth.users` and sessions)

Supabase Auth is tied to the project’s JWT secret and `auth` schema. **Users don’t auto-migrate** when you only copy `public`.

Options:

1. **User re-registration / password reset** — simplest operationally; historical `orders.customer_id` / email still match if you migrate `public` rows by id.
2. **Auth export/import script** — use **Admin API** (`auth.admin.listUsers` + create users with `email_confirm` true) for each user; may need password reset emails unless you import hashes (Supabase documents **migrate users** patterns in their docs).
3. **Same-org database clone** — if Supabase offers a **project clone / fork** for your team, that can copy Auth + DB together—check your dashboard.

Plan: if you need **zero friction** for existing logins, prioritize a **clone** or **consult Supabase migration guide for auth**; if a short **password reset** window is OK, migrate `public` only and invite users.

---

## 3. Storage (COAs, catalog images, etc.)

1. In **source**: note **bucket names** and paths referenced in `products.thumbnail_url`, `images.url`, etc.
2. Create **same bucket names** in the **target** project.
3. Copy objects:

   - Download/re-upload with a small script (S3-compatible API or `supabase storage` CLI if you use it), **or**
   - `rclone` / AWS CLI if buckets are exportable.

4. Re-run `storage_catalog_heroes.sql` (or equivalent) on **target** so **RLS policies** on `storage.objects` match.

5. **Update URLs** in DB if public URLs change (Supabase project ref differs → new base URL). Consider env-based base URL in app code and stored paths as **relative** keys where possible.

---

## 4. Edge Functions, webhooks, cron

- **Redeploy** functions from your repo to the **new** project (`supabase functions deploy`).
- Recreate **database webhooks**, **scheduled jobs**, and **third-party webhook URLs** (Stripe, etc.) to hit **new** API routes or function endpoints.
- Rotate secrets in the new project’s **Vault / env**.

---

## 5. Application cutover

1. Create **new** anon + service role keys; put them in `.env.local` / hosting (see `pharma-ecommerce-rebrand/.env.example`).
2. Point **DNS** for `premiumpeptideslab.online` at the new storefront hosting when ready.
3. If **old** and **new** run in parallel briefly: use **read-only** on old DB or feature-flag checkout on new only to avoid **split inventory**.
4. Document **order numbers** continuity (if `order_number` must stay unique across systems, avoid resetting sequences incorrectly after import).

---

## 6. Wholesale tiers (your Phase 2 contract)

If wholesale isn’t in the legacy `schema.sql` yet, add migrations **only on the new project** (or add to repo and run after data import):

- `profiles` / tier FK / `wholesale_prices` (whatever you land on), then **one** server-side price resolver used by PDP + cart + checkout.

Keep RLS in lockstep with the new tables.

---

## 7. Checklist (summary)

- [ ] New Supabase project created  
- [ ] `pgcrypto` (and any other extensions) enabled on target  
- [ ] `public` schema + data migrated (dump or SQL replay)  
- [ ] RLS policies verified (`rls*.sql` vs production)  
- [ ] Auth path chosen (clone vs import vs reset passwords)  
- [ ] Storage buckets + files + policies  
- [ ] Edge functions + webhooks + secrets  
- [ ] Next app env vars switched; smoke test catalog, cart, order, COA links  
- [ ] Fill **`references/supabase-schema-note.md`** in the rebrand repo with final table list for the team  

---

## References

- [Supabase: Import data](https://supabase.com/docs/guides/database/import-data) (general Postgres patterns)  
- Your legacy SQL source: `precision-health-store/supabase/`  
- Integration patterns: `pharma-ecommerce-rebrand/references/phase-2-architecture.md`  
