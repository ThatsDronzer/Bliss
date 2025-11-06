import mongoose, { Document } from 'mongoose';
export interface IReview extends Document {
    userId: string;
    name: string;
    avatar: string;
    targetId: string;
    targetType: 'service' | 'vendor';
    rating: number;
    comment: string;
    createdAt: Date;
}
declare const _default: mongoose.Model<any, {}, {}, {}, any, any>;
export default _default;
//# sourceMappingURL=review.d.ts.map