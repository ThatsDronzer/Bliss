import mongoose, { Schema } from 'mongoose';
const MessageDataSchema = new Schema({
    user: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        address: {
            houseNo: { type: String },
            areaName: { type: String },
            landmark: { type: String },
            state: { type: String },
            pin: { type: String }
        }
    },
    vendor: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        service: { type: String, required: true },
        service_address: {
            State: { type: String },
            City: { type: String },
            location: { type: String },
            pinCode: { type: String }
        }
    },
    listing: {
        id: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        basePrice: { type: Number, required: true },
        location: { type: String, required: true }
    },
    bookingDetails: {
        selectedItems: [{
                name: { type: String, required: true },
                description: { type: String, required: true },
                price: { type: Number, required: true },
                image: {
                    url: { type: String },
                    public_id: { type: String }
                }
            }],
        totalPrice: { type: Number, required: true },
        bookingDate: { type: Date, required: true },
        bookingTime: { type: String },
        address: {
            houseNo: { type: String, required: true },
            areaName: { type: String, required: true },
            landmark: { type: String, required: true },
            state: { type: String, required: true },
            pin: { type: String, required: true }
        },
        specialInstructions: { type: String },
        status: {
            type: String,
            enum: ['accepted', 'not-accepted', 'pending'],
            default: 'pending'
        }
    },
    paymentStatus: {
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending'
        },
        paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
        paidAt: { type: Date }
    }
}, {
    timestamps: true
});
// Index for better query performance
MessageDataSchema.index({ 'user.id': 1, createdAt: -1 });
MessageDataSchema.index({ 'vendor.id': 1, createdAt: -1 });
MessageDataSchema.index({ 'bookingDetails.status': 1 });
MessageDataSchema.index({ 'paymentStatus.status': 1 });
const MessageData = mongoose.models.MessageData || mongoose.model('MessageData', MessageDataSchema);
export default MessageData;
//# sourceMappingURL=message.model.js.map