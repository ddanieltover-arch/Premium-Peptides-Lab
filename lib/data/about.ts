import { PILLARS } from '@/lib/data/home-content';

export const ABOUT_STATS = [
  { value: '≥99%', label: 'HPLC release target' },
  { value: 'RUO', label: 'Research context' },
  { value: 'COA', label: 'Per qualified lot' },
  { value: '24–48h', label: 'Dispatch window' },
] as const;

export const ABOUT_VALUES = [
  {
    title: 'Analytical rigor',
    body: 'Release decisions are driven by quantitative chromatography and orthogonal identity checks—not marketing claims.',
  },
  {
    title: 'Batch traceability',
    body: 'Every shipment maps to documented lots suitable for institutional QA and IBC-style review packages.',
  },
  {
    title: 'Research-first logistics',
    body: 'Cold-chain handling, discreet outer packaging, and tracked courier services for receiving docks.',
  },
] as const;

export { PILLARS as ABOUT_PILLARS };
