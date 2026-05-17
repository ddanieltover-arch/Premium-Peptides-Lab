# Artifacts

This folder is for **non-runtime deliverables** (exports, one-off previews, stakeholder snapshots).

The live storefront is the **Next.js App Router project** at the repo root — not a single-file artifact.

| Artifact | Status |
|----------|--------|
| Single-file homepage preview | Superseded by `components/sections/*` + `components/home/HomePage.tsx` |
| Production scaffold | Root `app/`, `components/`, `lib/design-system.ts` |

To share a static preview, run `npm run build && npm run start` or deploy to Vercel/your host with `.env.local` configured.
