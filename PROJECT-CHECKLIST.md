# Premium Peptides Lab — Rebrand project checklist

_Tracks progress against `SKILL.md` phases. Update statuses as you go._

**Legend:** `⬜` not started · `🟡` in progress · `✅` done · `⏭` skipped / N/A

---

## Phase 0 — Capture intent & gather inputs — ✅ CLOSED

| # | Input | Status | Notes |
|---|--------|--------|--------|
| 0.1 | Existing brand name | ✅ | Precision Health Research |
| 0.2 | New brand name | ✅ | PREMIUM PEPTIDES LAB |
| 0.3 | Logo (PNG/SVG) for extraction | ✅ | **`public/brand-logo.png`** (high-res upload). `brand-logo.jpg` retained as backup; UI uses PNG in `app/page.tsx`. SVG still optional for infinite sharpness. |
| 0.4 | Tech stack confirmed | ✅ | **Frontend:** Next.js 14 App Router, React, Tailwind CSS, Framer Motion · **Backend / data:** **Supabase** (auth, DB, storage, edge functions as applicable) |
| 0.5 | Scope (pages / surface area) | ✅ | **Full site** rebrand; homepage preview exists — rebuild remaining routes to **new** UI (no Precision layout reuse). **Feature parity** guided by reference storefront (see below). |
| 0.6 | Functionality to preserve | ✅ | Catalog, categories, inventory, search/filter, auth, checkout, orders, admin, email, SEO URLs/metadata · **Plus: wholesale tiers** (pricing/visibility/rules — confirm in Supabase schema) |
| 0.7 | Reference / inspiration sites | ✅ | **[Precision Health Research storefront](https://www.ph-research.store/)** — use for **page coverage** and **feature inventory** (not visual/design clone). New brand must look like a different company. |
| 0.8 | Output format | ✅ | **Full App Router scaffold** — see `README.md`, `references/project-scaffold.md` |

### Phase 0 summary (locked)

- **Data / auth platform:** Supabase.
- **Commerce nuance:** wholesale tiers (must survive rebrand; align PDP, cart, checkout, and any admin/pricing views).
- **IA & features baseline:** map routes and tools from [ph-research.store](https://www.ph-research.store/) (e.g. shop hubs, COA library, peptide calculator, research library, FAQ, contact, payment flow patterns) — reimplemented under Premium Peptides Lab UX.
- **Logo delivery:** ship **SVG** or **high-res PNG** into `public/` (e.g. `brand-logo.svg` or `brand-logo@2x.png`) and switch `<Image>` / `<img>` sources when ready.

---

## Phase 1 — Brand intelligence & design system — ✅ DONE

| Task | Status |
|------|--------|
| Extract primary / secondary / accent from logo | ✅ (`lib/design-system.ts` → `brandProfile`, `colors`) |
| Document typography personality + visual tone | ✅ (`brandProfile.typographyPersonality`, `visualTone`) |
| Lock CSS variables + Tailwind tokens (`globals.css` / `tailwind.config`) | ✅ |
| `lib/design-system.ts` token exports | ✅ (`tailwindThemeExtend`, gradients, motion, `zIndex`, …) |

---

## Phase 2 — Architecture planning — ✅ DONE

| Task | Status |
|------|--------|
| Written list of systems that must not break (Supabase schema, RLS, webhooks, Edge) | ✅ See [`references/phase-2-architecture.md`](references/phase-2-architecture.md) §1 |
| Wholesale tier model documented (tables, rules, retail vs wholesale) | ✅ Same doc §3 + template [`references/supabase-schema-note.md`](references/supabase-schema-note.md) |
| Target folder structure under `/components` | ✅ Scaffold + [`components/README.md`](components/README.md) |
| Integration strategy: Next.js ↔ Supabase | ✅ §2 + [`lib/supabase/README.md`](lib/supabase/README.md) · [`.env.example`](.env.example) |
| **Feature parity + route map** (vs [reference site](https://www.ph-research.store/)) | ✅ Architecture doc §5–6 (execution checkboxes remain for build-out) |
| · Top announcement / shipping threshold messaging | ⬜ _implement in Phase 3+_ |
| · Global nav: shop, COA, research/education hub, calculator (if retained), about, FAQ, contact | ⬜ |
| · Category / hub structure (peptides, growth/recovery, specialty, etc.) | ⬜ |
| · Featured products, comparison / standards section, process steps, FAQ | ⬜ |
| · COA library / batch lookup flows | ⬜ |
| · Footer: legal, support, multi-hub links | ⬜ |
| · Checkout / payment UX (reskin only) | ⬜ |
| · Optional: chat / support entry points | ⬜ |

---

## Phase 3 — Homepage structure (7 sections) — ✅ DONE

| Section | Status |
|---------|--------|
| Hero | ✅ `components/sections/HeroSection.tsx` |
| Featured products | ✅ `FeaturedProductsSection.tsx` + **live Supabase** |
| Why [brand] | ✅ `PillarsSection.tsx` |
| Category showcase | ✅ `CategoryShowcaseSection.tsx` + **live categories** |
| Quality & trust | ✅ `QualityTrustSection.tsx` |
| Testimonials | ✅ `TestimonialsSection.tsx` |
| CTA banner | ✅ `CtaBannerSection.tsx` |
| Split into `components/sections/*` + `components/layout/*` | ✅ `components/home/HomePage.tsx` orchestrator |

---

## Phase 4 — Navigation & header — ✅ DONE

| Task | Status |
|------|--------|
| Sticky + blur on scroll | ✅ |
| Mega menu (products) | ✅ |
| Announcement bar (rotating trust messages) | ✅ `AnnouncementBar.tsx` + `ANNOUNCEMENT_MESSAGES` |
| Mobile full-screen + bottom bar | ✅ |
| Accordion categories inside mobile menu | ✅ `MobileMenu.tsx` |
| Bottom nav wired (Home, Shop, Search, Cart, Account) | ✅ `MobileBottomNav.tsx` + `lib/data/navigation.ts` |
| Shared nav paths + desktop account link | ✅ `catalogHref`, `SiteHeader` |

---

## Phase 5 — Product page (PDP) — ✅ DONE

| Task | Status |
|------|--------|
| Gallery + thumbnails + COA CTA | ✅ `ProductGallery.tsx` |
| Purchase module (variants, qty, ATC, Buy now) | ✅ `ProductPurchaseModule.tsx` |
| Wholesale-aware price + eligibility (if gated) | ⏭ deferred (same as architecture note) |
| Accordions (description, apps, specs, COA, shipping) | ✅ `ProductDetailAccordions.tsx` |
| Below fold: related, citations | ✅ `RelatedProductsSection.tsx` + citations block |
| Route `/products/[slug]` + Supabase detail fetch | ✅ `app/products/[slug]/page.tsx` |
| Product cards link to PDP | ✅ `ProductCard.tsx` |

---

## Phase 6 — Design system components — ✅ DONE

| Task | Status |
|------|--------|
| Buttons (primary, secondary, ghost, sale) | ✅ `components/ui/button.tsx` + `.btn-*` in `globals.css` |
| Card + glass panel primitives | ✅ `card.tsx`, `glass-panel.tsx` |
| Trust / purity badges | ✅ `badge.tsx` (`PurityBadge`, `TrustBadge`, `CategoryBadge`, `SaleBadge`) |
| Section header primitive | ✅ `section-header.tsx` |
| Wired into hero, CTA, header, PDP, product cards | ✅ |

---

## Phase 7 — Animation system — ✅ DONE

| Task | Status |
|------|--------|
| Shared presets (`lib/motion/presets.ts`) | ✅ fadeUp, stagger, page, hero, card hover, … |
| `useMotionConfig()` hook | ✅ `lib/motion/hooks.ts` |
| `SectionReveal` + `PageEnter` wrappers | ✅ `components/shared/` |
| Hero reveal, card hover, counters | ✅ wired to presets |
| `prefers-reduced-motion` pass | ✅ ScrollProgress off, CountUp instant, reduced variants |

---

## Phase 8 — Performance & SEO — ✅ DONE

| Task | Status |
|------|--------|
| `next/image` + `sizes` / lazy loading audit | ✅ `CatalogImage` on cards + PDP gallery |
| Fonts (`next/font`) | ✅ |
| Product + Organization + Breadcrumb JSON-LD | ✅ `lib/seo/json-ld.ts` + `JsonLd` |
| Per-route metadata / OG | ✅ root, home, PDP + Twitter cards |
| `robots.txt` / `sitemap.xml` | ✅ `app/robots.ts`, `app/sitemap.ts` (dynamic product URLs) |

---

## Phase 9 — Output format — ✅ DONE

| Mode | Status |
|------|--------|
| Single-file preview artifact | ✅ (superseded — see `artifacts/README.md`) |
| Full App Router scaffold + `design-system` file | ✅ `README.md`, `references/project-scaffold.md`, `lib/design-system.ts` exports |
| Component tree + lib docs | ✅ `components/README.md`, `lib/README.md` |
| Branded `app/not-found.tsx` | ✅ |

---

## Phase 10 — Quality checklist (pre-ship) — ✅ DONE

- [x] Brand colors consistent
- [x] Display + body + mono typography
- [x] Dark/light (N/A — dark default; light tokens documented)
- [x] All 7 homepage sections complete (+ quality process timeline)
- [x] Product card spec (+ **View details** + Add to cart)
- [x] Nav desktop + mobile
- [x] Motion restrained + reduced-motion respected
- [x] No accidental backend breakage (read-only catalog in this package)
- [x] Wholesale tiers — deferred to cutover (documented in `references/phase-10-qa.md`)
- [x] Responsive patterns (Tailwind; manual device QA recommended)
- [x] CTAs + trust above the fold (`TrustBar`, hero badges)
- [x] No old brand in UI copy/components
- [x] `/products` catalog + nav/footer placeholders (no 404s)

**Report:** `references/phase-10-qa.md`

---

## Next action

**Ship / cutover:** Run manual QA on staging, apply Supabase RLS + storage migration, wire cart/checkout from legacy storefront, then point `premiumpeptideslab.online` DNS.
