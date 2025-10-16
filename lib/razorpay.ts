import Razorpay from 'razorpay';

// Initialize Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Types
export interface RazorpayOrderParams {
  amount: number; // Amount in paise (not rupees)
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
export const createRazorpayOrder = async (params: RazorpayOrderParams): Promise<RazorpayOrderResponse> => {
  try {
    const options = {
      amount: params.amount, // Amount in paise
      currency: params.currency || 'INR',
      receipt: params.receipt,
      notes: params.notes || {},
      partial_payment: params.partial_payment || false,
    };

    const order = await razorpay.orders.create(options);
    
    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      created_at: order.created_at,
    };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error(`Failed to create payment order: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Verify payment signature
 */
export const verifyPaymentSignature = (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
): boolean => {
  try {
    const crypto = require('crypto');
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    return expectedSignature === razorpay_signature;
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return false;
  }
};

/**
 * Get payment details from Razorpay
 */
export const getPaymentDetails = async (paymentId: string) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw new Error('Failed to fetch payment details');
  }
};

/**
 * Refund a payment
 */
export const createRefund = async (paymentId: string, amount?: number) => {
  try {
    const refundParams: any = {};
    if (amount) {
      refundParams.amount = amount; // Amount in paise
    }

    const refund = await razorpay.payments.refund(paymentId, refundParams);
    return refund;
  } catch (error) {
    console.error('Error creating refund:', error);
    throw new Error('Failed to process refund');
  }
};

/**
 * Convert rupees to paise (Razorpay requires amount in paise)
 */
export const convertToPaise = (amountInRupees: number): number => {
  return Math.round(amountInRupees * 100);
};

/**
 * Convert paise to rupees
 */
export const convertToRupees = (amountInPaise: number): number => {
  return amountInPaise / 100;
};

/**
 * Validate webhook signature
 */
export const verifyWebhookSignature = (body: string, signature: string): boolean => {
  try {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
};