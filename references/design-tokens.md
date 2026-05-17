# Design Tokens Reference

## Dark Theme (Default for Pharmaceutical/Biotech)

```css
:root {
  /* Backgrounds */
  --color-bg-base: #080b12;
  --color-bg-surface: #0e1220;
  --color-bg-card: #131927;
  --color-bg-card-hover: #19203200;
  --color-bg-overlay: rgba(8, 11, 18, 0.95);

  /* Brand — replace with logo-extracted values */
  --color-brand-primary: #0d9eff;
  --color-brand-secondary: #1a3a5c;
  --color-accent: #00d4ff;
  --color-accent-warm: #3df0b0;
  --color-glow: rgba(0, 212, 255, 0.25);
  --color-glow-strong: rgba(0, 212, 255, 0.45);

  /* Text */
  --color-text-primary: #eef2ff;
  --color-text-secondary: #8b9ec8;
  --color-text-muted: #4a5a78;
  --color-text-inverse: #080b12;

  /* Borders */
  --color-border: rgba(255, 255, 255, 0.07);
  --color-border-active: rgba(0, 212, 255, 0.35);
  --color-border-hover: rgba(255, 255, 255, 0.15);

  /* Status */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  /* Purity/Science accents */
  --color-purity-high: #10e89b;
  --color-purity-badge: rgba(16, 232, 155, 0.12);

  /* Gradients */
  --gradient-brand: linear-gradient(135deg, var(--color-brand-primary), var(--color-accent));
  --gradient-hero: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0, 212, 255, 0.12) 0%, transparent 70%);
  --gradient-card: linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
  --gradient-section: linear-gradient(180deg, var(--color-bg-base) 0%, var(--color-bg-surface) 50%, var(--color-bg-base) 100%);

  /* Typography */
  --font-display: 'Syne', 'PP Mori', sans-serif;
  --font-body: 'DM Sans', 'Plus Jakarta Sans', sans-serif;
  --font-mono: 'JetBrains Mono', 'IBM Plex Mono', monospace;

  /* Spacing (8px grid) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;
  --space-32: 128px;

  /* Radii */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 9999px;

  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.3);
  --shadow-md: 0 8px 24px rgba(0,0,0,0.4);
  --shadow-lg: 0 20px 60px rgba(0,0,0,0.5);
  --shadow-glow: 0 0 20px var(--color-glow);
  --shadow-glow-strong: 0 0 40px var(--color-glow-strong);

  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-base: 250ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-slow: 400ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-spring: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Z-index scale */
  --z-base: 0;
  --z-raised: 10;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 300;
  --z-toast: 400;
}
```

## Light Theme Variant (Optional)

```css
[data-theme="light"] {
  --color-bg-base: #f8fafc;
  --color-bg-surface: #ffffff;
  --color-bg-card: #ffffff;
  --color-bg-overlay: rgba(248, 250, 252, 0.95);
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #94a3b8;
  --color-border: rgba(0, 0, 0, 0.08);
  --color-border-active: var(--color-brand-primary);
  --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.12);
}
```

## Tailwind Config Extension

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--color-brand-primary)',
          secondary: 'var(--color-brand-secondary)',
          accent: 'var(--color-accent)',
        },
        surface: {
          base: 'var(--color-bg-base)',
          card: 'var(--color-bg-card)',
          overlay: 'var(--color-bg-overlay)',
        },
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
      boxShadow: {
        glow: 'var(--shadow-glow)',
        'glow-strong': 'var(--shadow-glow-strong)',
      },
    },
  },
}
```

## Scientific Color Palette Alternatives

### Option A: Deep Navy + Electric Blue (Clinical Authority)
Primary: #0d4c8f | Accent: #0099ff | Highlight: #00d4ff

### Option B: Obsidian + Platinum (Luxury Research)
Primary: #c0c8d8 | Accent: #e8edf5 | Highlight: #ffffff

### Option C: Forest + Emerald (Biotech Natural)
Primary: #0f4c3a | Accent: #10b981 | Highlight: #34d399

### Option D: Midnight + Violet (Advanced Science)
Primary: #4f46e5 | Accent: #7c3aed | Highlight: #a78bfa

### Option E: Charcoal + Gold (Pharmaceutical Premium)
Primary: #1a1a1a | Accent: #c9a227 | Highlight: #f0c040
