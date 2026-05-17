/** Copy for routes not yet fully built — avoids 404s from nav/footer links. */

export type PlaceholderRoute = {
  title: string;
  description: string;
  eyebrow?: string;
  primaryLabel?: string;
  primaryHref?: string;
};

export const PLACEHOLDER_ROUTES: Record<string, PlaceholderRoute> = {
  cart: {
    eyebrow: 'Checkout shell',
    title: 'Cart',
    description:
      'Cart and checkout UI will connect to your existing order flow. This rebrand preserves backend contracts — wire Server Actions or API routes from the legacy storefront when ready.',
    primaryLabel: 'Browse catalog',
    primaryHref: '/products',
  },
  account: {
    eyebrow: 'Account',
    title: 'Sign in & orders',
    description:
      'Authentication and order history use Supabase Auth with RLS. Reskin account pages against the same session cookies as production.',
    primaryLabel: 'Return home',
    primaryHref: '/',
  },
  research: {
    eyebrow: 'Research library',
    title: 'Research',
    description:
      'Protocols, application notes, and citation-friendly summaries will live here. Content can be sourced from your CMS or static MDX.',
    primaryLabel: 'Browse catalog',
    primaryHref: '/products',
  },
  coa: {
    eyebrow: 'Documentation',
    title: 'COA library',
    description:
      'Batch certificates and exemplar chromatograms. Link PDFs from Supabase Storage or your existing COA bucket paths.',
    primaryLabel: 'Featured products',
    primaryHref: '/',
  },
  contact: {
    eyebrow: 'Support',
    title: 'Contact',
    description:
      'Technical inquiries, institutional onboarding, and lot-specific questions. Production: form handler + ticket routing.',
    primaryLabel: 'Email support',
    primaryHref: 'mailto:info@premiumpeptideslab.online',
  },
  faq: {
    eyebrow: 'Help',
    title: 'FAQ',
    description: 'Shipping windows, documentation standards, and research-use disclaimers.',
    primaryLabel: 'Contact',
    primaryHref: '/contact',
  },
  shipping: {
    eyebrow: 'Logistics',
    title: 'Shipping',
    description: 'Cold-chain dispatch, tracking, and receiving-dock guidance for institutional buyers.',
    primaryLabel: 'Catalog',
    primaryHref: '/products',
  },
  about: {
    eyebrow: 'Company',
    title: 'About Premium Peptides Lab',
    description:
      'Analytical peptide standards with documented release criteria and third-party verification partners.',
    primaryLabel: 'Quality dossier',
    primaryHref: '/#quality',
  },
  'peptide-calculator': {
    eyebrow: 'Tools',
    title: 'Peptide calculator',
    description: 'Reconstitution and dosing calculator — port from legacy storefront or embed as a client tool.',
    primaryLabel: 'Browse catalog',
    primaryHref: '/products',
  },
};
