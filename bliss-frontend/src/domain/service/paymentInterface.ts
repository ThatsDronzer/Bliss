import type { PaymentOrder } from '@domain/interfaces/payment';

export interface IPaymentService {
  createPayment(messageId: string): Promise<{ order: PaymentOrder; paymentId: string; amountBreakdown: any }>;
  verifyPayment(data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }): Promise<any>;
}


