import { DBConnectionError } from '@exceptions/core.exceptions';
import { dbConnect } from '@repository/repository';
import Review from '../../infrastructure/db/models/review.model.js';
import Reviews from '../../infrastructure/db/models/reviews.model.js';
import Listing from '../../infrastructure/db/models/listing.model.js';
import User from '../../infrastructure/db/models/user.model.js';
import type { IReview, ICreateReviewInput, IUpdateReviewInput } from '@models/review/review.model';

export async function createReviewInDb(userId: string, reviewData: {
	targetId: string;
	targetType: 'service' | 'vendor';
	rating: number;
	comment: string;
	name: string;
	avatar?: string;
}): Promise<IReview> {
	try {
		await dbConnect();

		const { targetId, targetType, rating, comment, name, avatar } = reviewData;

		if (!targetId || !targetType || !rating || !comment || !name) {
			const missingFields = [];
			if (!targetId) missingFields.push('targetId');
			if (!targetType) missingFields.push('targetType');
			if (!rating) missingFields.push('rating');
			if (!comment) missingFields.push('comment');
			if (!name) missingFields.push('name');
			throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
		}

		if (rating < 1 || rating > 5) {
			throw new Error('Rating must be between 1 and 5');
		}

		if (!['service', 'vendor'].includes(targetType)) {
			throw new Error('Invalid targetType');
		}

		const review = new Review({
			userId,
			targetId,
			targetType,
			rating,
			comment,
			name,
			avatar: avatar || '/placeholder-user.jpg',
		});

		await review.save();
		return review.toObject() as IReview;
	} catch (error: any) {
		if (error instanceof DBConnectionError) throw error;
		
		// Re-throw validation errors
		if (error instanceof Error && (
			error.message.includes('Missing required fields') ||
			error.message === 'Rating must be between 1 and 5' ||
			error.message === 'Invalid targetType'
		)) {
			throw error;
		}
		
		console.error('Error while createReviewInDb()', {
			error: error.message,
			stack: error.stack,
			data: { userId, ...reviewData },
		});
		
		throw new DBConnectionError('Failed to create review in database');
	}
}

export async function getReviewsByTargetFromDb(targetId: string, targetType: 'service' | 'vendor'): Promise<IReview[]> {
	try {
		await dbConnect();

		if (!targetId || !targetType) {
			throw new Error('Missing targetId or targetType');
		}

		if (!['service', 'vendor'].includes(targetType)) {
			throw new Error('Invalid targetType');
		}

		const reviews = await Review.find({ targetId, targetType })
			.sort({ createdAt: -1 })
			.limit(50)
			.lean();

		return reviews as unknown as IReview[];
	} catch (error: any) {
		if (error instanceof DBConnectionError) throw error;
		
		// Re-throw validation errors
		if (error instanceof Error && (
			error.message.includes('Missing') ||
			error.message === 'Invalid targetType'
		)) {
			throw error;
		}
		
		console.error('Error while getReviewsByTargetFromDb()', {
			error: error.message,
			stack: error.stack,
			data: { targetId, targetType },
		});
		
		throw new DBConnectionError('Failed to fetch reviews from database');
	}
}

export async function deleteReviewFromDb(userId: string, reviewId: string): Promise<boolean> {
	try {
		await dbConnect();

		const review = await Review.findById(reviewId);
		if (!review) {
			throw new Error('Review not found');
		}

		if (review.userId !== userId) {
			throw new Error('Forbidden: Cannot delete other user\'s review');
		}

		await Review.deleteOne({ _id: reviewId });
		return true;
	} catch (error: any) {
		if (error instanceof DBConnectionError) throw error;
		
		// Re-throw validation errors
		if (error instanceof Error && (
			error.message === 'Review not found' ||
			error.message.includes('Forbidden')
		)) {
			throw error;
		}
		
		console.error('Error while deleteReviewFromDb()', {
			error: error.message,
			stack: error.stack,
			data: { userId, reviewId },
		});
		
		throw new DBConnectionError('Failed to delete review from database');
	}
}

export async function createListingReviewInDb(clerkUserId: string, reviewData: {
	listingId: string;
	comment: string;
	rating: number;
}, clerkUser: any): Promise<any> {
	try {
		await dbConnect();

		const { listingId, comment, rating } = reviewData;

		const username =
			clerkUser.username ||
			`${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();

		if (!username) {
			throw new Error('User profile incomplete. Missing username or name from Clerk.');
		}

		const internalUser = await User.findOne({ clerkId: clerkUserId });
		if (!internalUser) {
			throw new Error('Internal user not found. Please ensure your account is set up.');
		}

		const listing = await Listing.findById(listingId);
		if (!listing) {
			throw new Error('Listing not found');
		}

		const review = new Reviews({
			user: internalUser._id,
			listing: listing._id,
			username,
			comment,
			rating,
		});

		await review.save();

		if (!Array.isArray(listing.reviews)) {
			listing.reviews = [];
		}
		listing.reviews.push(review._id);
		await listing.save();

		return review.toObject();
	} catch (error: any) {
		if (error instanceof DBConnectionError) throw error;
		
		// Re-throw validation errors
		if (error instanceof Error && (
			error.message.includes('User profile incomplete') ||
			error.message.includes('Internal user not found') ||
			error.message === 'Listing not found'
		)) {
			throw error;
		}
		
		console.error('Error while createListingReviewInDb()', {
			error: error.message,
			stack: error.stack,
			data: { clerkUserId, ...reviewData },
		});
		
		throw new DBConnectionError('Failed to create listing review in database');
	}
}

export async function deleteListingReviewFromDb(clerkUserId: string, reviewId: string): Promise<string> {
	try {
		await dbConnect();

		const review = await Reviews.findById(reviewId);
		if (!review) {
			throw new Error('Review not found');
		}

		const internalUser = await User.findOne({ clerkId: clerkUserId });
		if (!internalUser) {
			throw new Error('Internal user not found');
		}

		if (review.user.toString() !== internalUser._id.toString()) {
			throw new Error('You can only delete your own reviews');
		}

		await Reviews.deleteOne({ _id: reviewId });

		await Listing.updateOne({ _id: review.listing }, { $pull: { reviews: reviewId } });

		return reviewId;
	} catch (error: any) {
		if (error instanceof DBConnectionError) throw error;
		
		// Re-throw validation errors
		if (error instanceof Error && (
			error.message === 'Review not found' ||
			error.message.includes('Internal user not found') ||
			error.message.includes('can only delete your own')
		)) {
			throw error;
		}
		
		console.error('Error while deleteListingReviewFromDb()', {
			error: error.message,
			stack: error.stack,
			data: { clerkUserId, reviewId },
		});
		
		throw new DBConnectionError('Failed to delete listing review from database');
	}
}

export async function getListingReviewsFromDb(listingId: string): Promise<any[]> {
	try {
		await dbConnect();

		const reviews = await Reviews.find({ listing: listingId })
			.populate('user', 'name email')
			.sort({ createdAt: -1 })
			.lean();

		return reviews;
	} catch (error: any) {
		if (error instanceof DBConnectionError) throw error;
		
		console.error('Error while getListingReviewsFromDb()', {
			error: error.message,
			stack: error.stack,
			data: { listingId },
		});
		
		throw new DBConnectionError('Failed to fetch listing reviews from database');
	}
}

