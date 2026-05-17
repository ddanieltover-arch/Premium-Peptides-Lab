# `lib/`

Shared non-UI logic for the Premium Peptides Lab storefront.

| Path | Use |
|------|-----|
| `design-system.ts` | Brand tokens — import `colors`, `space`, `designSystem`, or `tailwindThemeExtend` |
| `cn.ts` | Class name helper for components |
| `data/catalog.ts` | Supabase catalog queries (server) |
| `data/navigation.ts` | Nav config + `catalogHref()` |
| `data/home-content.ts` | Static homepage copy |
| `motion/` | Animation presets + `useMotionConfig` hook |
| `seo/` | `getSiteUrl`, metadata builders, JSON-LD |
| `types/catalog.ts` | `ProductDetail`, `FeaturedProduct`, etc. |
| `supabase/` | `createClient` for server / browser |

**Import alias:** `@/lib/...` (see root `tsconfig.json`).
