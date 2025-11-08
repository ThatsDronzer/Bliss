import { getMessageByIdFromDb, createPaymentRecordInDb, getPaymentByOrderIdFromDb, updatePaymentStatusToFailedInDb, capturePaymentInDb, } from '@repository/payment/payment.repository';
import { RazorpayGatewayService } from '@services/payment/razorpay-gateway.service';
import { BadRequestError, NotFoundError, DBConnectionError } from '@exceptions/core.exceptions';
import { sendSuccessResponse } from '@utils/Response.utils';
import { calculateAmounts } from '@utils/amountCalculator';
import { PAYMENT_ERROR } from '@exceptions/errors';
const razorpayGateway = new RazorpayGatewayService();
export async function createPayment(req, res, next) {
    const { messageId } = req.body;
    try {
        // Validate input
        if (!messageId) {
            throw new BadRequestError('Message ID is required');
        }
        // Get message details from database
        const message = await getMessageByIdFromDb(messageId);
        if (!message) {
            throw new NotFoundError('Message not found');
        }
        // Validate booking status
        if (message.bookingDetails.status !== 'accepted') {
            throw new BadRequestError('Booking must be accepted by vendor first');
        }
        // Calculate amounts with commission structure
        const amounts = calculateAmounts(message.bookingDetails.totalPrice);
        // Create Razorpay order via payment gateway
        const razorpayOrder = await razorpayGateway.createOrder({
            amount: amounts.totalInPaise,
            currency: 'INR',
            receipt: `receipt_${messageId}`,
            notes: {
                messageId: messageId.toString(),
                userId: message.user.id,
                vendorId: message.vendor.id,
            },
        });
        // Create payment record in database
        const { paymentId } = await createPaymentRecordInDb({
            messageId,
            user: message.user,
            vendor: message.vendor,
            listing: {
                id: message.listing.id,
                title: message.listing.title,
                price: message.bookingDetails.totalPrice,
            },
            amounts,
            razorpayOrderId: razorpayOrder.id,
        });
        const result = {
            success: true,
            order: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
            },
            paymentId,
            amountBreakdown: amounts,
        };
        return sendSuccessResponse(res, result);
    }
    catch (error) {
        if (error instanceof DBConnectionError) {
            return next(error);
        }
        if (error instanceof BadRequestError || error instanceof NotFoundError) {
            return next(error);
        }
        console.error('Error while createPayment()', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            data: { messageId },
        });
        next(new Error(PAYMENT_ERROR.message));
    }
}
export async function verifyPayment(req, res, next) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    try {
        // Validate input
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            throw new BadRequestError('Missing payment details');
        }
        // Find payment by razorpay order ID
        const payment = await getPaymentByOrderIdFromDb(razorpay_order_id);
        if (!payment) {
            throw new NotFoundError('Payment record not found');
        }
        const paymentId = payment._id?.toString();
        const messageId = payment.message?.toString();
        if (!paymentId || !messageId) {
            throw new Error('Invalid payment record');
        }
        // Verify payment signature via payment gateway
        const isSignatureValid = razorpayGateway.verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        if (!isSignatureValid) {
            // Update payment status to failed
            await updatePaymentStatusToFailedInDb(paymentId, messageId);
            throw new BadRequestError('Payment verification failed');
        }
        // Double-check payment status with Razorpay API
        const paymentDetails = await razorpayGateway.getPaymentDetails(razorpay_payment_id);
        if (paymentDetails.status !== 'captured') {
            throw new BadRequestError('Payment not captured yet');
        }
        // Capture payment if not already captured
        let result;
        if (payment.status !== 'captured') {
            const captureResult = await capturePaymentInDb(paymentId, messageId, razorpay_payment_id, razorpay_signature);
            result = {
                success: true,
                message: 'Payment verified successfully',
                ...captureResult,
            };
        }
        else {
            result = {
                success: true,
                message: 'Payment already verified',
                paymentId,
                amount: payment.amount.total,
                advancePaid: payment.amount.advanceAmount,
                platformFee: payment.amount.platformFee,
                remainingAmount: payment.amount.remainingAmount,
            };
        }
        return sendSuccessResponse(res, result);
    }
    catch (error) {
        if (error instanceof DBConnectionError) {
            return next(error);
        }
        if (error instanceof BadRequestError || error instanceof NotFoundError) {
            return next(error);
        }
        console.error('Error while verifyPayment()', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            data: { razorpay_order_id, razorpay_payment_id },
        });
        next(new Error(PAYMENT_ERROR.message));
    }
}
//# sourceMappingURL=payment.controller.js.map