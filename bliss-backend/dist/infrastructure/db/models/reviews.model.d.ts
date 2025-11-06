import mongoose, { Document, Types } from 'mongoose';
export interface IReview extends Document {
    user: Types.ObjectId;
    listing: Types.ObjectId;
    username: string;
    comment: string;
    rating: number;
    createdAt?: Date;
}
declare const Review: mongoose.Model<any, {}, {}, {}, any, any>;
export default Review;
//# sourceMappingURL=reviews.model.d.ts.map