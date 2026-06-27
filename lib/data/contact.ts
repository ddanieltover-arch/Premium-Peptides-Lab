import { SITE_EMAIL } from '@/lib/seo/site';

export const CONTACT_CHANNELS = [
  {
    id: 'email',
    title: 'Email',
    value: SITE_EMAIL,
    href: `mailto:${SITE_EMAIL}`,
  },
  {
    id: 'hours',
    title: 'Support hours',
    value: 'Mon–Fri, 9:00 AM – 5:00 PM (US)',
    href: undefined,
  },
  {
    id: 'response',
    title: 'Typical response',
    value: 'Within one business day',
    href: undefined,
  },
] as const;

export const CONTACT_TIPS = [
  'Include your PPL- order number for shipping or payment questions.',
  'For COA requests, provide catalog product name and batch ID from your certificate.',
  'Shipping and policy answers are in the FAQ and on this site’s shipping page.',
] as const;

export const CONTACT_SUBJECTS = [
  { value: 'order', label: 'Order & shipping' },
  { value: 'coa', label: 'COA / documentation' },
  { value: 'product', label: 'Product availability' },
  { value: 'billing', label: 'Billing / payment' },
  { value: 'other', label: 'Other' },
] as const;
