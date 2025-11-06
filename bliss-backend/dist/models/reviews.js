import mongoose, { Schema, model } from 'mongoose';
const reviewSchema = new Schema({
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
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});
const Review = mongoose.models.Review || model('Review', reviewSchema);
export default Review;
//# sourceMappingURL=reviews.js.map