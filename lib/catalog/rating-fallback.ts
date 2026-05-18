/** Client-safe deterministic ratings for cards (no Supabase). */

function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const SNIPPET_RATINGS = [5, 5, 4, 5, 4];

export function catalogRatingFallback(productId: string): { ratingAverage: number; ratingCount: number } {
  const seed = hashSeed(productId);
  const count = 3 + (seed % 3);
  const ratings = Array.from({ length: count }, (_, i) => SNIPPET_RATINGS[(seed + i) % SNIPPET_RATINGS.length]);
  const sum = ratings.reduce((n, r) => n + r, 0);
  return {
    ratingAverage: Math.round((sum / ratings.length) * 10) / 10,
    ratingCount: count,
  };
}
