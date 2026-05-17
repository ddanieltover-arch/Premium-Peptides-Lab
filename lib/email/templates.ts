import { paymentMethodLabel, shippingMethodLabel } from '@/lib/checkout/paymentMethods';
import { SITE_EMAIL } from '@/lib/seo/site';
import { siteOrigin } from './constants';
import {
  emailAddressBlock,
  emailBadge,
  emailButton,
  emailDivider,
  emailGreeting,
  emailHeroOrderNumber,
  emailNotice,
  emailOrderLinesTable,
  emailPanel,
  emailParagraph,
  emailQuoteBlock,
  emailSupportLine,
  type OrderLineEmail,
} from './components';
import { escapeHtml } from './escape';
import { emailShell } from './layout';

const RUO_NOTICE =
  'Products are strictly for in-vitro research and analytical reference use. They are not intended for human or animal consumption, diagnosis, or therapeutic application.';

// ——— Contact ———

export function templateContactAdmin(opts: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): { subject: string; html: string } {
  const inner = [
    emailBadge('New inquiry', 'energy'),
    emailParagraph('A message was submitted through the website contact form.'),
    emailPanel(
      [
        { label: 'Name', value: escapeHtml(opts.name) },
        { label: 'Email', value: `<a href="mailto:${escapeHtml(opts.email)}" style="color:#4A9FE8;text-decoration:none;">${escapeHtml(opts.email)}</a>` },
        ...(opts.phone ? [{ label: 'Phone', value: escapeHtml(opts.phone) }] : []),
        { label: 'Subject', value: escapeHtml(opts.subject) },
      ],
      { title: 'Contact details' },
    ),
    emailQuoteBlock(opts.message),
    emailParagraph('<em>Reply-To is set to the customer address.</em>', { muted: true, marginBottom: 0 }),
  ].join('');

  return {
    subject: `[PPL Contact] ${opts.subject}`,
    html: emailShell({
      title: 'Website inquiry',
      preheader: `${opts.name} · ${opts.subject}`,
      innerHtml: inner,
      footerNote: 'Inbound contact · Premium Peptides Lab',
    }),
  };
}

export function templateContactAutoReplyCustomer(opts: { name: string }): { subject: string; html: string } {
  const origin = siteOrigin();
  const inner = [
    emailGreeting(opts.name),
    emailParagraph(
      'Thank you for reaching out to <strong>Premium Peptides Lab</strong>. We have received your message and a member of our technical support team will respond as soon as possible — typically within one business day.',
    ),
    emailPanel(
      [
        { label: 'Order questions', value: 'Include your <strong>PPL-</strong> order number' },
        { label: 'COA requests', value: 'Product name + batch ID from your certificate' },
        { label: 'Response window', value: 'Mon–Fri, 9:00 AM – 5:00 PM' },
      ],
      { title: 'Helpful references' },
    ),
    emailButton(`${origin}/products`, 'Browse catalog'),
    emailButton(`${origin}/coa`, 'COA library'),
    emailDivider(),
    emailSupportLine(SITE_EMAIL),
    emailNotice('Research use only', RUO_NOTICE),
  ].join('');

  return {
    subject: 'We received your message — Premium Peptides Lab',
    html: emailShell({
      title: 'Thank you',
      preheader: 'Your inquiry was received. We will reply shortly.',
      innerHtml: inner,
      variant: 'default',
    }),
  };
}

// ——— Orders ———

export function templateOrderConfirmationCustomer(opts: {
  customerName: string;
  orderNumber: string;
  orderId: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethodLabel: string;
  shippingSummary: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  lines: OrderLineEmail[];
  notes?: string | null;
}): { subject: string; html: string } {
  const origin = siteOrigin();
  const successUrl = `${origin}/checkout/success?orderId=${encodeURIComponent(opts.orderId)}&orderNumber=${encodeURIComponent(opts.orderNumber)}`;

  const inner = [
    emailBadge('Order confirmed', 'mint'),
    emailGreeting(opts.customerName),
    emailParagraph(
      'Thank you for your order. We have received it and will review payment and inventory allocation. You will receive fulfillment updates at this email address.',
    ),
    emailHeroOrderNumber(opts.orderNumber),
    emailPanel(
      [
        { label: 'Payment method', value: escapeHtml(opts.paymentMethodLabel) },
        { label: 'Shipping service', value: escapeHtml(opts.shippingSummary) },
        { label: 'Order total', value: `<strong>$${opts.total.toFixed(2)}</strong>`, highlight: true },
      ],
      { title: 'Order summary' },
    ),
    emailOrderLinesTable(opts.lines, {
      subtotal: opts.subtotal,
      shipping: opts.shippingCost,
      total: opts.total,
      shippingLabel: opts.shippingSummary,
    }),
    emailAddressBlock(opts.shippingAddress),
    opts.notes?.trim() ? emailQuoteBlock(`Order notes: ${opts.notes.trim()}`) : '',
    emailParagraph(
      'Complete payment using the instructions provided at checkout if you have not already done so. Orders are not released until payment is confirmed.',
      { muted: true },
    ),
    emailButton(successUrl, 'View order confirmation'),
    emailSupportLine(SITE_EMAIL),
    emailNotice('Research use only', RUO_NOTICE),
  ].join('');

  return {
    subject: `Order confirmed — ${opts.orderNumber}`,
    html: emailShell({
      title: 'Order received',
      preheader: `${opts.orderNumber} · $${opts.total.toFixed(2)} total`,
      innerHtml: inner,
      variant: 'success',
    }),
  };
}

export function templateOrderConfirmationAdmin(opts: {
  orderNumber: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethodLabel: string;
  shippingSummary: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  lines: OrderLineEmail[];
  notes?: string | null;
}): { subject: string; html: string } {
  const origin = siteOrigin();
  const inner = [
    emailBadge('New order', 'primary'),
    emailParagraph('A new storefront order was placed and saved to the database.'),
    emailHeroOrderNumber(opts.orderNumber),
    emailPanel(
      [
        { label: 'Customer', value: escapeHtml(opts.customerName) },
        {
          label: 'Email',
          value: `<a href="mailto:${escapeHtml(opts.customerEmail)}" style="color:#4A9FE8;">${escapeHtml(opts.customerEmail)}</a>`,
        },
        ...(opts.customerPhone
          ? [{ label: 'Phone', value: escapeHtml(opts.customerPhone) }]
          : []),
        { label: 'Payment', value: escapeHtml(opts.paymentMethodLabel) },
        { label: 'Shipping', value: escapeHtml(opts.shippingSummary) },
        { label: 'Total', value: `<strong>$${opts.total.toFixed(2)}</strong>`, highlight: true },
      ],
      { title: 'Customer & payment' },
    ),
    emailOrderLinesTable(opts.lines, {
      subtotal: opts.subtotal,
      shipping: opts.shippingCost,
      total: opts.total,
    }),
    emailAddressBlock(opts.shippingAddress),
    opts.notes?.trim() ? emailQuoteBlock(`Customer notes: ${opts.notes.trim()}`) : '',
    emailButton(`${origin}/products`, 'View storefront'),
    emailParagraph(`Internal order ID: <code style="font-family:monospace;font-size:12px;">${escapeHtml(opts.orderId)}</code>`, {
      muted: true,
      marginBottom: 0,
    }),
  ].join('');

  return {
    subject: `[PPL Admin] New order ${opts.orderNumber}`,
    html: emailShell({
      title: 'New order',
      preheader: `${opts.orderNumber} · ${opts.customerEmail} · $${opts.total.toFixed(2)}`,
      innerHtml: inner,
      footerNote: 'Admin notification · Premium Peptides Lab',
    }),
  };
}

export function templateOrderStatusCustomer(opts: {
  customerName: string;
  orderNumber: string;
  orderId: string;
  status: string;
  previousStatus?: string;
}): { subject: string; html: string } {
  const origin = siteOrigin();
  const successUrl = `${origin}/checkout/success?orderId=${encodeURIComponent(opts.orderId)}&orderNumber=${encodeURIComponent(opts.orderNumber)}`;

  const prevRow = opts.previousStatus
    ? emailPanel([
        { label: 'Previous status', value: escapeHtml(opts.previousStatus) },
        { label: 'Current status', value: escapeHtml(opts.status), highlight: true },
      ])
    : emailPanel([{ label: 'Current status', value: escapeHtml(opts.status), highlight: true }]);

  const inner = [
    emailGreeting(opts.customerName),
    emailParagraph(`Your order <strong>${escapeHtml(opts.orderNumber)}</strong> has been updated.`),
    prevRow,
    emailButton(successUrl, 'View order details'),
    emailSupportLine(SITE_EMAIL),
    emailNotice('Research use only', RUO_NOTICE),
  ].join('');

  return {
    subject: `Order ${opts.orderNumber} — ${opts.status}`,
    html: emailShell({
      title: 'Order update',
      preheader: `${opts.orderNumber} is now ${opts.status}`,
      innerHtml: inner,
      variant: 'default',
    }),
  };
}

export function templateOrderStatusAdmin(opts: {
  orderNumber: string;
  orderId: string;
  customerEmail: string;
  previousStatus: string;
  newStatus: string;
  actorEmail?: string;
}): { subject: string; html: string } {
  const inner = [
    emailBadge('Status change', 'energy'),
    emailParagraph('An order status was updated in the admin workflow.'),
    emailHeroOrderNumber(opts.orderNumber),
    emailPanel(
      [
        { label: 'Customer', value: escapeHtml(opts.customerEmail) },
        { label: 'Previous', value: escapeHtml(opts.previousStatus) },
        { label: 'New status', value: escapeHtml(opts.newStatus), highlight: true },
        ...(opts.actorEmail ? [{ label: 'Updated by', value: escapeHtml(opts.actorEmail) }] : []),
      ],
      { title: 'Status change' },
    ),
  ].join('');

  return {
    subject: `[PPL Admin] ${opts.orderNumber} → ${opts.newStatus}`,
    html: emailShell({
      title: 'Order status updated',
      preheader: `${opts.previousStatus} → ${opts.newStatus}`,
      innerHtml: inner,
      footerNote: 'Admin notification · Premium Peptides Lab',
      variant: 'alert',
    }),
  };
}

/** Build labels from raw checkout / DB values */
export function orderEmailLabels(paymentMethod: string, shippingMethod: string) {
  return {
    paymentMethodLabel: paymentMethodLabel(paymentMethod),
    shippingSummary: shippingMethodLabel(shippingMethod),
  };
}
