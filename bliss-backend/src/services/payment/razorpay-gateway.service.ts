import { createRazorpayOrder, verifyPaymentSignature, getPaymentDetails } from '@utils/razorpay';

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

export class RazorpayGatewayService {
	async createOrder(params: RazorpayOrderParams): Promise<RazorpayOrderResult> {
		try {
			const order = await createRazorpayOrder(params);
			return {
				id: order.id,
				amount: order.amount,
				currency: order.currency,
			};
		} catch (error) {
			console.error('Error creating Razorpay order:', error);
			throw new Error('Failed to create payment order with payment gateway');
		}
	}

	verifySignature(
		orderId: string,
		paymentId: string,
		signature: string
	): boolean {
		return verifyPaymentSignature(orderId, paymentId, signature);
	}

	async getPaymentDetails(paymentId: string): Promise<any> {
		try {
			return await getPaymentDetails(paymentId);
		} catch (error) {
			console.error('Error fetching payment details:', error);
			throw new Error('Failed to fetch payment details from payment gateway');
		}
	}
}
