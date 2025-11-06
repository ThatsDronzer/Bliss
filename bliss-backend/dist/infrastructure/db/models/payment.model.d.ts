import mongoose, { Document, Types } from 'mongoose';
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
        total: number;
        platformFee: number;
        vendorAmount: number;
        advanceAmount: number;
        remainingAmount: number;
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
declare const _default: mongoose.Model<any, {}, {}, {}, any, any>;
export default _default;
//# sourceMappingURL=payment.model.d.ts.map