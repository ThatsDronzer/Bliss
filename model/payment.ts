import mongoose, { Schema, Document, Types } from 'mongoose';
 
export interface IPayment extends Document {
  message: Types.ObjectId;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  vendor: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  listing: {
    id: Types.ObjectId;
    title: string;
    price: number;
  };
  amount: {
    total: number;           // Total paid by user
    platformFee: number;     // 5% commission
    vendorAmount: number;    // 95% of total (vendor's share)
    advanceAmount: number;   // 15% of vendorAmount (advance)
    remainingAmount: number; // 85% of vendorAmount (after service)
  };
  payout: {
    advancePaid: boolean;
    advancePaidAt?: Date;
    fullPaid: boolean;
    fullPaidAt?: Date;
    payoutStatus: 'none' | 'advance_paid' | 'full_paid';
  };
  razorpay: {
    orderId: string;
    paymentId?: string;
    signature?: string;
  };
  status: 'pending' | 'captured' | 'failed' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}
 
const PaymentSchema = new Schema<IPayment>({
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
 
export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
