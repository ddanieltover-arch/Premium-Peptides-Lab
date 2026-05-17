export type ResearchTopic = {
  tag: string;
  title: string;
  blurb: string;
  readMinutes: number;
};

export const RESEARCH_TOPICS: ResearchTopic[] = [
  {
    tag: 'Metabolic',
    title: 'GLP-1 receptor pharmacology in metabolic models',
    blurb:
      'Orientation to incretin-class peptides in insulin secretion, gastric emptying, and energy-balance readouts used in preclinical systems.',
    readMinutes: 8,
  },
  {
    tag: 'Regenerative',
    title: 'BPC-157 and extracellular repair signalling',
    blurb:
      'Survey of angiogenic and focal-adhesion pathways implicated in tissue-remodelling assays with synthetic pentadecapeptide tools.',
    readMinutes: 6,
  },
  {
    tag: 'Regenerative',
    title: 'Thymosin beta-4 fragments and actin dynamics',
    blurb:
      'TB-500-class sequences in migration assays, wound-repair models, and cytoskeletal regulation endpoints.',
    readMinutes: 5,
  },
  {
    tag: 'Mitochondrial',
    title: 'Mitochondrial-derived peptides in stress adaptation',
    blurb:
      'MOTS-c, humanin, and related peptides in AMPK-linked metabolic regulation—framed for in-vitro experimental design.',
    readMinutes: 7,
  },
  {
    tag: 'Longevity',
    title: 'Epithalon and telomere biology (research overview)',
    blurb:
      'Chronobiology and telomere-associated literature without therapeutic claims—strictly preclinical context.',
    readMinutes: 4,
  },
  {
    tag: 'Analytical',
    title: 'Orthogonal identity confirmation for peptide lots',
    blurb:
      'When to pair HPLC release data with LC–MS identity, and how batch traceability supports institutional review packages.',
    readMinutes: 5,
  },
];

export const RESEARCH_STATS = [
  { value: '20+', label: 'Briefs (expanding)' },
  { value: 'RUO', label: 'Research context' },
  { value: 'COA', label: 'Per qualified lot' },
  { value: 'HPLC', label: 'Release standard' },
] as const;
