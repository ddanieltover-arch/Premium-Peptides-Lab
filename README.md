# Premium Peptides Lab — Storefront Rebrand

Next.js 14 App Router storefront for **Premium Peptides Lab**, replacing the legacy Precision Health Research UI while preserving Supabase catalog, auth, and checkout contracts.

**Production domain:** [https://premiumpeptideslab.online](https://premiumpeptideslab.online)  
**Feature parity reference (IA only, not visuals):** [ph-research.store](https://www.ph-research.store/)

---

## Quick start

```bash
cp .env.example .env.local   # add Supabase URL + anon key
npm install
npm run dev                  # http://localhost:3000
```

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run db:smoke` | Supabase catalog smoke test |
| `npm run db:verify` | Post-migration verification |

---

## Project structure

```
app/                    # Routes (App Router)
  layout.tsx            # Fonts, root metadata, Organization JSON-LD
  page.tsx              # Homepage (server data → HomePage)
  products/[slug]/      # PDP
  robots.ts / sitemap.ts
  globals.css           # CSS variables (sync with lib/design-system.ts)

components/
  ui/                   # Design-system primitives (Button, Card, Badge, …)
  layout/               # Header, footer, chrome, mobile nav
  sections/             # Homepage marketing blocks (7 sections)
  product/              # PDP + ProductCard
  home/                 # HomePage composer
  shared/               # Motion helpers, CatalogImage, CountUp
  seo/                  # JsonLd

lib/
  design-system.ts      # Tokens → Tailwind + CSS variables
  data/                 # Catalog + navigation + static copy
  motion/               # Framer Motion presets
  seo/                  # Metadata + JSON-LD builders
  supabase/             # Server/browser clients
  types/                # Shared TypeScript types

references/             # Architecture, tokens, migration guides
public/                 # brand-logo.png, static assets
scripts/                # Supabase smoke / migration helpers
```

Full map: **`references/project-scaffold.md`**

---

## Design system

- **Tokens:** `lib/design-system.ts` — colors, spacing, motion, `tailwindThemeExtend`, `cssVariables`
- **Tailwind:** `tailwind.config.ts` imports `tailwindThemeExtend`
- **Global CSS:** `app/globals.css` — `:root` variables and utility classes (`.btn-primary`, `.glass-panel`, `.text-spectrum`)
- **UI kit:** `components/ui/` — import via `@/components/ui`

When changing brand colors, update **`colors` in `lib/design-system.ts`** and the matching entries in **`app/globals.css`**.

---

## Data & backend

- Catalog reads use **`lib/data/catalog.ts`** + Supabase RLS (anon key in `.env.local`)
- Do not put `SUPABASE_SERVICE_ROLE_KEY` in client code
- Migration notes: `references/supabase-migration-guide.md`, `references/phase-2-architecture.md`

---

## Phases & checklist

Progress is tracked in **`PROJECT-CHECKLIST.md`** (Phases 0–10).  
Agent workflow SOP: **`SKILL.md`** (repo root of this package).

---

## Environment

| Variable | Required | Notes |
|----------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public anon key (RLS enforced) |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URL for SEO / sitemap |
| `SUPABASE_SERVICE_ROLE_KEY` | Scripts only | Never expose to browser |

---

## License

Private — Premium Peptides Lab / client project.
