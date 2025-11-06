import Review from '../models/review.js';
import Reviews from '../models/reviews.js';
import Listing from '../models/listing.js';
import User from '../models/user.js';
import dbConnect from '../utils/dbConnect.js';
export class ReviewService {
    /**
     * Create review (for service or vendor)
     */
    async createReview(userId, reviewData) {
        await dbConnect();
        const { targetId, targetType, rating, comment, name, avatar } = reviewData;
        // Validate required fields
        if (!targetId || !targetType || !rating || !comment || !name) {
            const missingFields = [];
            if (!targetId)
                missingFields.push('targetId');
            if (!targetType)
                missingFields.push('targetType');
            if (!rating)
                missingFields.push('rating');
            if (!comment)
                missingFields.push('comment');
            if (!name)
                missingFields.push('name');
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }
        // Validate rating range
        if (rating < 1 || rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }
        // Validate targetType
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
        return review;
    }
    /**
     * Get reviews by target (service or vendor)
     */
    async getReviewsByTarget(targetId, targetType) {
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
        return reviews;
    }
    /**
     * Delete review
     */
    async deleteReview(userId, reviewId) {
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
    }
    /**
     * Create listing review (different model)
     */
    async createListingReview(clerkUserId, reviewData, clerkUser) {
        await dbConnect();
        const { listingId, comment, rating } = reviewData;
        const username = clerkUser.username ||
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
        return review;
    }
    /**
     * Delete listing review
     */
    async deleteListingReview(clerkUserId, reviewId) {
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
    }
}
//# sourceMappingURL=review.service.js.map