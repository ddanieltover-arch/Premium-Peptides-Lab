export const TAGLINE_WORDS = [
  'Research-grade',
  'peptides.',
  'Analytical',
  'rigor,',
  'without',
  'compromise.',
] as const;

export const PILLARS = [
  {
    title: 'Analytically bounded purity',
    body: 'Release specifications target ≥99.0% primary peak area by HPLC with orthogonal confirmation on representative lots. Each certificate maps to a single manufacturing batch.',
    stat: '≥99.0%',
    statLabel: 'release threshold',
  },
  {
    title: 'Independent verification',
    body: 'Third-party laboratories provide quantitative methods validation data. Mass spectrometry confirms molecular identity; residual solvent and counter-ion profiles are trended lot-to-lot.',
    stat: 'ISO 17025',
    statLabel: 'partner labs',
  },
  {
    title: 'Traceable synthesis',
    body: 'Solid-phase protocols with documented cleavage, folding, and lyophilization parameters. Chain-of-custody from raw amino acids through sterile filtration (where applicable).',
    stat: 'Full COA',
    statLabel: 'per shipment',
  },
  {
    title: 'Research-first logistics',
    body: 'Cold-chain dispatch with desiccated primary containment. Discreet outer packaging and insured, tracked courier services suitable for institutional receiving docks.',
    stat: '24–48h',
    statLabel: 'fulfillment window',
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      'Chromatograms on the latest lot matched our in-house retention-time standards within instrumental variance. Documentation was sufficient for our IBC submission package.',
    name: 'Dr. Elise K.',
    title: 'Principal Investigator, Molecular Pharmacology',
    lab: 'Midwestern Research Institute',
  },
  {
    quote:
      'We run duplicate HPLC on arrival; three consecutive orders from Premium Peptides Lab showed co-elution of the principal peak with our reference material at 99.2–99.6%.',
    name: 'Marcus Y.',
    title: 'Staff Scientist, Analytical Chemistry',
    lab: 'Pacific Coast University',
  },
  {
    quote:
      'The COA structure is what our QA group expects: method, instrument ID, chromatogram, and integrator report—no ambiguous screenshots.',
    name: 'Dr. Priya S.',
    title: 'Director, Core Peptide Facility',
    lab: 'Northline Biomedical Campus',
  },
] as const;

import { getPublicSiteUrl, SITE_EMAIL } from '@/lib/seo/site';

export const SITE_LINKS = {
  catalog: getPublicSiteUrl(),
  email: SITE_EMAIL,
} as const;
