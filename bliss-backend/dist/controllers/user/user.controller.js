import { getUserByClerkIdFromDb, createOrUpdateUserInDb, updateUserInDb, } from '@repository/user/user.repository';
import { BadRequestError, NotFoundError, UnauthorizedError, ForbiddenError, DBConnectionError } from '@exceptions/core.exceptions';
import { sendSuccessResponse } from '@utils/Response.utils';
import { FETCH_USER_ERROR, CREATE_USER_ERROR, UPDATE_USER_ERROR } from '@exceptions/errors';
import MessageData from '../../infrastructure/db/models/message.model.js';
import { dbConnect } from '@repository/repository';
export async function getUserById(req, res, next) {
    try {
        const { id } = req.params;
        if (!id) {
            throw new BadRequestError('User ID is required');
        }
        const user = await getUserByClerkIdFromDb(id);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return sendSuccessResponse(res, user);
    }
    catch (error) {
        if (error instanceof DBConnectionError) {
            return next(error);
        }
        if (error instanceof BadRequestError || error instanceof NotFoundError) {
            return next(error);
        }
        console.error('Error while getUserById()', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            data: { id: req.params.id },
        });
        next(new Error(FETCH_USER_ERROR.message));
    }
}
export async function createUser(req, res, next) {
    try {
        const { role = 'user' } = req.body;
        const userId = req.userId;
        if (!userId) {
            throw new UnauthorizedError('Unauthorized');
        }
        const result = await createOrUpdateUserInDb(userId, req.body, role);
        return sendSuccessResponse(res, {
            user: result.user,
            isNew: result.isNew,
        }, result.isNew
            ? `${role === 'vendor' ? 'Vendor' : 'User'} created successfully`
            : `${role === 'vendor' ? 'Vendor' : 'User'} already exists`, result.isNew ? 201 : 200);
    }
    catch (error) {
        if (error instanceof DBConnectionError) {
            return next(error);
        }
        if (error instanceof UnauthorizedError) {
            return next(error);
        }
        console.error('Error while createUser()', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            data: { role: req.body.role, userId: req.userId },
        });
        next(new Error(CREATE_USER_ERROR.message));
    }
}
export async function updateUser(req, res, next) {
    try {
        const { id } = req.params;
        if (!id) {
            throw new BadRequestError('User ID is required');
        }
        if (req.userId && req.userId !== id) {
            throw new ForbiddenError('Cannot update other user profile');
        }
        const updatedUser = await updateUserInDb(id, req.body);
        if (!updatedUser) {
            throw new NotFoundError('User not found');
        }
        return sendSuccessResponse(res, updatedUser);
    }
    catch (error) {
        if (error instanceof DBConnectionError) {
            return next(error);
        }
        if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
            return next(error);
        }
        console.error('Error while updateUser()', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            data: { id: req.params.id, body: req.body },
        });
        next(new Error(UPDATE_USER_ERROR.message));
    }
}
export async function getUserBookingRequests(req, res, next) {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new UnauthorizedError('Unauthorized');
        }
        await dbConnect();
        const status = req.query.status;
        const limit = parseInt(req.query.limit || '50');
        const page = parseInt(req.query.page || '1');
        const query = {
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
        const transformedMessages = messages.map((message) => ({
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
                selectedItems: message.bookingDetails.selectedItems.map((item) => ({
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
    }
    catch (error) {
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
        next(new Error(FETCH_USER_ERROR.message));
    }
}
//# sourceMappingURL=user.controller.js.map