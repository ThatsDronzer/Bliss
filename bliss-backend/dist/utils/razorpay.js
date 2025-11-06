import Razorpay from 'razorpay';
// Initialize Razorpay instance
export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
/**
 * Create a Razorpay order
 */
export const createRazorpayOrder = async (params) => {
    try {
        const options = {
            amount: params.amount,
            currency: params.currency || 'INR',
            receipt: params.receipt,
            notes: params.notes || {},
            partial_payment: params.partial_payment || false,
        };
        const order = await razorpay.orders.create(options);
        return {
            id: order.id,
            amount: Number(order.amount),
            currency: String(order.currency),
            receipt: String(order.receipt),
            status: String(order.status),
            created_at: Number(order.created_at),
        };
    }
    catch (error) {
        console.error('Error creating Razorpay order:', error);
        throw new Error(`Failed to create payment order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
/**
 * Verify payment signature
 */
export const verifyPaymentSignature = (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    try {
        const crypto = require('crypto');
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');
        return expectedSignature === razorpay_signature;
    }
    catch (error) {
        console.error('Error verifying payment signature:', error);
        return false;
    }
};
/**
 * Get payment details from Razorpay
 */
export const getPaymentDetails = async (paymentId) => {
    try {
        const payment = await razorpay.payments.fetch(paymentId);
        return payment;
    }
    catch (error) {
        console.error('Error fetching payment details:', error);
        throw new Error('Failed to fetch payment details');
    }
};
/**
 * Refund a payment
 */
export const createRefund = async (paymentId, amount) => {
    try {
        const refundParams = {};
        if (amount) {
            refundParams.amount = amount;
        }
        const refund = await razorpay.payments.refund(paymentId, refundParams);
        return refund;
    }
    catch (error) {
        console.error('Error creating refund:', error);
        throw new Error('Failed to process refund');
    }
};
/**
 * Convert rupees to paise
 */
export const convertToPaise = (amountInRupees) => {
    return Math.round(amountInRupees * 100);
};
/**
 * Convert paise to rupees
 */
export const convertToRupees = (amountInPaise) => {
    return amountInPaise / 100;
};
/**
 * Validate webhook signature
 */
export const verifyWebhookSignature = (body, signature) => {
    try {
        const crypto = require('crypto');
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(body)
            .digest('hex');
        return expectedSignature === signature;
    }
    catch (error) {
        console.error('Error verifying webhook signature:', error);
        return false;
    }
};
//# sourceMappingURL=razorpay.js.map