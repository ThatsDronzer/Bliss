import type { Request, Response, NextFunction } from 'express';
import {
	createReviewInDb,
	getReviewsByTargetFromDb,
	deleteReviewFromDb,
	createListingReviewInDb,
	deleteListingReviewFromDb,
} from '@repository/review/review.repository';
import { BadRequestError, UnauthorizedError, NotFoundError, ForbiddenError, DBConnectionError } from '@exceptions/core.exceptions';
import { sendSuccessResponse } from '@utils/Response.utils';
import { users } from '@clerk/clerk-sdk-node';
import { REVIEW_ERROR } from '@exceptions/errors';

export async function createReview(req: Request, res: Response, next: NextFunction) {
	try {
		const userId = req.userId;

		if (!userId) {
			throw new UnauthorizedError('Unauthorized');
		}

		const { targetId, targetType, rating, comment, name, avatar } = req.body;

		const review = await createReviewInDb(userId, {
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
		if (error instanceof DBConnectionError) {
			return next(error);
		}
		
		if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
			return next(error);
		}
		
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
		
		console.error('Error while createReview()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: { targetId: req.body.targetId, targetType: req.body.targetType },
		});
		
		next(new Error(REVIEW_ERROR.message));
	}
}

export async function getReviews(req: Request, res: Response, next: NextFunction) {
	try {
		const targetId = req.query.targetId as string;
		const targetType = req.query.targetType as 'service' | 'vendor';

		if (!targetId || !targetType) {
			throw new BadRequestError('Missing targetId or targetType');
		}

		const reviews = await getReviewsByTargetFromDb(targetId, targetType);

		return sendSuccessResponse(res, { reviews });
	} catch (error) {
		if (error instanceof DBConnectionError) {
			return next(error);
		}
		
		if (error instanceof BadRequestError) {
			return next(error);
		}
		
		if (error instanceof Error) {
			if (error.message.includes('Missing')) {
				return next(new BadRequestError(error.message));
			}
			if (error.message === 'Invalid targetType') {
				return next(new BadRequestError('Invalid targetType'));
			}
		}
		
		console.error('Error while getReviews()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: { targetId: req.query.targetId, targetType: req.query.targetType },
		});
		
		next(new Error(REVIEW_ERROR.message));
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

		await deleteReviewFromDb(userId, reviewId);

		return sendSuccessResponse(res, {}, 'Review deleted successfully');
	} catch (error) {
		if (error instanceof DBConnectionError) {
			return next(error);
		}
		
		if (error instanceof UnauthorizedError || error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
			return next(error);
		}
		
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
		
		console.error('Error while deleteReview()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: { reviewId: req.query.id },
		});
		
		next(new Error(REVIEW_ERROR.message));
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

		const review = await createListingReviewInDb(
			clerkUserId,
			{ listingId, comment, rating },
			clerkUser
		);

		return sendSuccessResponse(res, {
			review,
		}, 'Review created successfully', 201);
	} catch (error) {
		if (error instanceof DBConnectionError) {
			return next(error);
		}
		
		if (error instanceof UnauthorizedError || error instanceof BadRequestError || error instanceof NotFoundError) {
			return next(error);
		}
		
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
		
		console.error('Error while createListingReview()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: { listingId: req.body.listingId },
		});
		
		next(new Error(REVIEW_ERROR.message));
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

		const deletedReviewId = await deleteListingReviewFromDb(
			clerkUserId,
			reviewId
		);

		return sendSuccessResponse(res, {
			deletedReviewId,
		}, 'Review deleted successfully');
	} catch (error) {
		if (error instanceof DBConnectionError) {
			return next(error);
		}
		
		if (error instanceof UnauthorizedError || error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
			return next(error);
		}
		
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
		
		console.error('Error while deleteListingReview()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: { reviewId: req.body.reviewId },
		});
		
		next(new Error(REVIEW_ERROR.message));
	}
}

