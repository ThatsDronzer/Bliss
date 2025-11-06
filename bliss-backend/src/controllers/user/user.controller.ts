import type { Request, Response, NextFunction } from 'express';
import { UserService } from '@services/user/user.service';
import { BadRequestError, NotFoundError, UnauthorizedError, ForbiddenError } from '@exceptions/core.exceptions';
import { sendSuccessResponse, sendErrorResponse } from '@utils/Response.utils';
import MessageData from '../../infrastructure/db/models/message.model.js';
import { dbConnect } from '@repository/repository';

const userService = new UserService();

export async function getUserById(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;

		if (!id) {
			throw new BadRequestError('User ID is required');
		}

		const user = await userService.getUserByClerkId(id);

		if (!user) {
			throw new NotFoundError('User not found');
		}

		return sendSuccessResponse(res, user);
	} catch (error) {
		next(error);
	}
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
	try {
		const { role = 'user' } = req.body;
		const userId = req.userId;

		if (!userId) {
			throw new UnauthorizedError('Unauthorized');
		}

		const result = await userService.createOrUpdateUser(userId, req.body, role);

		return sendSuccessResponse(
			res,
			{
				user: result.user,
				isNew: result.isNew,
			},
			result.isNew
				? `${role === 'vendor' ? 'Vendor' : 'User'} created successfully`
				: `${role === 'vendor' ? 'Vendor' : 'User'} already exists`,
			result.isNew ? 201 : 200
		);
	} catch (error) {
		next(error);
	}
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;

		if (!id) {
			throw new BadRequestError('User ID is required');
		}

		if (req.userId && req.userId !== id) {
			throw new ForbiddenError('Cannot update other user profile');
		}

		const updatedUser = await userService.updateUser(id, req.body);

		if (!updatedUser) {
			throw new NotFoundError('User not found');
		}

		return sendSuccessResponse(res, updatedUser);
	} catch (error) {
		next(error);
	}
}

export async function getUserBookingRequests(req: Request, res: Response, next: NextFunction) {
	try {
		const userId = req.userId;

		if (!userId) {
			throw new UnauthorizedError('Unauthorized');
		}

		await dbConnect();

		const status = req.query.status as string | undefined;
		const limit = parseInt(req.query.limit as string || '50');
		const page = parseInt(req.query.page as string || '1');

		const query: any = {
			'user.id': userId,
		};

		if (status) {
			query['bookingDetails.status'] = status;
		}

		const total = await MessageData.countDocuments(query);

		const messages = await MessageData.find(query)
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.lean();

		const transformedMessages = messages.map((message: any) => ({
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
				total,
				pages: Math.ceil(total / limit),
				currentPage: page,
				perPage: limit,
			},
		});
	} catch (error) {
		next(error);
	}
}

