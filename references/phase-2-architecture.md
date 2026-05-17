# Phase 2 — Architecture (Premium Peptides Lab)

This document locks **integration boundaries**, **Supabase usage patterns**, **wholesale semantics**, and **route / feature parity** before further UI splits or data wiring.

**Reference storefront (IA + features only, not visuals):** [https://www.ph-research.store/](https://www.ph-research.store/)  
**Live brand domain:** [https://premiumpeptideslab.online](https://premiumpeptideslab.online)  
**Design tokens:** `lib/design-system.ts` · **Checklist:** `PROJECT-CHECKLIST.md`

---

## 1. Systems that must not break

Treat these as contracts while replacing all Precision-era **layouts** and **visual patterns**.

| System | Risk if mishandled | Safeguard |
|--------|-------------------|-----------|
| **Supabase Auth** (users, sessions, JWT refresh) | Checkout / account dead ends | Use official `@supabase/ssr` + `createServerClient` / `createBrowserClient`; never stash service role in client bundles. |
| **Row Level Security (RLS)** | Data leaks or “empty” catalog for valid users | All new queries must respect existing policies; test as `anon`, `authenticated`, and wholesale roles. |
| **Product / variant / inventory tables** | Wrong price, oversell, broken PDP | Read-only UI first; writes only through existing RPCs or APIs you already use. |
| **Wholesale tier resolution** | Illegal pricing, margin errors | Single server-side resolver for “effective price” per cart line (see §3). |
| **Cart & checkout** (Stripe / manual rails / webhooks) | Double charge, orphaned orders | Reskin only; preserve server actions / API routes / webhook handlers. |
| **Orders & admin** | Lost fulfillment state | No schema renames without migration; admin uses same Supabase project. |
| **Email / notifications** | Compliance & receipt gaps | Keep templates; update branding HTML/CSS only. |
| **SEO** (canonical URLs, sitemap sources) | Ranking / duplicate content | Preserve URL slugs or implement redirects table + `next.config` redirects from old host if needed. |
| **Storage** (COA PDFs, assets) | Broken COA links | Keep bucket paths; update public links if domain change only via env/config. |
| **Edge Functions / DB webhooks** | Async order / inventory drift | Document each function’s trigger; avoid renaming payload fields consumers expect. |

**Action before heavy integration:** export or document current **ERD** (or list of core tables + key columns) from Supabase and attach here or `references/supabase-schema-note.md` when available.

---

## 2. Next.js ↔ Supabase integration strategy

### 2.1 Runtime boundaries

| Context | Client | Use for |
|---------|--------|---------|
| **Browser** | `createBrowserClient` (`@supabase/ssr`) | Auth state, non-sensitive reads where RLS allows, realtime (if used). |
| **Server Components / RSC** | `createServerClient` + cookies | Catalog lists, user session, server-side price tier resolution. |
| **Route Handlers / Server Actions** | `createServerClient` | Mutations (cart Upsert, checkout intents) under same RLS as today. |
| **Background / admin-only** | `createClient` with **service role** | Only in server contexts **never** exposed to client; for jobs that bypass RLS by design. |

### 2.2 Environment variables

See repository root **`.env.example`**. Production secrets stay in hosting env, not in git.

### 2.3 Data fetching pattern (recommended)

1. **Server Components** fetch catalog metadata and initial prices (with tier already resolved server-side).  
2. **Client** handles cart UI, optimistic updates, Framer Motion — sync via Server Actions or REST you already use.  
3. **No duplicate business rules:** price tier, tax, shipping eligibility = one source (DB view, RPC, or server module).

### 2.4 Files to add when implementing (not all required in Phase 2 planning)

| Path | Role |
|------|------|
| `lib/supabase/client.ts` | Browser Supabase client |
| `lib/supabase/server.ts` | Server / RSC client |
| `middleware.ts` | Optional: refresh Supabase session cookie |

*Install when wiring:* `@supabase/supabase-js`, `@supabase/ssr`.

---

## 3. Wholesale tier model (contract)

Your production schema may differ; this is the **semantic contract** the UI must obey.

### 3.1 Concepts

- **Retail** — default visitor or authenticated user without wholesale approval.  
- **Wholesale tier** — one of N levels (e.g. Wholesale A/B, volume bands). Determines **unit price**, **minimums**, **visible SKUs** (if gated), and sometimes **payment method**.  
- **Effective price** — `(base_price * (1 - discount))` or **column override** `wholesale_price`; resolved **per line item** server-side.

### 3.2 Suggested tables / columns (verify against your DB)

| Artifact | Purpose |
|----------|---------|
| `profiles` (or `customers`) | `id`, `user_id`, `wholesale_tier_id` / `is_wholesale_approved`, optional `tax_id` |
| `wholesale_tiers` | `id`, `slug`, `name`, `min_order_subtotal`, `default_discount_pct`, `sort` |
| `product_prices` or columns on `products` | `retail_price`, optional `wholesale_price` or FK to tier matrix |
| `cart_lines` | Store `unit_price_cents` **snapshot** at add-to-cart to avoid retroactive drift |

### 3.3 Rules

1. **Never trust client-passed price** — always re-validate on Server Action / checkout.  
2. **PDP + cart + checkout** must call the **same resolver** (shared `getEffectivePrice`).  
3. **RLS:** wholesale-only rows readable only when `profile.wholesale_tier_id` matches policy.  
4. **Admin:** tier assignment is an admin-only mutation (service role or privileged RPC).

---

## 4. Component directory layout (target)

Aligned with `SKILL.md`; code will migrate out of `app/page.tsx` into these folders.

```
components/
  ui/           # Button, Badge, Card, Input, Modal primitives
  layout/       # Header, Footer, MegaMenu, MobileNav, AnnouncementBar
  sections/     # Hero, FeaturedProducts, Pillars, CategoryGrid, Trust, Testimonials, CtaBanner
  product/      # ProductCard, ProductGallery, ProductSpecs, PurchaseModule
  account/      # Login, Register, OrderHistory (shells until wired)
  checkout/     # CartDrawer, CheckoutSteps, OrderSummary (shells)
  shared/       # TrustBadges, Newsletter, SEO helpers
```

Each area starts empty except `components/README.md` (pointer to this doc).

---

## 5. App Router — route map & feature parity

Map **new** routes under `premiumpeptideslab.online` (paths are indicative — align with your SEO plan).

| Route (app/) | Parity with reference site | Notes |
|--------------|---------------------------|--------|
| `/` | Homepage | Exists as `page.tsx`; split into `components/sections/*`. |
| `/shop`, `/products`, or `/catalog` | Shop All | List + filters + search; Supabase queries + URL state. |
| `/product/[slug]` | PDP | Phase 5 — gallery, COA link, wholesale price. |
| `/categories/[slug]` | Category / hub pages | Peptides, growth/recovery, specialty, etc. |
| `/coa`, `/coa/[batch]` | COA library / batch lookup | Preserve batch identifier scheme. |
| `/research`, `/blog`, `/guides` | Research / peptide library | Content from CMS or Supabase `posts`. |
| `/calculator` | Peptide calculator (if retained) | Port tool UI; same math/outputs. |
| `/about` | About | New copy, Premium Peptides Lab. |
| `/faq` | FAQ | Accordion; optional MD/JSON in DB. |
| `/contact` | Contact | Form → endpoint / Supabase insert / email. |
| `/shipping`, `/legal/*` | Shipping, terms, privacy, refund | Compliance + research-only disclaimers. |
| `/account/*` | Orders, profile, wholesale application | Supabase Auth + RLS. |
| `/cart`, `/checkout` | Cart / checkout | **Reskin only** — keep payment + webhooks. |
| **Optional** | Chat / “expert” CTA | Third-party widget or link to support. |

**Announcement bar** — shipping threshold / trust rotator (reference: free shipping @ $400+): implement as config or Supabase `site_settings` row.

---

## 6. Feature parity checklist (execution backlog)

Use this when building or QA’ing; **copy** must be Premium Peptides Lab, not Precision.

- [x] Architecture & route map documented (this file)  
- [ ] Top announcement / dynamic trust messages  
- [ ] Global nav: Shop, COA, Research, Calculator (if kept), About, FAQ, Contact  
- [ ] Hub/category structure + counts from DB  
- [ ] Featured products from real catalog  
- [ ] Standards / comparison / process sections (new layout)  
- [ ] FAQ module  
- [ ] COA library + batch lookup  
- [ ] Footer columns: shop hubs, support, legal  
- [ ] Checkout / payment **UI** only — same rails  
- [ ] Optional chat / support entry  

---

## 7. Next steps (Phase 3 handoff)

1. Install `@supabase/ssr` + add `lib/supabase/client.ts` / `server.ts` when ready to query.  
2. Split `app/page.tsx` into `components/sections/*` + `components/layout/*` (Phase 3 on checklist).  
3. Add real `middleware.ts` if session refresh is required on every request.  
4. Attach **`references/supabase-schema-note.md`** when you have table list / ERD.

---

## Related

- **Migrating to a new Supabase project (copy DB, auth, storage):** [`references/supabase-migration-guide.md`](references/supabase-migration-guide.md)
