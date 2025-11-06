export declare class ReviewService {
    /**
     * Create review (for service or vendor)
     */
    createReview(userId: string, reviewData: {
        targetId: string;
        targetType: 'service' | 'vendor';
        rating: number;
        comment: string;
        name: string;
        avatar?: string;
    }): Promise<any>;
    /**
     * Get reviews by target (service or vendor)
     */
    getReviewsByTarget(targetId: string, targetType: 'service' | 'vendor'): Promise<(import("mongoose").FlattenMaps<any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    /**
     * Delete review
     */
    deleteReview(userId: string, reviewId: string): Promise<boolean>;
    /**
     * Create listing review (different model)
     */
    createListingReview(clerkUserId: string, reviewData: {
        listingId: string;
        comment: string;
        rating: number;
    }, clerkUser: any): Promise<any>;
    /**
     * Delete listing review
     */
    deleteListingReview(clerkUserId: string, reviewId: string): Promise<string>;
}
//# sourceMappingURL=review.service.d.ts.map