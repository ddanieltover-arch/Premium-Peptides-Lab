/**
 * Premium Peptides Lab — design tokens (Phase 1 + Phase 9 scaffold)
 *
 * **Source of truth** for:
 * - `tailwind.config.ts` → `tailwindThemeExtend`
 * - `app/globals.css` → keep `cssVariables` in sync when changing hex values
 *
 * Import tokens in TS/TSX: `import { colors, space } from '@/lib/design-system'`
 */

/** Logo-informed brand rationale — not arbitrary palette picks */
export const brandProfile = {
  summary:
    'Logo-driven identity: electric blue helix start, lime rungs, magenta/violet molecular cap, gold lightning energy, deep clinical base.',
  primaryUse: 'Interactive UI, focus rings, key CTAs, spectral gradient start',
  secondaryUse: 'Depth, borders on light accents, infographic rails',
  accentUse: 'Trust spark, badges, lightning motifs — use sparingly',
  backgroundDirection: 'dark-clinical' as const,
  typographyPersonality: {
    display: 'Geometric, confident sans — authority without cold sterility',
    body: 'Humanist grotesk — high legibility for long research copy',
    mono: 'Technical / analytical — specs, CAS, batch IDs, HPLC readouts',
  },
  visualTone: [
    'premium pharmaceutical laboratory',
    'scientific authority + restrained luxury',
    'modern biotech — spectrum gradients for emphasis only',
  ] as const,
} as const;

/** Core palette extracted from brand artwork + adaptation for UI surfaces */
export const colors = {
  // Brand
  brandPrimary: '#4A9FE8',
  brandSecondary: '#2D3A52',
  accent: '#F5C842',

  // Spectrum (headlines, progress, decorative — matches logo transition)
  spectrumBlue: '#4A9FE8',
  spectrumMint: '#34D399',
  spectrumRose: '#F472B6',
  spectrumViolet: '#A78BFA',

  // Surfaces (dark clinical)
  bgBase: '#0d1220',
  bgSurface: '#111827',
  bgElevated: '#151d32',
  bgCard: '#161f36',
  bgOverlay: 'rgba(13, 18, 32, 0.92)',

  // Text
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  textInverse: '#0d1220',

  // Lines
  border: 'rgba(255, 255, 255, 0.08)',
  borderHover: 'rgba(255, 255, 255, 0.14)',
  borderActive: 'rgba(74, 159, 232, 0.45)',

  // Science / status
  purity: '#34D399',
  purityBadgeBg: 'rgba(52, 211, 153, 0.12)',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Glow (RGB channels for overlays)
  glowPrimary: 'rgba(74, 159, 232, 0.35)',
  glowPrimaryStrong: 'rgba(74, 159, 232, 0.55)',
  glowAccent: 'rgba(245, 200, 66, 0.28)',

  // Glass
  glassBg: 'rgba(17, 24, 39, 0.55)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
} as const;

export const gradients = {
  spectrum: `linear-gradient(105deg, ${colors.spectrumBlue} 0%, ${colors.spectrumMint} 32%, ${colors.spectrumRose} 62%, ${colors.spectrumViolet} 100%)`,
  spectrumVertical: `linear-gradient(180deg, ${colors.spectrumBlue} 0%, ${colors.spectrumMint} 35%, ${colors.spectrumRose} 70%, ${colors.spectrumViolet} 100%)`,
  heroRadial: `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(74,159,232,0.25) 0%, transparent 55%)`,
  meshDark: [
    'radial-gradient(circle at 15% 20%, rgba(74,159,232,0.12) 0%, transparent 45%)',
    'radial-gradient(circle at 85% 10%, rgba(167,139,250,0.12) 0%, transparent 40%)',
    'radial-gradient(circle at 70% 80%, rgba(52,211,153,0.08) 0%, transparent 50%)',
  ].join(', '),
  cardSheen:
    'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
} as const;

/** 8px grid — use for spacing, layout math, and padding contracts */
export const space = {
  0: '0',
  1: '0.25rem', // 4
  2: '0.5rem', // 8
  3: '0.75rem', // 12
  4: '1rem', // 16
  5: '1.25rem', // 20
  6: '1.5rem', // 24
  8: '2rem', // 32
  10: '2.5rem', // 40
  12: '3rem', // 48
  16: '4rem', // 64
  24: '6rem', // 96
  32: '8rem', // 128
} as const;

export const radius = {
  sm: '0.375rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 2px 8px rgba(0,0,0,0.3)',
  md: '0 8px 24px rgba(0,0,0,0.4)',
  lg: '0 20px 60px rgba(0,0,0,0.5)',
  glow: `0 0 40px ${colors.glowPrimary}`,
  glowStrong: `0 0 56px ${colors.glowPrimaryStrong}`,
  glowGold: `0 0 28px ${colors.glowAccent}`,
  card: '0 24px 48px rgba(0, 0, 0, 0.45)',
} as const;

export const motion = {
  easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  durationFast: '150ms',
  durationBase: '250ms',
  durationSlow: '400ms',
  /** Page / section enter */
  pageTransition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  /** Stagger children */
  stagger: { staggerChildren: 0.1 },
  /** Hero headline stagger per unit */
  heroStaggerMs: 55,
} as const;

export const zIndex = {
  base: 0,
  raised: 10,
  dropdown: 100,
  sticky: 200,
  modal: 300,
  toast: 400,
  max: 500,
} as const;

/** Responsive breakpoints (Tailwind defaults — document for QA at 375 / 768 / 1280). */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * CSS custom properties mirrored in `app/globals.css` `:root`.
 * Keys must match variable names in globals (without the leading `--` in usage).
 */
export const cssVariables = {
  '--color-brand-primary': colors.brandPrimary,
  '--color-brand-secondary': colors.brandSecondary,
  '--color-accent': colors.accent,
  '--color-spectrum-blue': colors.spectrumBlue,
  '--color-spectrum-mint': colors.spectrumMint,
  '--color-spectrum-rose': colors.spectrumRose,
  '--color-spectrum-violet': colors.spectrumViolet,
  '--color-bg-base': colors.bgBase,
  '--color-bg-surface': colors.bgSurface,
  '--color-bg-elevated': colors.bgElevated,
  '--color-bg-card': colors.bgCard,
  '--color-bg-overlay': colors.bgOverlay,
  '--color-text-primary': colors.textPrimary,
  '--color-text-secondary': colors.textSecondary,
  '--color-text-muted': colors.textMuted,
  '--color-text-inverse': colors.textInverse,
  '--color-border': colors.border,
  '--color-border-hover': colors.borderHover,
  '--color-border-active': colors.borderActive,
  '--color-purity': colors.purity,
  '--color-purity-badge-bg': colors.purityBadgeBg,
  '--color-success': colors.success,
  '--color-warning': colors.warning,
  '--color-error': colors.error,
  '--color-glow-primary': colors.glowPrimary,
  '--color-glow-primary-strong': colors.glowPrimaryStrong,
  '--color-glow-accent': colors.glowAccent,
  '--lab-glass': colors.glassBg,
  '--lab-border': colors.glassBorder,
  '--lab-base': colors.bgBase,
  '--lab-primary': colors.brandPrimary,
  '--lab-energy': colors.accent,
  '--lab-mint': colors.spectrumMint,
  '--gradient-spectrum': gradients.spectrum,
  '--ease-out-expo': motion.easeOutExpo,
  '--duration-fast': motion.durationFast,
  '--duration-base': motion.durationBase,
  '--duration-slow': motion.durationSlow,
} as const;

/** Optional light theme — apply with `<html data-theme="light">` when implemented. */
export const colorsLight = {
  bgBase: '#f8fafc',
  bgSurface: '#ffffff',
  bgCard: '#ffffff',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  border: 'rgba(0, 0, 0, 0.08)',
} as const;

/** Font stacks — variables set by `next/font` in `app/layout.tsx` */
export const fontFamilies = {
  display: ['var(--font-display)', 'system-ui', 'sans-serif'],
  body: ['var(--font-body)', 'system-ui', 'sans-serif'],
  mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
};

/**
 * Tailwind theme extension — imported by `tailwind.config.ts`
 */
export const tailwindThemeExtend = {
  colors: {
    primary: {
      DEFAULT: colors.brandPrimary,
      foreground: '#ffffff',
      dark: '#3a8fd4',
    },
    brand: {
      secondary: colors.brandSecondary,
      accent: colors.accent,
    },
    lab: {
      base: colors.bgBase,
      surface: colors.bgSurface,
      elevated: colors.bgElevated,
      card: colors.bgCard,
      navy: colors.brandSecondary,
      primary: colors.brandPrimary,
      energy: colors.accent,
      mint: colors.spectrumMint,
      rose: colors.spectrumRose,
      violet: colors.spectrumViolet,
    },
  },
  fontFamily: {
    display: fontFamilies.display,
    body: fontFamilies.body,
    mono: fontFamilies.mono,
  },
  boxShadow: {
    glow: shadows.glow,
    'glow-gold': shadows.glowGold,
    card: shadows.card,
  },
  backgroundImage: {
    spectrum: gradients.spectrum,
    'spectrum-radial': gradients.heroRadial,
    'mesh-dark': gradients.meshDark,
    'card-sheen': gradients.cardSheen,
  },
  transitionTimingFunction: {
    'out-expo': motion.easeOutExpo,
  },
};

export type LabColorKey = keyof typeof tailwindThemeExtend.colors.lab;

/** Single export for docs, Storybook, or design tooling. */
export const designSystem = {
  brandProfile,
  colors,
  colorsLight,
  gradients,
  space,
  radius,
  shadows,
  motion,
  zIndex,
  breakpoints,
  fontFamilies,
  cssVariables,
  tailwindThemeExtend,
} as const;
