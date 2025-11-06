export declare class PaymentService {
    /**
     * Create payment order
     */
    createPaymentOrder(messageId: string): Promise<{
        success: boolean;
        order: {
            id: string;
            amount: number;
            currency: string;
        };
        paymentId: any;
        amountBreakdown: import("../utils/amountCalculator.js").AmountBreakdown;
    }>;
    /**
     * Verify payment
     */
    verifyPayment(verificationData: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }): Promise<{
        success: boolean;
        message: string;
        paymentId: any;
        amount: any;
        advancePaid: any;
        platformFee: any;
        remainingAmount: any;
    }>;
}
//# sourceMappingURL=payment.service.d.ts.map