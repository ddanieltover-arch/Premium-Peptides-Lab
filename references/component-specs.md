# Component Specifications

## Core UI Components

### `<Button>`
```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger'
  size: 'sm' | 'md' | 'lg'
  glow?: boolean        // adds glow shadow effect
  loading?: boolean     // shows spinner, disables click
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children: ReactNode
  onClick?: () => void
  href?: string         // renders as <a> if provided
  disabled?: boolean
}
```

Styling:
- Primary: brand gradient bg + glow shadow + white text
- Secondary: surface bg + border + brand text
- Ghost: transparent + border + text, subtle hover bg
- All: 8px vertical padding, 20px horizontal (md); border-radius: pill or rounded-lg based on brand

### `<ProductCard>`
```tsx
interface ProductCardProps {
  id: string
  name: string
  slug: string
  imageUrl: string
  price: number
  originalPrice?: number    // shows sale indicator if provided
  purity: string            // e.g. "≥99%"
  molecularWeight?: string
  category: string
  isNew?: boolean
  isBestseller?: boolean
  inStock: boolean
  onAddToCart: (id: string) => void
}
```

Layout:
- Image container: 16:9 or 4:3 ratio, overflow hidden, hover zoom
- Badges: top-left (NEW, BESTSELLER), top-right (purity %)
- Card body: product name, spec line, price, CTA buttons
- Hover state: lift + glow border + reveal quick-add button

### `<PurityBadge>`
```tsx
interface PurityBadgeProps {
  value: string      // "≥99%" or "99.4%"
  size?: 'sm' | 'md'
  animated?: boolean // pulse glow on mount
}
```

Style: Pill shape, --color-purity-high text, --color-purity-badge bg, monospace font

### `<TrustBar>`
Horizontal strip with 4-5 trust signals using icons + short text.
Responsive: horizontal scroll on mobile, flex row on desktop.
Animate in from bottom on page load.

```tsx
interface TrustItem {
  icon: ReactNode
  label: string
  sublabel?: string
}
// Default items: Purity Tested | COA Available | GMP Certified | Tracked Shipping | Secure Payment
```

### `<AnnouncementBar>`
Sticky top bar above header.
Rotating messages with smooth crossfade (3-5s interval).
Dismissible (localStorage persist).
Brand accent background.

### `<MegaMenu>`
```tsx
interface MegaMenuProps {
  categories: {
    name: string
    slug: string
    productCount: number
    featuredProducts?: ProductSummary[]
  }[]
  featuredHighlight?: {
    title: string
    description: string
    imageUrl: string
    href: string
  }
}
```

Layout: 3-column inside dropdown
- Col 1-2: Category list with product counts + icons
- Col 3: Featured product card or promotional highlight
Animate: fade + slide down on trigger

### `<ProductGallery>`
```tsx
interface ProductGalleryProps {
  images: { url: string; alt: string }[]
  coaUrl?: string
}
```

- Main image: large, zoomable (click to fullscreen or CSS zoom)
- Thumbnails: horizontal scroll strip below
- "View COA" button: links to PDF in new tab
- Image lazy loading with blur placeholder

### `<PurchaseModule>`
Sticky right column on desktop (position: sticky, top: 80px)
On mobile: fixed bottom bar with price + add to cart

Contains:
- Product title + category
- Purity badge
- Star rating + review count
- Price display (with sale handling)
- Variant selector (if applicable)
- Quantity stepper (- / number / +)
- Add to Cart button (full width, primary)
- Buy Now button (full width, secondary)
- Trust mini-bar (3 icons: tested, ships fast, secure)
- Shipping estimate

### `<ReviewCard>`
```tsx
interface ReviewCardProps {
  author: string
  title?: string          // e.g. "Research Biochemist"
  rating: 1 | 2 | 3 | 4 | 5
  date: string
  body: string
  verified: boolean
}
```

Style: Card with glass surface, star rating in --color-accent, verified badge if applicable

### `<StatCounter>`
Animated number counting up on scroll entry.
```tsx
interface StatCounterProps {
  value: number
  prefix?: string    // e.g. "≥"
  suffix?: string    // e.g. "%" or "+"
  label: string
  duration?: number  // animation duration in ms, default 2000
}
```

### `<CategoryCard>`
Full-bleed image with gradient overlay.
Hover: overlay brightens + text slides up to reveal product count.
```tsx
interface CategoryCardProps {
  name: string
  slug: string
  imageUrl: string
  productCount: number
  description?: string
}
```

### `<SectionHeader>`
Reusable section title component.
```tsx
interface SectionHeaderProps {
  eyebrow?: string      // small label above title, in accent color
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}
```

Eyebrow: small caps, letter-spacing, accent color
Title: display font, large
Subtitle: body font, muted text

---

## Page Layouts

### Homepage Layout
```
<AnnouncementBar />
<Header sticky />
<main>
  <HeroSection />
  <FeaturedProductsSection />
  <WhyUsSection />
  <CategoryShowcaseSection />
  <QualitySection />
  <TestimonialsSection />
  <CTASection />
</main>
<Footer />
```

### Product Page Layout
```
<Header sticky />
<main>
  <Breadcrumb />
  <ProductDetailSection>
    <ProductGallery />      {/* Left 60% desktop */}
    <PurchaseModule />      {/* Right 40% desktop */}
  </ProductDetailSection>
  <ProductTabsSection>
    <Tab label="Description" />
    <Tab label="Research Applications" />
    <Tab label="Specifications" />
    <Tab label="Certificate of Analysis" />
    <Tab label="Shipping" />
  </ProductTabsSection>
  <RelatedProductsSection />
  <ReviewsSection />
</main>
<Footer />
```

### Category/Shop Layout
```
<Header sticky />
<main>
  <ShopHeroBanner />
  <ShopLayout>
    <FilterSidebar />    {/* Left 260px desktop, drawer on mobile */}
    <ProductGrid />      {/* Remaining width, 3-4 cols */}
  </ShopLayout>
  <Pagination />
</main>
<Footer />
```

---

## Animation Presets (Framer Motion)

```tsx
// Fade up — standard section entry
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
}

// Scale in — cards, badges
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
}

// Stagger container
export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
}

// Slide in from left — sidebar, nav items
export const slideInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
}

// Hero character reveal — for headline text
export const charReveal = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  })
}
```

---

## Responsive Breakpoints

```
mobile:  < 640px   (1 column product grid, stacked layouts, bottom nav)
tablet:  640-1024px (2 column product grid, sidebar as drawer)
desktop: > 1024px  (3-4 column grid, sidebar visible, mega menu)
wide:    > 1280px  (max-width container: 1280px centered)
```

### Mobile-Specific Requirements
- Bottom navigation bar: Home, Shop, Search, Cart (with badge), Account
- Filter as full-screen drawer, not sidebar
- Hero: min-height 85svh, headline max 3 lines
- Product cards: 2-column grid at 640px, 1-column below 400px
- Purchase module: sticky bottom bar (price + add to cart)
- Navigation: full-screen overlay menu with backdrop blur
