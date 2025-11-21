import mongoose, { Schema, Document } from 'mongoose';
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

const ReviewSchema: Schema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },           
  avatar: { type: String, required: true },         
  targetId: { type: String, required: true },
  targetType: { type: String, enum: ['service', 'vendor'], required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});


export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
