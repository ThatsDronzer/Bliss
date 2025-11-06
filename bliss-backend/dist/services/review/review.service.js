import { createReviewInDb, getReviewsByTargetFromDb, deleteReviewFromDb, createListingReviewInDb, deleteListingReviewFromDb, getListingReviewsFromDb, } from '@repository/review/review.repository';
import { DBConnectionError } from '@exceptions/core.exceptions';
import { CREATE_REVIEW_ERROR, FETCH_REVIEW_ERROR } from '@exceptions/errors';
export class ReviewService {
    async createReview(userId, reviewData) {
        try {
            return await createReviewInDb(userId, reviewData);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(CREATE_REVIEW_ERROR.message);
        }
    }
    async getReviewsByTarget(targetId, targetType) {
        try {
            return await getReviewsByTargetFromDb(targetId, targetType);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(FETCH_REVIEW_ERROR.message);
        }
    }
    async deleteReview(userId, reviewId) {
        try {
            return await deleteReviewFromDb(userId, reviewId);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(FETCH_REVIEW_ERROR.message);
        }
    }
    async createListingReview(clerkUserId, reviewData, clerkUser) {
        try {
            return await createListingReviewInDb(clerkUserId, reviewData, clerkUser);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(CREATE_REVIEW_ERROR.message);
        }
    }
    async deleteListingReview(clerkUserId, reviewId) {
        try {
            return await deleteListingReviewFromDb(clerkUserId, reviewId);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(FETCH_REVIEW_ERROR.message);
        }
    }
    async getListingReviews(listingId) {
        try {
            return await getListingReviewsFromDb(listingId);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(FETCH_REVIEW_ERROR.message);
        }
    }
}
//# sourceMappingURL=review.service.js.map