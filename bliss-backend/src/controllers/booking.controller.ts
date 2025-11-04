import { Request, Response, NextFunction } from 'express';
import { BookingService } from '../services/booking.service.js';
import { AppError } from '../middleware/error.middleware.js';

const bookingService = new BookingService();

/**
 * GET /api/booking-status
 * Get booking status by service ID
 */
export const getBookingStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const serviceId = req.query.serviceId as string;

    if (!serviceId) {
      throw new AppError('Service ID is required', 400);
    }

    const result = await bookingService.getBookingStatus(userId, serviceId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/booking-status/:requestId
 * Cancel booking
 */
export const cancelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { requestId } = req.params;
    const { status } = req.body;

    if (status !== 'cancelled') {
      throw new AppError(
        'Invalid status. Only cancellation allowed from user side.',
        400
      );
    }

    const booking = await bookingService.cancelBooking(userId, requestId);

    res.json({
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes('cannot be cancelled')) {
        return next(new AppError(error.message, 404));
      }
    }
    next(error);
  }
};

/**
 * POST /api/message-create
 * Create booking message
 */
export const createBookingMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const savedMessage = await bookingService.createBookingMessage(req.body);

    res.status(201).json({
      message: 'Message created successfully',
      data: savedMessage,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Missing required fields')) {
        return next(new AppError(error.message, 400));
      }
      if (error.message.includes('Missing required address fields')) {
        return next(new AppError(error.message, 400));
      }
      if (error.message.includes('Invalid booking time format')) {
        return next(new AppError(error.message, 400));
      }
      if (error.message.includes('Total price must be')) {
        return next(new AppError(error.message, 400));
      }
      if (error.message.includes('not found')) {
        return next(new AppError(error.message, 404));
      }
    }
    next(error);
  }
};

/**
 * GET /api/vendor/booking-requests
 * Get vendor booking requests
 */
export const getVendorBookingRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const status = req.query.status as string | undefined;
    const limit = parseInt(req.query.limit as string || '50');
    const page = parseInt(req.query.page as string || '1');

    const result = await bookingService.getVendorBookingRequests(userId, {
      status,
      limit,
      page,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/vendor/booking-requests/:requestId
 * Update vendor booking request status
 */
export const updateVendorBookingRequestStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { requestId } = req.params;
    const { status } = req.body;

    if (!status || !['accepted', 'not-accepted'].includes(status)) {
      throw new AppError('Invalid status', 400);
    }

    const transformedMessage = await bookingService.updateVendorBookingRequestStatus(
      userId,
      requestId,
      status as 'accepted' | 'not-accepted'
    );

    // Note: Notification would be handled separately via notification service
    // The original code calls /api/notify/customer which we'll handle in notification routes

    res.json(transformedMessage);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Invalid status') {
        return next(new AppError('Invalid status', 400));
      }
      if (error.message.includes('not found') || error.message.includes('cannot be updated')) {
        return next(new AppError(error.message, 404));
      }
    }
    next(error);
  }
};

