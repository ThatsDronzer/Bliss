import type { Review, ListingReview } from '@domain/interfaces/review';

export interface IReviewService {
  createReview(data: Omit<Review, 'id' | 'createdAt'>): Promise<Review>;
  getReviews(targetId: string, targetType: 'service' | 'vendor'): Promise<Review[]>;
  deleteReview(reviewId: string): Promise<void>;
  createListingReview(data: { listingId: string; comment: string; rating: number }): Promise<ListingReview>;
  deleteListingReview(reviewId: string): Promise<string>;
}


