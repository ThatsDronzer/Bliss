import type { IReviewService } from './review.service.interface.js';
import type { IReview } from '@models/review/review.model';
import {
	createReviewInDb,
	getReviewsByTargetFromDb,
	deleteReviewFromDb,
	createListingReviewInDb,
	deleteListingReviewFromDb,
	getListingReviewsFromDb,
} from '@repository/review/review.repository';
import { DBConnectionError } from '@exceptions/core.exceptions';
import { CREATE_REVIEW_ERROR, FETCH_REVIEW_ERROR } from '@exceptions/errors';

export class ReviewService implements IReviewService {
	async createReview(userId: string, reviewData: {
		targetId: string;
		targetType: 'service' | 'vendor';
		rating: number;
		comment: string;
		name: string;
		avatar?: string;
	}): Promise<IReview> {
		try {
			return await createReviewInDb(userId, reviewData);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(CREATE_REVIEW_ERROR.message);
		}
	}

	async getReviewsByTarget(targetId: string, targetType: 'service' | 'vendor'): Promise<IReview[]> {
		try {
			return await getReviewsByTargetFromDb(targetId, targetType);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(FETCH_REVIEW_ERROR.message);
		}
	}

	async deleteReview(userId: string, reviewId: string): Promise<boolean> {
		try {
			return await deleteReviewFromDb(userId, reviewId);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(FETCH_REVIEW_ERROR.message);
		}
	}

	async createListingReview(clerkUserId: string, reviewData: {
		listingId: string;
		comment: string;
		rating: number;
	}, clerkUser: any): Promise<any> {
		try {
			return await createListingReviewInDb(clerkUserId, reviewData, clerkUser);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(CREATE_REVIEW_ERROR.message);
		}
	}

	async deleteListingReview(clerkUserId: string, reviewId: string): Promise<string> {
		try {
			return await deleteListingReviewFromDb(clerkUserId, reviewId);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(FETCH_REVIEW_ERROR.message);
		}
	}

	async getListingReviews(listingId: string): Promise<any[]> {
		try {
			return await getListingReviewsFromDb(listingId);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(FETCH_REVIEW_ERROR.message);
		}
	}
}

