import type { IPayment } from '@models/payment/payment.model';
export interface IPaymentService {
    createPaymentOrder(messageId: string): Promise<any>;
    verifyPayment(verificationData: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }): Promise<any>;
    getPaymentById(paymentId: string): Promise<IPayment | null>;
}
//# sourceMappingURL=payment.service.interface.d.ts.map