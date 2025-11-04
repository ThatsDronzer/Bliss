import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service.js';
import { AppError } from '../middleware/error.middleware.js';

const notificationService = new NotificationService();

/**
 * POST /api/notify/customer
 * Send customer notification
 */
export const notifyCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { requestId, customerPhone, vendorName, status, customerName } = req.body;

    if (!requestId || !customerPhone || !vendorName || !status) {
      throw new AppError(
        'Missing required fields: requestId, customerPhone, vendorName, status',
        400
      );
    }

    const result = await notificationService.notifyCustomer({
      requestId,
      customerPhone,
      vendorName,
      status,
      customerName,
    });

    res.json({ success: true, result });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Missing required fields')) {
        return next(new AppError(error.message, 400));
      }
      if (error.message.includes('Twilio not configured')) {
        return next(new AppError(error.message, 500));
      }
    }
    next(error);
  }
};

/**
 * POST /api/notify/vendor
 * Send vendor notification
 */
export const notifyVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customerName, requestId } = req.body;

    if (!customerName || !requestId) {
      throw new AppError('Missing required fields: customerName, requestId', 400);
    }

    const result = await notificationService.notifyVendor({
      customerName,
      requestId,
    });

    res.json({ success: true, sid: result.sid });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Missing required fields')) {
        return next(new AppError(error.message, 400));
      }
      if (error.message.includes('not configured')) {
        return next(new AppError(error.message, 500));
      }
    }
    next(error);
  }
};

