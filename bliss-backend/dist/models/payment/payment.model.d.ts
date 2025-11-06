export interface IPayment {
    _id?: string;
    message: string;
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
        id: string;
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
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ICreatePaymentInput {
    message: string;
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
        id: string;
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
    razorpay: {
        orderId: string;
        paymentId?: string;
        signature?: string;
    };
    status?: 'pending' | 'captured' | 'failed' | 'refunded';
}
export interface IUpdatePaymentInput {
    amount?: {
        total?: number;
        platformFee?: number;
        vendorAmount?: number;
        advanceAmount?: number;
        remainingAmount?: number;
    };
    payout?: {
        advancePaid?: boolean;
        advancePaidAt?: Date;
        fullPaid?: boolean;
        fullPaidAt?: Date;
        payoutStatus?: 'none' | 'advance_paid' | 'full_paid';
    };
    razorpay?: {
        orderId?: string;
        paymentId?: string;
        signature?: string;
    };
    status?: 'pending' | 'captured' | 'failed' | 'refunded';
}
//# sourceMappingURL=payment.model.d.ts.map