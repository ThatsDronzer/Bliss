export interface RazorpayOrderParams {
    amount: number;
    currency: string;
    receipt: string;
    notes?: Record<string, any>;
}
export interface RazorpayOrderResult {
    id: string;
    amount: number;
    currency: string;
}
export declare class RazorpayGatewayService {
    createOrder(params: RazorpayOrderParams): Promise<RazorpayOrderResult>;
    verifySignature(orderId: string, paymentId: string, signature: string): boolean;
    getPaymentDetails(paymentId: string): Promise<any>;
}
//# sourceMappingURL=razorpay-gateway.service.d.ts.map