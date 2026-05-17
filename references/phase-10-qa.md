# Phase 10 — Pre-ship QA report

**Date:** 2026-05-16  
**App:** `pharma-ecommerce-rebrand`  
**Build:** `npm run build` (must pass before deploy)

---

## Checklist results

| Item | Status | Notes |
|------|--------|--------|
| Brand colors consistent | ✅ | Single source: `lib/design-system.ts` + `globals.css` |
| Display + body + mono typography | ✅ | Syne, DM Sans, JetBrains Mono via `next/font` |
| Dark/light theme | ⏭️ N/A | Dark clinical default; `colorsLight` documented for future |
| 7 homepage sections | ✅ | Hero → Featured → Pillars → Categories → Quality → Testimonials → CTA |
| Product card spec | ✅ | Image, purity badge, spec, price, **View details** + Add to cart |
| Nav desktop + mobile | ✅ | Mega menu, mobile accordion, bottom bar |
| Motion + reduced-motion | ✅ | `useMotionConfig`, `prefers-reduced-motion` in CSS |
| Backend not broken | ✅ | Read-only catalog queries; no checkout/auth mutations added |
| Wholesale tiers | ⏭️ Deferred | UI uses `base_price`; wire legacy tier resolver at cutover |
| Responsive 375 / 768 / 1280 | ✅ | Tailwind breakpoints; manual spot-check recommended |
| CTAs + trust above fold | ✅ | Hero CTAs, `TrustBar`, trust badges |
| No old brand in UI | ✅ | Grep clean in `components/`, `app/` (refs only in internal docs) |

---

## Routes

| Path | Status |
|------|--------|
| `/` | Live homepage |
| `/products` | Live catalog (category filter, pagination) |
| `/products/[slug]` | Live PDP |
| `/cart`, `/account`, … | Branded placeholders (`lib/data/routes.ts`) |
| `/robots.txt`, `/sitemap.xml` | Generated |

---

## Manual verification before production

1. Run `npm run db:smoke` against production Supabase project.
2. Apply RLS + `fix_checkout_orders_rls.sql` on new project if not done.
3. Confirm `public/brand-logo.png` and hero/catalog images load (storage URLs).
4. Set `NEXT_PUBLIC_SITE_URL` in hosting env.
5. Submit sitemap in Google Search Console.
6. Test wholesale test accounts on **legacy** checkout until tier resolver is ported.

---

## Known follow-ups (post Phase 10)

- Wire real cart/session (replace demo `cartCount` state).
- Port checkout, auth, and wholesale pricing from `precision-health-store`.
- COA library PDFs from storage bucket.
- Site search (header opens UI; no results backend yet).
