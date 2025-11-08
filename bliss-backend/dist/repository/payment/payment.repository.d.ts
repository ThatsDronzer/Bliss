import type { IPayment } from '@models/payment/payment.model';
export interface MessageDetails {
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
    vendor: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
    listing: {
        id: string;
        title: string;
    };
    bookingDetails: {
        status: string;
        totalPrice: number;
    };
}
export declare function getMessageByIdFromDb(messageId: string): Promise<MessageDetails | null>;
export declare function createPaymentRecordInDb(paymentData: {
    messageId: string;
    user: any;
    vendor: any;
    listing: any;
    amounts: any;
    razorpayOrderId: string;
}): Promise<{
    paymentId: string;
    payment: any;
}>;
export declare function getPaymentByOrderIdFromDb(orderId: string): Promise<IPayment | null>;
export declare function updatePaymentStatusToFailedInDb(paymentId: string, messageId: string): Promise<void>;
export declare function capturePaymentInDb(paymentId: string, messageId: string, razorpayPaymentId: string, razorpaySignature: string): Promise<{
    paymentId: string;
    amount: number;
    advancePaid: number;
    platformFee: number;
    remainingAmount: number;
}>;
export declare function getPaymentByIdFromDb(paymentId: string): Promise<IPayment | null>;
//# sourceMappingURL=payment.repository.d.ts.map