import Payment from '../models/payment.js';
import MessageData from '../models/message.js';
import AdminPayment from '../models/AdminPayments.js';
import dbConnect from '../utils/dbConnect.js';
import { createRazorpayOrder, verifyPaymentSignature, getPaymentDetails } from '../utils/razorpay.js';
import { calculateAmounts } from '../utils/amountCalculator.js';
export class PaymentService {
    /**
     * Create payment order
     */
    async createPaymentOrder(messageId) {
        await dbConnect();
        if (!messageId) {
            throw new Error('Message ID is required');
        }
        const message = await MessageData.findById(messageId);
        if (!message) {
            throw new Error('Message not found');
        }
        if (message.bookingDetails.status !== 'accepted') {
            throw new Error('Booking must be accepted by vendor first');
        }
        // Calculate amounts with commission structure
        const amounts = calculateAmounts(message.bookingDetails.totalPrice);
        // Create Razorpay order
        const razorpayOrder = await createRazorpayOrder({
            amount: amounts.totalInPaise,
            currency: 'INR',
            receipt: `receipt_${messageId}`,
            notes: {
                messageId: messageId.toString(),
                userId: message.user.id,
                vendorId: message.vendor.id,
            },
        });
        // Create payment record
        const payment = new Payment({
            message: messageId,
            user: {
                id: message.user.id,
                name: message.user.name,
                email: message.user.email,
                phone: message.user.phone,
            },
            vendor: {
                id: message.vendor.id,
                name: message.vendor.name,
                email: message.vendor.email,
                phone: message.vendor.phone,
            },
            listing: {
                id: message.listing.id,
                title: message.listing.title,
                price: message.bookingDetails.totalPrice,
            },
            amount: amounts,
            razorpay: {
                orderId: razorpayOrder.id,
            },
        });
        await payment.save();
        return {
            success: true,
            order: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
            },
            paymentId: payment._id.toString(),
            amountBreakdown: amounts,
        };
    }
    /**
     * Verify payment
     */
    async verifyPayment(verificationData) {
        await dbConnect();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = verificationData;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            throw new Error('Missing payment details');
        }
        // Find payment by razorpay order ID
        const payment = await Payment.findOne({ 'razorpay.orderId': razorpay_order_id });
        if (!payment) {
            throw new Error('Payment record not found');
        }
        // Verify payment signature
        const isSignatureValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        if (!isSignatureValid) {
            // Update payment status to failed
            await Payment.findByIdAndUpdate(payment._id, {
                status: 'failed',
            });
            await MessageData.findByIdAndUpdate(payment.message, {
                'paymentStatus.status': 'failed',
            });
            throw new Error('Payment verification failed');
        }
        // Double-check payment status with Razorpay API
        const paymentDetails = await getPaymentDetails(razorpay_payment_id);
        if (paymentDetails.status !== 'captured') {
            throw new Error('Payment not captured yet');
        }
        // If webhook hasn't processed this yet, update manually
        if (payment.status !== 'captured') {
            payment.status = 'captured';
            payment.razorpay.paymentId = razorpay_payment_id;
            payment.razorpay.signature = razorpay_signature;
            payment.payout.advancePaid = false;
            payment.payout.advancePaidAt = undefined;
            payment.payout.payoutStatus = 'none';
            await payment.save();
            await MessageData.findByIdAndUpdate(payment.message, {
                'paymentStatus.status': 'paid',
                'paymentStatus.paymentId': payment._id,
                'paymentStatus.paidAt': new Date(),
            });
            // Add to admin payments
            try {
                const adminPayment = new AdminPayment({
                    paymentId: payment._id,
                });
                await adminPayment.save();
                console.log('✅ Payment added to admin records:', payment._id);
            }
            catch (error) {
                console.error('❌ Error adding to admin payments:', error);
            }
        }
        return {
            success: true,
            message: 'Payment verified successfully',
            paymentId: payment._id.toString(),
            amount: payment.amount.total,
            advancePaid: payment.amount.advanceAmount,
            platformFee: payment.amount.platformFee,
            remainingAmount: payment.amount.remainingAmount,
        };
    }
}
//# sourceMappingURL=payment.service.js.map