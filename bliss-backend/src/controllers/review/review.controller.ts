import type { Request, Response, NextFunction } from 'express';
import { ReviewService } from '@services/review/review.service';
import { BadRequestError, UnauthorizedError, NotFoundError, ForbiddenError } from '@exceptions/core.exceptions';
import { sendSuccessResponse } from '@utils/Response.utils';
import { users } from '@clerk/clerk-sdk-node';

const reviewService = new ReviewService();

export async function createReview(req: Request, res: Response, next: NextFunction) {
	try {
		const userId = req.userId;

		if (!userId) {
			throw new UnauthorizedError('Unauthorized');
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

		return sendSuccessResponse(res, {
			review,
		}, 'Review created successfully', 201);
	} catch (error) {
		if (error instanceof Error) {
			if (error.message.includes('Missing required fields')) {
				const missingFields = error.message.split(': ')[1]?.split(', ') || [];
				return next(new BadRequestError(`Missing required fields: ${missingFields.join(', ')}`));
			}
			if (error.message === 'Rating must be between 1 and 5') {
				return next(new BadRequestError('Rating must be between 1 and 5'));
			}
			if (error.message === 'Invalid targetType') {
				return next(new BadRequestError('Invalid targetType'));
			}
		}
		next(error);
	}
}

export async function getReviews(req: Request, res: Response, next: NextFunction) {
	try {
		const targetId = req.query.targetId as string;
		const targetType = req.query.targetType as 'service' | 'vendor';

		if (!targetId || !targetType) {
			throw new BadRequestError('Missing targetId or targetType');
		}

		const reviews = await reviewService.getReviewsByTarget(targetId, targetType);

		return sendSuccessResponse(res, { reviews });
	} catch (error) {
		if (error instanceof Error) {
			if (error.message.includes('Missing')) {
				return next(new BadRequestError(error.message));
			}
			if (error.message === 'Invalid targetType') {
				return next(new BadRequestError('Invalid targetType'));
			}
		}
		next(error);
	}
}

export async function deleteReview(req: Request, res: Response, next: NextFunction) {
	try {
		const userId = req.userId;

		if (!userId) {
			throw new UnauthorizedError('Unauthorized');
		}

		const reviewId = req.query.id as string;

		if (!reviewId) {
			throw new BadRequestError('Missing review id');
		}

		await reviewService.deleteReview(userId, reviewId);

		return sendSuccessResponse(res, {}, 'Review deleted successfully');
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === 'Missing review id') {
				return next(new BadRequestError('Missing review id'));
			}
			if (error.message === 'Review not found') {
				return next(new NotFoundError('Review not found'));
			}
			if (error.message.includes('Forbidden')) {
				return next(new ForbiddenError('Forbidden'));
			}
		}
		next(error);
	}
}

export async function createListingReview(req: Request, res: Response, next: NextFunction) {
	try {
		const clerkUserId = req.userId;

		if (!clerkUserId) {
			throw new UnauthorizedError('Unauthorized');
		}

		const clerkUser = await users.getUser(clerkUserId);
		const { listingId, comment, rating } = req.body;

		const review = await reviewService.createListingReview(
			clerkUserId,
			{ listingId, comment, rating },
			clerkUser
		);

		return sendSuccessResponse(res, {
			review,
		}, 'Review created successfully', 201);
	} catch (error) {
		if (error instanceof Error) {
			if (error.message.includes('User profile incomplete')) {
				return next(new BadRequestError(error.message));
			}
			if (error.message.includes('Internal user not found')) {
				return next(new NotFoundError(error.message));
			}
			if (error.message === 'Listing not found') {
				return next(new NotFoundError('Listing not found'));
			}
		}
		next(error);
	}
}

export async function deleteListingReview(req: Request, res: Response, next: NextFunction) {
	try {
		const clerkUserId = req.userId;

		if (!clerkUserId) {
			throw new UnauthorizedError('Unauthorized');
		}

		const { reviewId } = req.body;

		if (!reviewId) {
			throw new BadRequestError('Review ID is required');
		}

		const deletedReviewId = await reviewService.deleteListingReview(
			clerkUserId,
			reviewId
		);

		return sendSuccessResponse(res, {
			deletedReviewId,
		}, 'Review deleted successfully');
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === 'Review not found') {
				return next(new NotFoundError('Review not found'));
			}
			if (error.message.includes('Internal user not found')) {
				return next(new NotFoundError(error.message));
			}
			if (error.message.includes('can only delete your own')) {
				return next(new ForbiddenError(error.message));
			}
		}
		next(error);
	}
}

