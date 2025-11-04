import { NextFunction, Request, Response } from 'express';
import { AppError } from '../middleware/error.middleware.js';
import { AdminService } from '../services/admin.service.js';

const adminService = new AdminService();

/**
 * GET /api/admin/payments
 * Get all admin payments
 */
export const getAdminPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await adminService.getAdminPayments();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/payments/advance
 * Process advance payment
 */
export const processAdvancePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      throw new AppError('Payment ID is required', 400);
    }

    const result = await adminService.processAdvancePayment(paymentId);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Payment ID is required') {
        return next(new AppError(error.message, 400));
      }
      if (error.message === 'Payment not found') {
        return next(new AppError(error.message, 404));
      }
      if (error.message === 'Message not found') {
        return next(new AppError(error.message, 404));
      }
      if (error.message.includes('already processed')) {
        return next(new AppError(error.message, 400));
      }
    }
    next(error);
  }
};

