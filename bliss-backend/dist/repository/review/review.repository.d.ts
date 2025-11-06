import type { IReview } from '@models/review/review.model';
export declare function createReviewInDb(userId: string, reviewData: {
    targetId: string;
    targetType: 'service' | 'vendor';
    rating: number;
    comment: string;
    name: string;
    avatar?: string;
}): Promise<IReview>;
export declare function getReviewsByTargetFromDb(targetId: string, targetType: 'service' | 'vendor'): Promise<IReview[]>;
export declare function deleteReviewFromDb(userId: string, reviewId: string): Promise<boolean>;
export declare function createListingReviewInDb(clerkUserId: string, reviewData: {
    listingId: string;
    comment: string;
    rating: number;
}, clerkUser: any): Promise<any>;
export declare function deleteListingReviewFromDb(clerkUserId: string, reviewId: string): Promise<string>;
export declare function getListingReviewsFromDb(listingId: string): Promise<any[]>;
//# sourceMappingURL=review.repository.d.ts.map