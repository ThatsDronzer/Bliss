import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAdminPayment extends Document {
  paymentId: Types.ObjectId; // Only store successful payment ID
  createdAt: Date;
}

const AdminPaymentSchema = new Schema<IAdminPayment>({
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

export default mongoose.models.AdminPayment || mongoose.model<IAdminPayment>('AdminPayment', AdminPaymentSchema);

