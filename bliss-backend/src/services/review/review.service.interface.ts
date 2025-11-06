import type { IReview, ICreateReviewInput } from '@models/review/review.model';

export interface IReviewService {
	createReview(userId: string, reviewData: {
		targetId: string;
		targetType: 'service' | 'vendor';
		rating: number;
		comment: string;
		name: string;
		avatar?: string;
	}): Promise<IReview>;
	getReviewsByTarget(targetId: string, targetType: 'service' | 'vendor'): Promise<IReview[]>;
	deleteReview(userId: string, reviewId: string): Promise<boolean>;
	createListingReview(clerkUserId: string, reviewData: {
		listingId: string;
		comment: string;
		rating: number;
	}, clerkUser: any): Promise<any>;
	deleteListingReview(clerkUserId: string, reviewId: string): Promise<string>;
	getListingReviews(listingId: string): Promise<any[]>;
}

