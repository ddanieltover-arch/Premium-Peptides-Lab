import { FREE_SHIPPING_THRESHOLD } from '@/lib/cart/constants';

export type FaqItem = { q: string; a: string };

export type FaqCategory = {
  id: string;
  title: string;
  questions: FaqItem[];
};

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'product',
    title: 'Product & documentation',
    questions: [
      {
        q: 'Are your materials intended for human or veterinary use?',
        a: 'No. Premium Peptides Lab supplies amino-acid constructs strictly for in-vitro research and analytical reference use. They are not for human or animal consumption, diagnosis, or therapeutic application.',
      },
      {
        q: 'How should lyophilised peptides be stored?',
        a: 'Store sealed vials protected from light. Short-term: 2–8 °C. Long-term: −20 °C or below. Reconstituted solutions should follow your institutional SOP and the handling notes on the product page.',
      },
      {
        q: 'Do you provide certificates of analysis (COA)?',
        a: 'Yes. Each qualified lot is released with HPLC purity data and orthogonal identity confirmation where applicable. Browse the COA library or open the product page for lot-specific documentation links.',
      },
      {
        q: 'What purity should I expect at release?',
        a: 'Catalog materials target ≥99% primary peak area by HPLC unless otherwise noted on the COA. Actual release values are batch-specific and appear on the certificate.',
      },
    ],
  },
  {
    id: 'shipping',
    title: 'Shipping & fulfillment',
    questions: [
      {
        q: 'How quickly are orders dispatched?',
        a: 'Orders confirmed before 14:00 local time typically ship the same business day when inventory permits. You will receive tracking once the courier accepts the parcel.',
      },
      {
        q: 'Is packaging discreet?',
        a: 'Yes. Outer cartons are unbranded with no product descriptors on the exterior—suitable for institutional receiving docks.',
      },
      {
        q: 'When is standard shipping free?',
        a: `Standard shipping is complimentary on orders over $${FREE_SHIPPING_THRESHOLD}. Express options remain available at checkout.`,
      },
      {
        q: 'Do you ship internationally?',
        a: 'Export timelines and customs handling vary by destination. Contact technical support before placing large international orders so we can confirm documentation and lead times.',
      },
    ],
  },
  {
    id: 'orders',
    title: 'Orders & checkout',
    questions: [
      {
        q: 'Which payment methods are supported?',
        a: 'Checkout captures your order and preferred payment rail (card invoice, bank transfer, or crypto where enabled). You will receive instructions to complete payment after order placement.',
      },
      {
        q: 'Can I change or cancel an order?',
        a: 'Contact support immediately if you need to modify an order. Once material has entered cold-chain fulfillment we cannot guarantee changes.',
      },
      {
        q: 'How do I reference my order?',
        a: 'Your confirmation email includes an order number prefixed with PPL-. Quote this reference for batch lookups or shipping inquiries.',
      },
    ],
  },
  {
    id: 'compliance',
    title: 'Compliance & returns',
    questions: [
      {
        q: 'Who may purchase from Premium Peptides Lab?',
        a: 'Buyers must be qualified researchers or represent institutions with appropriate oversight for research-use-only materials. You are responsible for local regulations and internal governance.',
      },
      {
        q: 'What is your return policy?',
        a: 'Because compounds require temperature-controlled handling, we cannot accept returns after dispatch. If we shipped the wrong SKU or quantity, contact support within 48 hours of delivery with photos of the outer label.',
      },
      {
        q: 'Where can I get technical help on a specific lot?',
        a: 'Email support with your order number and catalog ID. For chromatogram or method questions, include the batch ID from your COA.',
      },
    ],
  },
];
