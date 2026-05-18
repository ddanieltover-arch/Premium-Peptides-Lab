export type ProductReview = {
  id: string;
  authorName: string;
  authorTitle?: string;
  institution?: string;
  rating: number;
  title?: string;
  body: string;
  createdAt: string;
};

export type ProductReviewSummary = {
  reviews: ProductReview[];
  averageRating: number;
  count: number;
};
