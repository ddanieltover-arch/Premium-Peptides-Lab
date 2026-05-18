export type CategoryHubHighlight = {
  label: string;
  value: string;
};

export type CategoryHubContent = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: CategoryHubHighlight[];
};

const HUB_BY_SLUG: Record<string, Omit<CategoryHubContent, 'title'> & { title?: string }> = {
  peptides: {
    eyebrow: 'Research peptides',
    title: 'Peptide standards',
    description:
      'Lyophilised and solution-ready peptides for structural biology, signalling assays, and analytical method development. Every qualified SKU includes batch traceability and HPLC release documentation.',
    highlights: [
      { label: 'Focus', value: 'Signalling & repair' },
      { label: 'Release', value: 'HPLC' },
      { label: 'Docs', value: 'COA / lot' },
    ],
  },
  injectables: {
    eyebrow: 'Injectable research',
    title: 'Injectable compounds',
    description:
      'Sterile-format research materials suited to parenteral protocol modelling in controlled laboratory settings. Verify storage and reconstitution parameters per COA.',
    highlights: [
      { label: 'Format', value: 'Vials' },
      { label: 'Dispatch', value: '24–48h' },
      { label: 'Chain', value: 'Cold-chain' },
    ],
  },
  'oral-tablets': {
    eyebrow: 'Oral research',
    title: 'Oral tablet compounds',
    description:
      'Compressed oral research forms for pharmacokinetic modelling and stability studies—research use only, not for administration.',
    highlights: [
      { label: 'Form', value: 'Tablets' },
      { label: 'Use', value: 'PK models' },
      { label: 'QC', value: 'Third-party' },
    ],
  },
  sarms: {
    eyebrow: 'SARM research',
    title: 'SARM catalog',
    description:
      'Selective androgen receptor modulators for receptor engagement and off-target margin studies. Identity confirmation available on representative lots.',
    highlights: [
      { label: 'Class', value: 'SARMs' },
      { label: 'Purity', value: '≥99%' },
      { label: 'Identity', value: 'LC–MS' },
    ],
  },
  hgh: {
    eyebrow: 'Growth axis',
    title: 'HGH research materials',
    description:
      'Growth-hormone-related research compounds for endocrine pathway investigation. Handle under institutional cold-storage protocols.',
    highlights: [
      { label: 'Storage', value: '2–8°C' },
      { label: 'Docs', value: 'COA' },
      { label: 'RUO', value: 'Only' },
    ],
  },
  pct: {
    eyebrow: 'PCT research',
    title: 'Post-cycle research',
    description:
      'Compounds used in endocrine recovery modelling and related in vitro assays. For qualified laboratories only.',
    highlights: [
      { label: 'Assays', value: 'In vitro' },
      { label: 'Lots', value: 'Tracked' },
      { label: 'Support', value: 'Technical' },
    ],
  },
  'anti-estrogen': {
    eyebrow: 'Anti-estrogen',
    title: 'Anti-estrogen research',
    description:
      'Materials for estrogen-pathway modulation studies in controlled research environments.',
    highlights: [
      { label: 'Pathway', value: 'Estrogen' },
      { label: 'Format', value: 'Varied' },
      { label: 'COA', value: 'Per lot' },
    ],
  },
  'fat-burners': {
    eyebrow: 'Metabolic research',
    title: 'Metabolic compounds',
    description:
      'Research tools for metabolic signalling, thermogenesis models, and related pathway work—strictly not for human use.',
    highlights: [
      { label: 'Focus', value: 'Metabolic' },
      { label: 'QC', value: 'HPLC' },
      { label: 'Ship', value: 'Discreet' },
    ],
  },
  'skin-care': {
    eyebrow: 'Dermal research',
    title: 'Skin care peptides',
    description:
      'Peptides and actives for extracellular-matrix and dermal research models in vitro.',
    highlights: [
      { label: 'Models', value: 'In vitro' },
      { label: 'Matrix', value: 'ECM' },
      { label: 'Purity', value: 'Documented' },
    ],
  },
  'sexual-health': {
    eyebrow: 'Signalling research',
    title: 'Sexual health research',
    description:
      'Compounds for vascular and signalling pathway research in laboratory settings.',
    highlights: [
      { label: 'Use', value: 'Lab only' },
      { label: 'Identity', value: 'Verified' },
      { label: 'Lots', value: 'COA' },
    ],
  },
  accessories: {
    eyebrow: 'Lab supplies',
    title: 'Accessories & supplies',
    description:
      'Supporting materials for peptide handling, reconstitution, and institutional receiving workflows.',
    highlights: [
      { label: 'Type', value: 'Supplies' },
      { label: 'Orders', value: 'Bundled' },
      { label: 'Support', value: 'Institutional' },
    ],
  },
};

export function getCategoryHubContent(
  slug: string,
  name: string,
  dbDescription?: string | null,
): CategoryHubContent {
  const preset = HUB_BY_SLUG[slug];
  const description =
    dbDescription?.trim() ||
    preset?.description ||
    `Browse active ${name} listings with documented release criteria and batch traceability. Research-use only (RUO).`;

  return {
    eyebrow: preset?.eyebrow ?? 'Category hub',
    title: preset?.title ?? name,
    description,
    highlights: preset?.highlights ?? [
      { label: 'Listings', value: 'Live' },
      { label: 'COA', value: 'Available' },
      { label: 'RUO', value: 'Only' },
    ],
  };
}
