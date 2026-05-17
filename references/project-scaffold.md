# Project scaffold — Premium Peptides Lab

Phase 9 deliverable: **full App Router scaffold** with separated components, token file, and integration boundaries.

---

## Routes (implemented)

| Route | File | Data |
|-------|------|------|
| `/` | `app/page.tsx` | Featured products, categories, product count |
| `/products/[slug]` | `app/products/[slug]/page.tsx` | Product detail, related, nav categories |
| `/robots.txt` | `app/robots.ts` | Static rules + sitemap pointer |
| `/sitemap.xml` | `app/sitemap.ts` | Home + active product slugs |
| `/api/health/supabase` | `app/api/health/supabase/route.ts` | Connectivity check |

**Planned (nav links exist; pages not in this package yet):** `/products`, `/cart`, `/account`, `/research`, `/coa`, `/contact`, checkout.

---

## Homepage sections (7)

Composed in `components/home/HomePage.tsx`:

1. `HeroSection`
2. `FeaturedProductsSection`
3. `PillarsSection`
4. `CategoryShowcaseSection`
5. `QualityTrustSection`
6. `TestimonialsSection`
7. `CtaBannerSection`

Shell: `StorefrontChrome` (announcement, header, footer, mobile bottom nav, scroll progress).

---

## Component layers

```
app/page.tsx (server)
  └── HomePage (client)
        └── StorefrontChrome
              └── sections/*

app/products/[slug]/page.tsx (server)
  └── ProductPageClient (client)
        └── StorefrontChrome
              ├── ProductGallery
              ├── ProductPurchaseModule
              ├── ProductDetailAccordions
              └── RelatedProductsSection
```

**Rule:** Server components fetch; client components handle cart UI state, motion, and interactions. Do not move pricing/tier logic into client-only code.

---

## Lib modules

| Module | Role |
|--------|------|
| `lib/design-system.ts` | Brand tokens, Tailwind extend, CSS variable map |
| `lib/cn.ts` | `clsx` + `tailwind-merge` helper |
| `lib/data/catalog.ts` | Supabase product/category queries |
| `lib/data/navigation.ts` | Nav links, `catalogHref()` |
| `lib/data/home-content.ts` | Static marketing copy |
| `lib/motion/` | Framer presets + `useMotionConfig()` |
| `lib/seo/` | Site URL, metadata builders, JSON-LD |
| `lib/types/catalog.ts` | Product/category TypeScript types |
| `lib/supabase/server.ts` | RSC / route Supabase client |

---

## Styling conventions

- Prefer **Tailwind** utilities with `lab-*` colors from `tailwind.config.ts`
- Semantic CSS in `globals.css` for repeated patterns (buttons, product card shell)
- Spectrum headlines: `text-spectrum` utility
- Glass panels: `GlassPanel` component or `.glass-panel` class

---

## Adding a new page

1. Create `app/<route>/page.tsx` (server component).
2. Fetch via `lib/data/*` or new query module — keep SQL in execution layer / catalog, not in UI.
3. Wrap with `StorefrontChrome` if it is a storefront surface.
4. Add metadata (`generateMetadata` or static `metadata` export).
5. Extend `app/sitemap.ts` when the route should be indexed.

---

## Preview artifact (legacy)

Early work used a **single-file JSX preview** for stakeholder sign-off. The production source of truth is this **multi-file scaffold**; do not duplicate homepage markup into a monolith — change `components/sections/*` instead.

---

## Related docs

- `references/phase-2-architecture.md` — Supabase, wholesale, must-not-break list
- `references/design-tokens.md` — Extended token reference
- `references/component-specs.md` — Component APIs
- `PROJECT-CHECKLIST.md` — Phase completion status
