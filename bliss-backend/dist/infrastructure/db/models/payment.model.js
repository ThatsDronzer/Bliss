import mongoose, { Schema } from 'mongoose';
const PaymentSchema = new Schema({
    message: { type: Schema.Types.ObjectId, ref: 'MessageData', required: true },
    user: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String }
    },
    vendor: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String }
    },
    listing: {
        id: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true }
    },
    amount: {
        total: { type: Number, required: true },
        platformFee: { type: Number, required: true },
        vendorAmount: { type: Number, required: true },
        advanceAmount: { type: Number, required: true },
        remainingAmount: { type: Number, required: true }
    },
    payout: {
        advancePaid: { type: Boolean, default: false },
        advancePaidAt: { type: Date },
        fullPaid: { type: Boolean, default: false },
        fullPaidAt: { type: Date },
        payoutStatus: {
            type: String,
            enum: ['none', 'advance_paid', 'full_paid'],
            default: 'none'
        }
    },
    razorpay: {
        orderId: { type: String, required: true },
        paymentId: { type: String },
        signature: { type: String }
    },
    status: {
        type: String,
        enum: ['pending', 'captured', 'failed', 'refunded'],
        default: 'pending'
    }
}, {
    timestamps: true
});
export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
//# sourceMappingURL=payment.model.js.map