import Razorpay from 'razorpay';
export declare const razorpay: Razorpay;
export interface RazorpayOrderParams {
    amount: number;
    currency: string;
    receipt: string;
    notes?: Record<string, any>;
    partial_payment?: boolean;
}
export interface RazorpayOrderResponse {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
    created_at: number;
}
export interface PaymentVerificationParams {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}
/**
 * Create a Razorpay order
 */
export declare const createRazorpayOrder: (params: RazorpayOrderParams) => Promise<RazorpayOrderResponse>;
/**
 * Verify payment signature
 */
export declare const verifyPaymentSignature: (razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string) => boolean;
/**
 * Get payment details from Razorpay
 */
export declare const getPaymentDetails: (paymentId: string) => Promise<import("razorpay/dist/types/payments").Payments.RazorpayPayment>;
/**
 * Refund a payment
 */
export declare const createRefund: (paymentId: string, amount?: number) => Promise<import("razorpay/dist/types/refunds").Refunds.RazorpayRefund>;
/**
 * Convert rupees to paise
 */
export declare const convertToPaise: (amountInRupees: number) => number;
/**
 * Convert paise to rupees
 */
export declare const convertToRupees: (amountInPaise: number) => number;
/**
 * Validate webhook signature
 */
export declare const verifyWebhookSignature: (body: string, signature: string) => boolean;
//# sourceMappingURL=razorpay.d.ts.map