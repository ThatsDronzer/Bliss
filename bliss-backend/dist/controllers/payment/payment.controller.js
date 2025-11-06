import { PaymentService } from '@services/payment/payment.service';
import { BadRequestError, NotFoundError } from '@exceptions/core.exceptions';
import { sendSuccessResponse } from '@utils/Response.utils';
const paymentService = new PaymentService();
export async function createPayment(req, res, next) {
    try {
        const { messageId } = req.body;
        if (!messageId) {
            throw new BadRequestError('Message ID is required');
        }
        const result = await paymentService.createPaymentOrder(messageId);
        return sendSuccessResponse(res, result);
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Message ID is required') {
                return next(new BadRequestError(error.message));
            }
            if (error.message === 'Message not found') {
                return next(new NotFoundError(error.message));
            }
            if (error.message.includes('must be accepted')) {
                return next(new BadRequestError(error.message));
            }
        }
        next(error);
    }
}
export async function verifyPayment(req, res, next) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const result = await paymentService.verifyPayment({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });
        return sendSuccessResponse(res, result);
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Missing payment details') {
                return next(new BadRequestError(error.message));
            }
            if (error.message === 'Payment record not found') {
                return next(new NotFoundError(error.message));
            }
            if (error.message === 'Payment verification failed') {
                return next(new BadRequestError(error.message));
            }
            if (error.message === 'Payment not captured yet') {
                return next(new BadRequestError(error.message));
            }
        }
        next(error);
    }
}
//# sourceMappingURL=payment.controller.js.map