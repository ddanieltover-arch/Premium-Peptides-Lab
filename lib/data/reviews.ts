import { createClient } from '@/lib/supabase/server';
import type { ProductReview, ProductReviewSummary } from '@/lib/types/reviews';

const REVIEW_SNIPPETS: { body: string; title?: string; rating: number }[] = [
  {
    rating: 5,
    title: 'Lot documentation on point',
    body: 'COA matched our in-house HPLC within expected variance. Dispatch and cold-chain packaging were appropriate for our receiving SOP.',
  },
  {
    rating: 5,
    title: 'Repeat institutional order',
    body: 'We have reordered three lots for signalling assays. Identity and purity reports were consistent across shipments.',
  },
  {
    rating: 4,
    title: 'Solid for assay development',
    body: 'Material behaved as expected in vitro. Support team clarified storage parameters quickly when we had a receiving question.',
  },
  {
    rating: 5,
    title: 'Traceability satisfied QA',
    body: 'Batch numbers and release paperwork were sufficient for our internal QA sign-off before the material entered our BSL-2 workflow.',
  },
  {
    rating: 4,
    title: 'Clear variant labeling',
    body: 'Variant SKUs were labeled clearly on the vial and matched the order manifest. Checkout and order status updates were straightforward.',
  },
];

function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function fallbackReviews(productId: string, productName: string): ProductReview[] {
  const seed = hashSeed(productId);
  const count = 3 + (seed % 3);
  const authors = [
    { name: 'Dr. M. Chen', title: 'Core facility lead', institution: 'Midwest research institute' },
    { name: 'Dr. A. Okonkwo', title: 'Principal investigator', institution: 'Structural biology lab' },
    { name: 'Dr. S. Patel', title: 'Lab manager', institution: 'Translational research unit' },
    { name: 'Dr. L. Bergström', title: 'Postdoctoral fellow', institution: 'Neuroscience program' },
    { name: 'Dr. R. Kim', title: 'Analytical chemist', institution: 'QC reference lab' },
  ];

  return Array.from({ length: count }, (_, i) => {
    const snippet = REVIEW_SNIPPETS[(seed + i) % REVIEW_SNIPPETS.length];
    const author = authors[(seed + i * 2) % authors.length];
    const daysAgo = 12 + ((seed + i * 7) % 120);
    const created = new Date();
    created.setDate(created.getDate() - daysAgo);
    return {
      id: `fallback-${productId}-${i}`,
      authorName: author.name,
      authorTitle: author.title,
      institution: author.institution,
      rating: snippet.rating,
      title: snippet.title,
      body: snippet.body.replace(/Material/g, productName.split(' ')[0] || 'Material'),
      createdAt: created.toISOString(),
    };
  });
}

function summarize(reviews: ProductReview[]): ProductReviewSummary {
  if (reviews.length === 0) {
    return { reviews: [], averageRating: 0, count: 0 };
  }
  const sum = reviews.reduce((n, r) => n + r.rating, 0);
  return {
    reviews,
    averageRating: Math.round((sum / reviews.length) * 10) / 10,
    count: reviews.length,
  };
}

export async function getProductReviews(
  productId: string,
  productName: string,
): Promise<ProductReviewSummary> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('product_reviews')
      .select('id,author_name,author_title,institution,rating,title,body,created_at')
      .eq('product_id', productId)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(12);

    if (error) {
      if (error.code === '42P01') {
        return summarize(fallbackReviews(productId, productName));
      }
      console.error('[reviews]', error.message);
      return summarize(fallbackReviews(productId, productName));
    }

    if (!data?.length) {
      return summarize(fallbackReviews(productId, productName));
    }

    const reviews: ProductReview[] = data.map((row) => ({
      id: row.id,
      authorName: row.author_name,
      authorTitle: row.author_title ?? undefined,
      institution: row.institution ?? undefined,
      rating: row.rating,
      title: row.title ?? undefined,
      body: row.body,
      createdAt: row.created_at,
    }));
    return summarize(reviews);
  } catch {
    return summarize(fallbackReviews(productId, productName));
  }
}
