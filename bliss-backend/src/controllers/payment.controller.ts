import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service.js';
import { AppError } from '../middleware/error.middleware.js';

const paymentService = new PaymentService();

/**
 * POST /api/payments/create
 * Create payment order
 */
export const createPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { messageId } = req.body;

    if (!messageId) {
      throw new AppError('Message ID is required', 400);
    }

    const result = await paymentService.createPaymentOrder(messageId);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Message ID is required') {
        return next(new AppError(error.message, 400));
      }
      if (error.message === 'Message not found') {
        return next(new AppError(error.message, 404));
      }
      if (error.message.includes('must be accepted')) {
        return next(new AppError(error.message, 400));
      }
    }
    next(error);
  }
};

/**
 * POST /api/payments/verify
 * Verify payment
 */
export const verifyPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const result = await paymentService.verifyPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Missing payment details') {
        return next(new AppError(error.message, 400));
      }
      if (error.message === 'Payment record not found') {
        return next(new AppError(error.message, 404));
      }
      if (error.message === 'Payment verification failed') {
        return next(new AppError(error.message, 400));
      }
      if (error.message === 'Payment not captured yet') {
        return next(new AppError(error.message, 400));
      }
    }
    next(error);
  }
};

