import type { Request, Response, NextFunction } from 'express';
import {
	createBookingMessageInDb,
	getVendorBookingRequestsFromDb,
	updateVendorBookingRequestStatusFromDb,
	getUserBookingRequestsFromDb,
} from '@repository/message/message.repository';
import { BadRequestError, UnauthorizedError, NotFoundError, DBConnectionError } from '@exceptions/core.exceptions';
import { sendSuccessResponse } from '@utils/Response.utils';
import { MESSAGE_ERROR } from '@exceptions/errors';

export async function createBookingMessage(req: Request, res: Response, next: NextFunction) {
	try {
		const savedMessage = await createBookingMessageInDb(req.body);

		return sendSuccessResponse(res, {
			data: savedMessage,
		}, 'Message created successfully', 201);
	} catch (error) {
		if (error instanceof DBConnectionError) {
			return next(error);
		}

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

		console.error('Error while createBookingMessage()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: { ...req.body },
		});

		next(new Error(MESSAGE_ERROR.message));
	}
}

export async function getVendorBookingRequests(req: Request, res: Response, next: NextFunction) {
	try {
		const userId = req.userId;

		if (!userId) {
			throw new UnauthorizedError('Unauthorized');
		}

		const status = req.query.status as string | undefined;
		const limit = parseInt(req.query.limit as string || '50');
		const page = parseInt(req.query.page as string || '1');

		const result = await getVendorBookingRequestsFromDb(userId, {
			status,
			limit,
			page,
		});

		// Transform the messages
		const transformedMessages = result.messages.map((message: any) => ({
			id: message._id.toString(),
			user: {
				id: message.user.id,
				name: message.user.name,
				email: message.user.email,
				phone: message.user.phone,
			},
			listing: {
				id: message.listing.id.toString(),
				title: message.listing.title,
				description: message.listing.description,
				basePrice: message.listing.basePrice,
				location: message.listing.location,
			},
			bookingDetails: {
				selectedItems: message.bookingDetails.selectedItems.map((item: any) => ({
					name: item.name,
					description: item.description,
					price: item.price,
					image: item.image,
				})),
				totalPrice: message.bookingDetails.totalPrice,
				bookingDate: message.bookingDetails.bookingDate.toISOString(),
				bookingTime: message.bookingDetails.bookingTime,
				address:
					message.bookingDetails.status === 'accepted'
						? message.bookingDetails.address
						: null,
				status: message.bookingDetails.status,
				specialInstructions: message.bookingDetails.specialInstructions,
			},
			createdAt: message.createdAt.toISOString(),
		}));

		return sendSuccessResponse(res, {
			messages: transformedMessages,
			pagination: {
				total: result.total,
				pages: Math.ceil(result.total / result.limit),
				currentPage: result.page,
				perPage: result.limit,
			},
		});
	} catch (error) {
		if (error instanceof DBConnectionError) {
			return next(error);
		}

		if (error instanceof UnauthorizedError) {
			return next(error);
		}

		console.error('Error while getVendorBookingRequests()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: { userId: req.userId, status: req.query.status },
		});

		next(new Error(MESSAGE_ERROR.message));
	}
}

export async function updateVendorBookingRequestStatus(req: Request, res: Response, next: NextFunction) {
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

		const updatedMessage = await updateVendorBookingRequestStatusFromDb(
			userId,
			requestId,
			status as 'accepted' | 'not-accepted'
		);

		// Transform the message
		const msg = updatedMessage as any;
		const transformedMessage = {
			id: msg._id.toString(),
			user: {
				id: msg.user.id,
				name: msg.user.name,
				email: msg.user.email,
				phone: msg.user.phone,
			},
			listing: {
				id: msg.listing.id.toString(),
				title: msg.listing.title,
				description: msg.listing.description,
				basePrice: msg.listing.basePrice,
				location: msg.listing.location,
			},
			bookingDetails: {
				selectedItems: msg.bookingDetails.selectedItems.map((item: any) => ({
					name: item.name,
					description: item.description,
					price: item.price,
					image: item.image,
				})),
				totalPrice: msg.bookingDetails.totalPrice,
				bookingDate: msg.bookingDetails.bookingDate.toISOString(),
				bookingTime: msg.bookingDetails.bookingTime,
				address: status === 'accepted' ? msg.bookingDetails.address : null,
				status: msg.bookingDetails.status,
				specialInstructions: msg.bookingDetails.specialInstructions,
			},
			createdAt: msg.createdAt.toISOString(),
		};

		return sendSuccessResponse(res, {
			message: transformedMessage,
		}, 'Booking request status updated successfully');
	} catch (error) {
		if (error instanceof DBConnectionError) {
			return next(error);
		}

		if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
			return next(error);
		}

		if (error instanceof Error) {
			if (error.message.includes('not found') || error.message.includes('cannot be updated')) {
				return next(new NotFoundError(error.message));
			}
		}

		console.error('Error while updateVendorBookingRequestStatus()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: { userId: req.userId, requestId: req.params.requestId, status: req.body.status },
		});

		next(new Error(MESSAGE_ERROR.message));
	}
}

export async function getUserBookingRequests(req: Request, res: Response, next: NextFunction) {
	try {
		const userId = req.userId;

		if (!userId) {
			throw new UnauthorizedError('Unauthorized');
		}

		const status = req.query.status as string | undefined;
		const limit = parseInt(req.query.limit as string || '50');
		const page = parseInt(req.query.page as string || '1');

		const result = await getUserBookingRequestsFromDb(userId, {
			status,
			limit,
			page,
		});

		// Transform the messages
		const transformedMessages = result.messages.map((message: any) => ({
			id: message._id.toString(),
			vendor: {
				id: message.vendor.id,
				name: message.vendor.name,
				email: message.vendor.email,
				phone: message.vendor.phone,
				service: message.vendor.service,
				service_address: message.vendor.service_address,
			},
			listing: {
				id: message.listing.id.toString(),
				title: message.listing.title,
				description: message.listing.description,
				basePrice: message.listing.basePrice,
				location: message.listing.location,
			},
			bookingDetails: {
				selectedItems: message.bookingDetails.selectedItems.map((item: any) => ({
					name: item.name,
					description: item.description,
					price: item.price,
					image: item.image,
				})),
				totalPrice: message.bookingDetails.totalPrice,
				bookingDate: message.bookingDetails.bookingDate.toISOString(),
				bookingTime: message.bookingDetails.bookingTime,
				address: message.bookingDetails.address,
				status: message.bookingDetails.status,
				specialInstructions: message.bookingDetails.specialInstructions,
			},
			createdAt: message.createdAt.toISOString(),
		}));

		return sendSuccessResponse(res, {
			messages: transformedMessages,
			pagination: {
				total: result.total,
				pages: Math.ceil(result.total / result.limit),
				currentPage: result.page,
				perPage: result.limit,
			},
		});
	} catch (error) {
		if (error instanceof DBConnectionError) {
			return next(error);
		}

		if (error instanceof UnauthorizedError) {
			return next(error);
		}

		console.error('Error while getUserBookingRequests()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: { userId: req.userId, status: req.query.status },
		});

		next(new Error(MESSAGE_ERROR.message));
	}
}
