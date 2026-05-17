---
name: pharma-ecommerce-rebrand
description: >
  Full-stack pharmaceutical or supplement eCommerce complete rebrand and UI/UX transformation. Use this skill whenever
  a user wants to: redesign a peptide, supplement, pharmaceutical, biotech, or wellness eCommerce site; rebrand an
  existing online store with a new premium identity; create a new brand design system for a health/science product
  company; transform an existing eCommerce template into a premium enterprise-grade frontend; or build a premium
  pharmaceutical/peptide/supplement storefront from scratch. Triggers on phrases like "rebrand my ecommerce site",
  "redesign my peptide store", "create a premium supplement website", "build a pharma ecommerce UI", "transform my
  health product site", "new brand identity for my supplement company", or any combination of pharmaceutical/biotech/
  wellness context with design, rebrand, or eCommerce. Always use this skill before writing any code when the user
  has a health/science product site that needs a visual overhaul or new brand identity.
---

# Pharmaceutical / Supplement eCommerce Rebrand Skill

A complete workflow for delivering a world-class premium rebrand and UI/UX transformation of a pharmaceutical,
peptide, supplement, or biotech eCommerce website — preserving all existing backend functionality while producing
an entirely new visual identity and frontend experience.

---

## Phase 0 — Capture Intent & Gather Inputs

Before writing a single line of code, gather the following from the user (ask in one consolidated message):

1. **Existing brand name** (the old brand being replaced)
2. **New brand name** (the new identity)
3. **Logo** — ask user to upload the new logo (PNG/SVG). You will extract colors, typography direction, and visual personality from it. If unavailable, ask for brand colors and style direction instead.
4. **Tech stack** — confirm: Next.js + React + Tailwind CSS + Framer Motion (default) or user-specified stack
5. **Scope** — Full site (homepage + product pages + nav + footer + account + checkout) or specific pages only
6. **Existing functionality to preserve** — list any custom features (subscriptions, memberships, custom filters, etc.)
7. **Reference sites** — any competitor or inspiration sites they admire (optional but valuable)
8. **Output format** — Component library files, single-file artifact preview, or full project scaffold

If the user has already provided a prompt document (like a spec brief), extract answers from it before asking.

---

## Phase 1 — Brand Intelligence Extraction

### If a logo is provided:
Analyze the uploaded logo image and extract:
- **Primary color** — dominant brand color (hex)
- **Secondary color** — supporting color (hex)
- **Accent color** — highlight/CTA color (hex)
- **Background direction** — dark/light/neutral
- **Typography personality** — geometric, humanist, serif authority, mono-technical, etc.
- **Visual tone** — clinical, luxury, futuristic, organic, minimal, bold

### Build the Design System from the logo analysis:

```
COLOR SYSTEM
────────────────────────────────────────
--color-brand-primary: [extracted]
--color-brand-secondary: [extracted]
--color-accent: [extracted]
--color-bg-base: #0a0b0f (or light equivalent)
--color-bg-surface: #111318
--color-bg-card: #161b25
--color-text-primary: #f0f4ff
--color-text-secondary: #8b9bb4
--color-text-muted: #4a5568
--color-border: rgba(255,255,255,0.08)
--color-glow: [accent at 30% opacity]

TYPOGRAPHY SYSTEM
────────────────────────────────────────
Display font: Scientific/luxury (Syne, Neue Haas Grotesk, PP Mori, or similar)
Body font: Clinical/readable (DM Sans, Plus Jakarta Sans, or similar)
Mono font: Technical accents (JetBrains Mono, IBM Plex Mono)

SPACING SCALE
────────────────────────────────────────
Use 8px base grid: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px
```

If no logo is provided, default to:
- Dark clinical theme: deep navy/charcoal base, electric blue primary, silver/platinum accent
- Typography: Syne (display) + DM Sans (body)

---

## Phase 2 — Architecture Planning

### Confirm preserved backend features
List all existing systems that must NOT be broken:
- Product catalog & inventory
- Categories & filtering
- Search (Algolia / native / custom)
- Authentication & user accounts
- Checkout & payment (Stripe / etc.)
- Order management
- Admin panel
- Email notifications
- Subscriptions (if present)
- SEO URLs & metadata

### Define component architecture
```
/components
  /ui           — Design system atoms (Button, Badge, Card, Input, etc.)
  /layout       — Header, Footer, Navigation, MegaMenu
  /sections     — Homepage sections (Hero, FeaturedProducts, WhyUs, etc.)
  /product      — ProductCard, ProductGallery, ProductSpecs, PurchaseModule
  /account      — Login, Dashboard, OrderHistory
  /checkout     — Cart, CheckoutFlow, OrderConfirmation
  /shared       — TrustBadges, Testimonials, Newsletter
```

---

## Phase 3 — Homepage Structure

Build these sections in order. Each must feel like a standalone premium experience:

### SECTION 1 — Hero
**Goal**: Instant premium credibility + conversion intent

Required elements:
- Full-viewport or large-hero layout
- Animated tagline (word-by-word or character reveal with Framer Motion)
- Subtle animated background (particle system, DNA helix SVG, gradient mesh, or lab imagery overlay)
- Primary CTA button (glow effect, hover scale)
- Secondary CTA (ghost/outline style)
- Trust micro-elements: "3rd Party Tested", "≥99% Purity", "GMP Certified" as small badges
- Floating product visual or 3D-style mockup (CSS/SVG, not real 3D unless Three.js requested)

Copy tone: Authoritative, scientific, premium. Example:
> "Research-Grade Peptides. Uncompromising Purity."
> "Engineered for scientists. Trusted by researchers worldwide."

### SECTION 2 — Featured Products
**Goal**: Immediate product discovery with premium presentation

Layout: Horizontal scroll carousel (mobile) / 3-4 column grid (desktop)

Product card must include:
- Product image with hover zoom + subtle glow
- Purity % badge (animated on hover)
- Product name in display font
- Molecular weight or key spec (scientific credibility)
- Price with sale/original if applicable
- "Add to Cart" with micro-animation
- "View Details" ghost button
- Glassmorphism card surface on dark bg, or clean elevated card on light

### SECTION 3 — Why [Brand Name]
**Goal**: Scientific authority + trust building

Layout: 3-4 feature cards in a grid or alternating icon+text rows

Include pillars:
1. **Purity Guarantee** — ≥99% purity, HPLC tested
2. **Third-Party Verified** — Independent lab certificates
3. **Research-Grade Manufacturing** — GMP facilities
4. **Global Research Community** — X+ researchers served
5. **Fast Secure Shipping** — Discreet, tracked, insured

Each pillar: Icon (SVG, themed to brand), headline, 1-2 sentence description.

### SECTION 4 — Category Showcase
**Goal**: Product discovery by research area

Categories to present (adapt to actual categories):
- Growth Factors
- Healing & Recovery
- Cognitive Enhancement
- Anti-Aging
- Performance & Weight
- Hormonal Research

Layout: Masonry or asymmetric grid with hover overlays showing category name + product count.
Use subtle animated gradient overlays on hover.

### SECTION 5 — Quality & Trust
**Goal**: Eliminate purchase hesitation

Include:
- Lab report / COA preview (image or mockup)
- Certification badges: GMP, ISO, HPLC, Mass Spec icons
- "Every batch independently tested" headline
- Animated purity meter or stat counter (99.X% purity)
- Timeline or process diagram: Synthesis → Testing → Certification → Shipping

### SECTION 6 — Testimonials / Social Proof
**Goal**: Community trust and real-world validation

Layout: Staggered cards or marquee scroll strip
Each testimonial: Avatar, name, title (e.g. "Research Scientist, PhD"), star rating, quote
Add aggregate stats: "4.9/5 across 2,400+ reviews"

### SECTION 7 — CTA Banner
**Goal**: Final conversion push

Full-width, bold, animated gradient background or image overlay
Headline + subtext + primary CTA + email signup option
Urgency element: "Same-day dispatch on orders before 2PM"

---

## Phase 4 — Navigation & Header

### Desktop Navigation
- Sticky header with blur/glass background on scroll
- Logo left-aligned
- Mega menu for Products (columns: category grid + featured product card)
- Simple links: Research, About, Blog
- Right cluster: Search icon, Account icon, Cart icon with item count badge
- Top announcement bar: rotating offers or trust messages

### Mobile Navigation
- Hamburger → full-screen overlay menu
- Accordion category expansion
- Persistent bottom bar: Home, Shop, Search, Cart, Account

---

## Phase 5 — Product Page

### Layout
Split: Left = image gallery (60%) | Right = purchase module (40%)
On mobile: Stacked, gallery first

### Image Gallery
- Main large image with zoom on hover/pinch
- Thumbnail strip below
- "View COA" button linking to PDF

### Product Information (right column)
```
[Category Badge]  [Purity Badge: ≥99%]

[Product Name — Display Font, large]
[Molecular Formula — monospace, muted]

★★★★★  (4.9)  · 234 reviews

[Price]  [Original price if sale]

[Variant selector if applicable: size/concentration]

[Quantity stepper]

[ADD TO CART — full width, primary glow button]
[BUY NOW — full width, secondary]

─────────────────────────────────
✓ Third-party tested  ✓ Ships in 24hrs  ✓ Discreet packaging

[Accordion sections:]
• Description
• Research Applications  
• Specifications (MW, Formula, CAS, Sequence)
• Certificate of Analysis
• Shipping & Returns
```

### Below the fold
- Related products carousel
- "Frequently stacked with" section
- Research citations / abstract (academic tone)
- Reviews section

---

## Phase 6 — Design System Components

### Button System
```css
/* Primary */
.btn-primary {
  background: linear-gradient(135deg, var(--color-accent), var(--color-brand-primary));
  box-shadow: 0 0 20px var(--color-glow);
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 0 32px var(--color-glow); }

/* Ghost */
.btn-ghost { border: 1px solid var(--color-border); backdrop-filter: blur(8px); }

/* Danger/Sale */
.btn-sale { background: linear-gradient(135deg, #ff4444, #cc0000); }
```

### Card System
```css
.product-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px var(--color-accent);
}
```

### Glassmorphism Panel
```css
.glass-panel {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
}
```

### Trust Badge Component
Small pill-shaped badges with icon + text. Use for: purity %, certifications, shipping promises.
Animate in on scroll with stagger delay.

---

## Phase 7 — Animation System (Framer Motion)

### Page-level
```jsx
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
}
```

### Staggered children
```jsx
const containerVariants = {
  visible: { transition: { staggerChildren: 0.1 } }
}
```

### Scroll-triggered sections
Use `useInView` from Framer Motion or Intersection Observer. Trigger fade+slide on entry.

### Hero text reveal
Character-by-character or word-by-word stagger for headline. 40-60ms delay between units.

### Product card hover
`whileHover={{ y: -4, scale: 1.01 }}` + box-shadow CSS transition.

### Number counters
Animate stats (99.X% purity, X,000 customers) counting up on scroll entry.

---

## Phase 8 — Performance & SEO

- Use `next/image` with proper `sizes` and `priority` on hero images
- Lazy load below-fold images
- Font loading: `font-display: swap` or `next/font`
- Structured data: Product schema, Organization schema, BreadcrumbList
- Meta tags: dynamic per-product `<title>`, `<meta name="description">`, Open Graph
- `robots.txt` and `sitemap.xml` preserved from existing
- Core Web Vitals targets: LCP < 2.5s, CLS < 0.1, FID < 100ms

---

## Phase 9 — Output Format Guide

### If generating a preview artifact (single file):
- Use React JSX artifact with Tailwind
- Include all homepage sections in one scrollable page
- Use inline mock data for products
- Include all animation logic
- Make it fully interactive

### If generating project scaffold:
- Follow Next.js 14+ App Router structure
- Create separate component files
- Include `tailwind.config.js` with full design tokens
- Include `globals.css` with CSS variable system
- Create `lib/design-system.ts` with token exports

### If updating specific pages only:
- Preserve existing file structure
- Only replace styled components and layout
- Keep all data fetching, API calls, business logic untouched
- Document every changed file

---

## Phase 10 — Quality Checklist

Before presenting output, verify:

- [ ] Brand colors extracted and applied consistently
- [ ] Typography system implemented (display + body + mono)
- [ ] Dark/light mode handled (if applicable)
- [ ] All 7 homepage sections present and complete
- [ ] Product card has all required elements
- [ ] Navigation fully functional (desktop + mobile)
- [ ] Animations present but not excessive (respect prefers-reduced-motion)
- [ ] No existing backend logic modified
- [ ] Mobile responsive (test mentally at 375px, 768px, 1280px)
- [ ] CTA buttons clearly visible and styled
- [ ] Trust signals visible above the fold
- [ ] Zero references to old brand name

---

## Reference Files

- See `references/design-tokens.md` for complete token system and dark/light theme variants
- See `references/copy-guide.md` for pharmaceutical/scientific brand voice guidelines
- See `references/component-specs.md` for detailed component API specs

---

## Common Pitfalls to Avoid

1. **Don't use Inter or Roboto** — pick distinctive display fonts that signal premium
2. **Don't use purple gradients** — overused in wellness/supplement space; differentiate
3. **Don't forget mobile** — pharmaceutical buyers increasingly on mobile; test everything
4. **Don't strip scientific credibility** — purity %, molecular data, COA links must stay prominent
5. **Don't break checkout** — if existing checkout works, only reskin the UI shell, never touch logic
6. **Don't over-animate** — one well-crafted hero animation > 20 janky micro-interactions
7. **Don't bury trust signals** — they should be visible within first scroll on every page
