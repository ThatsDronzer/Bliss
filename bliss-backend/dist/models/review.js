import mongoose, { Schema } from 'mongoose';
const ReviewSchema = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    targetId: { type: String, required: true },
    targetType: { type: String, enum: ['service', 'vendor'], required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
//# sourceMappingURL=review.js.map