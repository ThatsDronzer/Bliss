import { BadRequestError, NotFoundError, UnauthorizedError, DBConnectionError } from '@exceptions/core.exceptions';
import { sendSuccessResponse } from '@utils/Response.utils';
import type { NextFunction, Request, Response } from 'express';
import {
	getBookingStatusFromDb,
	cancelBookingFromDb,
} from '@repository/message/message.repository';
import { FETCH_BOOKING_ERROR, UPDATE_BOOKING_ERROR } from '@exceptions/errors';

export async function getBookingStatus(req: Request, res: Response, next: NextFunction) {
	try {
		const userId = req.userId;

		if (!userId) {
			throw new UnauthorizedError('Unauthorized');
		}

		const serviceId = req.query.serviceId as string;

		if (!serviceId) {
			throw new BadRequestError('Service ID is required');
		}

		const result = await getBookingStatusFromDb(userId, serviceId);
		return sendSuccessResponse(res, result);
	} catch (error) {
		if (error instanceof DBConnectionError) {
			return next(error);
		}

		if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
			return next(error);
		}

		console.error('Error while getBookingStatus()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: { userId: req.userId, serviceId: req.query.serviceId },
		});

		next(new Error(FETCH_BOOKING_ERROR.message));
	}
}

export async function cancelBooking(req: Request, res: Response, next: NextFunction) {
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

		const booking = await cancelBookingFromDb(userId, requestId);

		return sendSuccessResponse(res, {
			booking,
		}, 'Booking cancelled successfully');
	} catch (error) {
		if (error instanceof DBConnectionError) {
			return next(error);
		}

		if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
			return next(error);
		}

		if (error instanceof Error) {
			if (error.message.includes('not found') || error.message.includes('cannot be cancelled')) {
				return next(new NotFoundError(error.message));
			}
		}

		console.error('Error while cancelBooking()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: { userId: req.userId, requestId: req.params.requestId, status: req.body.status },
		});

		next(new Error(UPDATE_BOOKING_ERROR.message));
	}
}


