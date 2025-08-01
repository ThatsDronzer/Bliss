
import mongoose, { Document, Schema, Types, model } from 'mongoose';

export interface IReview extends Document {
  user: Types.ObjectId;              // Reference to User
  listing: Types.ObjectId;         // Reference to Listing

  username: string;                  // Username of reviewer
  comment: string;                   // Review comment
  rating: number;                    // Rating from 1 to 5
  createdAt?: Date;                  // Optional created date
}

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    listing: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Review = mongoose.models.Review || model<IReview>('Review', reviewSchema);
export default Review;

