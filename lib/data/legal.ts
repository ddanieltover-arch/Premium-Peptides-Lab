import { SITE_LINKS } from '@/lib/data/home-content';

export type LegalPageKey = 'privacy' | 'terms' | 'refunds';

export type LegalSection = {
  id: string;
  title: string;
  body: string;
  /** Emphasis panel for critical compliance language */
  emphasis?: boolean;
};

export type LegalPageContent = {
  key: LegalPageKey;
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
};

const LAST_UPDATED = 'May 2026';

export const LEGAL_PAGES: Record<LegalPageKey, LegalPageContent> = {
  privacy: {
    key: 'privacy',
    eyebrow: 'Legal',
    title: 'Privacy policy',
    description:
      'How Premium Peptides Lab collects, uses, and protects information when you browse, order, or contact support.',
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        id: 'collection',
        title: 'Information we collect',
        body: 'We collect information needed to fulfill research procurement requests: name, contact email and phone, shipping address, institutional references you provide, and order history. Payment card data is processed by third-party payment rails; we do not store full card numbers on our servers.',
      },
      {
        id: 'use',
        title: 'How we use information',
        body: 'Your data is used for order fulfillment, customer support, batch documentation (COA) delivery, and compliance with applicable law. We do not sell or lease personal data to third parties for unrelated marketing.',
      },
      {
        id: 'sharing',
        title: 'Service providers',
        body: 'We share data with carriers, payment processors, email providers, and hosting partners only as needed to operate the storefront. These providers are bound by contractual confidentiality and security obligations appropriate to their role.',
      },
      {
        id: 'security',
        title: 'Security',
        body: 'We use TLS encryption in transit and industry-standard access controls for systems that store order and account data. No method of transmission over the internet is fully secure; you share information at your own risk within those limits.',
      },
      {
        id: 'cookies',
        title: 'Cookies & local storage',
        body: 'Essential cookies and browser storage support cart, session, and wishlist functionality. We may use aggregated analytics to improve catalog performance. You can clear site data in your browser at any time.',
      },
      {
        id: 'institutional',
        title: 'Institutional discretion',
        body: 'We recognize the sensitive nature of laboratory procurement. Shipping labels and billing descriptors are designed to be discreet. Contact us if your institution requires specific receiving or invoicing conventions.',
      },
      {
        id: 'rights',
        title: 'Your choices',
        body: `You may request access, correction, or deletion of personal data associated with your orders by emailing ${SITE_LINKS.email}. We may retain records required for tax, fraud prevention, or legal compliance.`,
      },
    ],
  },
  terms: {
    key: 'terms',
    eyebrow: 'Legal',
    title: 'Terms of service',
    description:
      'Conditions governing use of premiumpeptideslab.online and purchase of research-use-only materials from Premium Peptides Lab.',
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        id: 'ruo',
        title: 'Research use only (RUO)',
        body: 'All products are sold strictly for in vitro and laboratory research. They are not for human or veterinary consumption, diagnosis, treatment, or clinical use. Products have not been evaluated by regulatory agencies for food, drug, or medical-device applications.',
      },
      {
        id: 'buyer',
        title: 'Buyer responsibility',
        body: 'You represent that you are qualified to handle research chemicals safely, that your institution permits acquisition, and that you will comply with applicable local, national, and export/import regulations. You assume all responsibility for storage, handling, and disposal.',
      },
      {
        id: 'orders',
        title: 'Orders & payment',
        body: 'Placing an order constitutes an offer we may accept or decline. Prices and availability may change without notice until checkout is confirmed. Payment must be completed per instructions provided after order placement; fulfillment may be delayed until payment is verified.',
      },
      {
        id: 'shipping',
        title: 'Shipping & import compliance',
        body: 'We ship in accordance with applicable carrier rules. You are responsible for legality of import and use in your jurisdiction. Premium Peptides Lab is not liable for customs seizure, delays, or refusals due to local restrictions.',
      },
      {
        id: 'ip',
        title: 'Intellectual property',
        body: 'Site content, branding, and documentation are owned by Premium Peptides Lab or licensors. You may not scrape, reproduce, or redistribute catalog data or COA assets except as needed for your institutional records of purchased lots.',
      },
      {
        id: 'liability',
        title: 'Limitation of liability',
        body: 'To the fullest extent permitted by law, Premium Peptides Lab and its affiliates are not liable for indirect, incidental, special, or consequential damages arising from product use, misuse, or inability to use products, even if advised of such possibility. Our aggregate liability for a given order is limited to amounts paid for that order.',
      },
      {
        id: 'no-consumption',
        title: 'Strict no-consumption policy',
        emphasis: true,
        body: 'Any indication that products will be used for human or animal consumption, self-administration, or non-research purposes may result in immediate cancellation of pending orders, refusal of future sales, and permanent account restriction without refund.',
      },
      {
        id: 'changes',
        title: 'Changes',
        body: 'We may update these terms by posting a revised version on this page. Continued use of the site after changes constitutes acceptance. Material changes to active orders will be communicated when practicable.',
      },
    ],
  },
  refunds: {
    key: 'refunds',
    eyebrow: 'Legal',
    title: 'Refund & replacement policy',
    description:
      'When refunds, credits, or reshipments may be available for Premium Peptides Lab orders.',
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        body: 'Research materials are temperature- and handling-sensitive. This policy explains how we address fulfillment errors, transit damage, and non-conforming shipments. It does not cover buyer mishandling after confirmed delivery.',
      },
      {
        id: 'eligible',
        title: 'Eligible issues',
        body: 'Wrong SKU, missing line items, demonstrable transit damage, or documented quality discrepancies against the COA for the shipped lot may qualify for replacement, credit, or refund review at our discretion.',
      },
      {
        id: 'window',
        title: 'Reporting window',
        body: 'Contact support within 48 hours of carrier delivery scan (or first reasonable receipt at your institution). Include your PPL- order number, batch ID if known, and clear photos of outer carton, label, and product condition.',
      },
      {
        id: 'process',
        title: 'Review process',
        body: `Email ${SITE_LINKS.email} with subject line "Order issue — [order number]". We typically respond within one business day. Approved resolutions may include reshipment of the same lot, replacement lot, or partial/full refund depending on circumstances.`,
      },
      {
        id: 'non-returnable',
        title: 'Non-returnable cases',
        body: 'Opened vials, reconstituted material, or products stored outside recommended conditions are generally not eligible unless we confirm a fulfillment error. Buyer remorse, customs delays, or incorrect ordering are not grounds for refund.',
      },
      {
        id: 'payment',
        title: 'Refunds to original payment method',
        body: 'Approved refunds are returned via the original payment rail when possible (card invoice reversal, transfer credit, etc.). Timing depends on your financial institution; crypto and manual rails may require alternative settlement.',
      },
    ],
  },
};

export const LEGAL_FOOTER_LINKS = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/refunds', label: 'Refunds' },
] as const;
