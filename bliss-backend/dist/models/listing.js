import mongoose, { Schema, model } from 'mongoose';
const listingImageSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    }
});
const listingItemSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: listingImageSchema,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
});
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    images: [listingImageSchema],
    isActive: {
        type: Boolean,
        default: true,
    },
    features: {
        type: [String],
        default: [],
    },
    location: {
        type: String,
        required: true,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
    },
    items: [listingItemSchema],
}, { timestamps: true });
const Listing = mongoose.models.Service || model('Service', listingSchema);
export default Listing;
//# sourceMappingURL=listing.js.map