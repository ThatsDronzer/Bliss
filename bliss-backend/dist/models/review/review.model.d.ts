export interface IReview {
    _id?: string;
    userId?: string;
    name?: string;
    avatar?: string;
    targetId?: string;
    targetType?: 'service' | 'vendor';
    rating: number;
    comment: string;
    user?: string;
    listing?: string;
    username?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ICreateReviewInput {
    userId?: string;
    name?: string;
    avatar?: string;
    targetId?: string;
    targetType?: 'service' | 'vendor';
    rating: number;
    comment: string;
    user?: string;
    listing?: string;
    username?: string;
}
export interface IUpdateReviewInput {
    rating?: number;
    comment?: string;
}
//# sourceMappingURL=review.model.d.ts.map