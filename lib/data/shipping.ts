import { EXPRESS_SHIPPING_COST, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_COST } from '@/lib/cart/constants';

export type ShippingSection = {
  id: string;
  title: string;
  body: string;
};

export const SHIPPING_SECTIONS: ShippingSection[] = [
  {
    id: 'processing',
    title: 'Order processing',
    body: 'Orders are reviewed during business hours (Mon–Fri) in the sequence received. Same-day dispatch is typical for orders confirmed before 14:00 local time when inventory is in stock. High-volume periods may extend processing by one business day.',
  },
  {
    id: 'dispatch',
    title: 'Dispatch & tracking',
    body: 'When your parcel is handed to the courier, tracking details are sent to the email used at checkout. Cold-chain materials ship with desiccated primary containment inside unbranded outer cartons.',
  },
  {
    id: 'delivery',
    title: 'Delivery windows',
    body: 'Transit times depend on carrier service level, destination, and local conditions. Carrier delays, customs holds, or weather events are outside our direct control—support can help trace a shipment once tracking is active.',
  },
  {
    id: 'rates',
    title: 'Shipping rates',
    body: `Standard shipping is $${STANDARD_SHIPPING_COST} and complimentary on qualifying orders over $${FREE_SHIPPING_THRESHOLD}. Express service is $${EXPRESS_SHIPPING_COST} where available at checkout.`,
  },
  {
    id: 'receiving',
    title: 'Receiving at your institution',
    body: 'Designate a temperature-controlled receiving point where possible. Inspect outer packaging on delivery and contact support within 48 hours if the wrong SKU, quantity, or visible damage is noted—include photos of the shipping label.',
  },
];

export const SHIPPING_HIGHLIGHTS = [
  { label: 'Dispatch window', value: '24–48h' },
  { label: 'Free standard', value: `$${FREE_SHIPPING_THRESHOLD}+` },
  { label: 'Packaging', value: 'Discreet' },
  { label: 'Tracking', value: 'Email' },
] as const;
