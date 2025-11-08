import { createRazorpayOrder, verifyPaymentSignature, getPaymentDetails } from '@utils/razorpay';
export class RazorpayGatewayService {
    async createOrder(params) {
        try {
            const order = await createRazorpayOrder(params);
            return {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
            };
        }
        catch (error) {
            console.error('Error creating Razorpay order:', error);
            throw new Error('Failed to create payment order with payment gateway');
        }
    }
    verifySignature(orderId, paymentId, signature) {
        return verifyPaymentSignature(orderId, paymentId, signature);
    }
    async getPaymentDetails(paymentId) {
        try {
            return await getPaymentDetails(paymentId);
        }
        catch (error) {
            console.error('Error fetching payment details:', error);
            throw new Error('Failed to fetch payment details from payment gateway');
        }
    }
}
//# sourceMappingURL=razorpay-gateway.service.js.map