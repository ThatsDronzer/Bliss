import { BadRequestError, NotFoundError, UnauthorizedError } from '@exceptions/core.exceptions';
import { BookingService } from '@services/booking/booking.service';
import { MessageService } from '@services/message/message.service';
import { sendSuccessResponse } from '@utils/Response.utils';
const bookingService = new BookingService();
const messageService = new MessageService();
export async function getBookingStatus(req, res, next) {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new UnauthorizedError('Unauthorized');
        }
        const serviceId = req.query.serviceId;
        if (!serviceId) {
            throw new BadRequestError('Service ID is required');
        }
        const result = await bookingService.getBookingStatus(userId, serviceId);
        return sendSuccessResponse(res, result);
    }
    catch (error) {
        next(error);
    }
}
export async function cancelBooking(req, res, next) {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new UnauthorizedError('Unauthorized');
        }
        const { requestId } = req.params;
        const { status } = req.body;
        if (status !== 'cancelled') {
            throw new BadRequestError('Invalid status. Only cancellation allowed from user side.');
        }
        const booking = await bookingService.cancelBooking(userId, requestId);
        return sendSuccessResponse(res, {
            booking,
        }, 'Booking cancelled successfully');
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('not found') || error.message.includes('cannot be cancelled')) {
                return next(new NotFoundError(error.message));
            }
        }
        next(error);
    }
}
export async function createBookingMessage(req, res, next) {
    try {
        const savedMessage = await messageService.createBookingMessage(req.body);
        return sendSuccessResponse(res, {
            data: savedMessage,
        }, 'Message created successfully', 201);
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('Missing required fields')) {
                return next(new BadRequestError(error.message));
            }
            if (error.message.includes('Missing required address fields')) {
                return next(new BadRequestError(error.message));
            }
            if (error.message.includes('Invalid booking time format')) {
                return next(new BadRequestError(error.message));
            }
            if (error.message.includes('Total price must be')) {
                return next(new BadRequestError(error.message));
            }
            if (error.message.includes('not found')) {
                return next(new NotFoundError(error.message));
            }
        }
        next(error);
    }
}
export async function getVendorBookingRequests(req, res, next) {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new UnauthorizedError('Unauthorized');
        }
        const status = req.query.status;
        const limit = parseInt(req.query.limit || '50');
        const page = parseInt(req.query.page || '1');
        const result = await messageService.getVendorBookingRequests(userId, {
            status,
            limit,
            page,
        });
        return sendSuccessResponse(res, result);
    }
    catch (error) {
        next(error);
    }
}
export async function updateVendorBookingRequestStatus(req, res, next) {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new UnauthorizedError('Unauthorized');
        }
        const { requestId } = req.params;
        const { status } = req.body;
        if (!status || !['accepted', 'not-accepted'].includes(status)) {
            throw new BadRequestError('Invalid status');
        }
        const transformedMessage = await messageService.updateVendorBookingRequestStatus(userId, requestId, status);
        return sendSuccessResponse(res, {
            message: transformedMessage,
        }, 'Booking request status updated successfully');
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('not found') || error.message.includes('cannot be updated')) {
                return next(new NotFoundError(error.message));
            }
        }
        next(error);
    }
}
//# sourceMappingURL=booking.controller.js.map