import { ReviewService } from '../services/review.service.js';
import { AppError } from '../middleware/error.middleware.js';
import { users } from '@clerk/clerk-sdk-node';
const reviewService = new ReviewService();
/**
 * POST /api/review
 * Create review (for service or vendor)
 */
export const createReview = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new AppError('Unauthorized', 401);
        }
        const { targetId, targetType, rating, comment, name, avatar } = req.body;
        const review = await reviewService.createReview(userId, {
            targetId,
            targetType,
            rating,
            comment,
            name,
            avatar,
        });
        res.status(201).json({ success: true, review });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('Missing required fields')) {
                const missingFields = error.message.split(': ')[1]?.split(', ') || [];
                return next(new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400));
            }
            if (error.message === 'Rating must be between 1 and 5') {
                return next(new AppError('Rating must be between 1 and 5', 400));
            }
            if (error.message === 'Invalid targetType') {
                return next(new AppError('Invalid targetType', 400));
            }
        }
        next(error);
    }
};
/**
 * GET /api/review
 * Get reviews by target
 */
export const getReviews = async (req, res, next) => {
    try {
        const targetId = req.query.targetId;
        const targetType = req.query.targetType;
        if (!targetId || !targetType) {
            throw new AppError('Missing targetId or targetType', 400);
        }
        const reviews = await reviewService.getReviewsByTarget(targetId, targetType);
        res.json({ reviews });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('Missing')) {
                return next(new AppError(error.message, 400));
            }
            if (error.message === 'Invalid targetType') {
                return next(new AppError('Invalid targetType', 400));
            }
        }
        next(error);
    }
};
/**
 * DELETE /api/review
 * Delete review
 */
export const deleteReview = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new AppError('Unauthorized', 401);
        }
        const reviewId = req.query.id;
        if (!reviewId) {
            throw new AppError('Missing review id', 400);
        }
        await reviewService.deleteReview(userId, reviewId);
        res.json({ success: true });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Missing review id') {
                return next(new AppError('Missing review id', 400));
            }
            if (error.message === 'Review not found') {
                return next(new AppError('Review not found', 404));
            }
            if (error.message.includes('Forbidden')) {
                return next(new AppError('Forbidden', 403));
            }
        }
        next(error);
    }
};
/**
 * POST /api/reviews
 * Create listing review
 */
export const createListingReview = async (req, res, next) => {
    try {
        const clerkUserId = req.userId;
        if (!clerkUserId) {
            throw new AppError('Unauthorized', 401);
        }
        const clerkUser = await users.getUser(clerkUserId);
        const { listingId, comment, rating } = req.body;
        const review = await reviewService.createListingReview(clerkUserId, { listingId, comment, rating }, clerkUser);
        res.status(201).json({
            message: 'Review created successfully',
            review,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('User profile incomplete')) {
                return next(new AppError(error.message, 400));
            }
            if (error.message.includes('Internal user not found')) {
                return next(new AppError(error.message, 404));
            }
            if (error.message === 'Listing not found') {
                return next(new AppError('Listing not found', 404));
            }
        }
        next(error);
    }
};
/**
 * DELETE /api/reviews
 * Delete listing review
 */
export const deleteListingReview = async (req, res, next) => {
    try {
        const clerkUserId = req.userId;
        if (!clerkUserId) {
            throw new AppError('Unauthorized', 401);
        }
        const { reviewId } = req.body;
        if (!reviewId) {
            throw new AppError('Review ID is required', 400);
        }
        const deletedReviewId = await reviewService.deleteListingReview(clerkUserId, reviewId);
        res.json({
            message: 'Review deleted successfully',
            deletedReviewId,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Review not found') {
                return next(new AppError('Review not found', 404));
            }
            if (error.message.includes('Internal user not found')) {
                return next(new AppError(error.message, 404));
            }
            if (error.message.includes('can only delete your own')) {
                return next(new AppError(error.message, 403));
            }
        }
        next(error);
    }
};
//# sourceMappingURL=review.controller.js.map