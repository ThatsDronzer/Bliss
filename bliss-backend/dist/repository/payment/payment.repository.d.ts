import type { IPayment } from '@models/payment/payment.model';
export declare function createPaymentOrderInDb(messageId: string): Promise<any>;
export declare function verifyPaymentInDb(verificationData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}): Promise<any>;
export declare function getPaymentByIdFromDb(paymentId: string): Promise<IPayment | null>;
//# sourceMappingURL=payment.repository.d.ts.map