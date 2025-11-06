import mongoose, { Schema } from 'mongoose';
const AdminPaymentSchema = new Schema({
    paymentId: {
        type: Schema.Types.ObjectId,
        ref: 'Payment',
        required: true,
        unique: true // Ensure no duplicate payment IDs
    }
}, {
    timestamps: true // This will automatically add createdAt and updatedAt
});
// Index for better query performance
AdminPaymentSchema.index({ paymentId: 1 });
AdminPaymentSchema.index({ createdAt: -1 });
export default mongoose.models.AdminPayment || mongoose.model('AdminPayment', AdminPaymentSchema);
//# sourceMappingURL=AdminPayments.js.map