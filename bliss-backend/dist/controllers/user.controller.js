import { UserService } from '../services/user.service.js';
import { AppError } from '../middleware/error.middleware.js';
import MessageData from '../models/message.js';
import dbConnect from '../utils/dbConnect.js';
const userService = new UserService();
/**
 * GET /api/user/:id
 * Get user by Clerk ID
 */
export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new AppError('User ID is required', 400);
        }
        const user = await userService.getUserByClerkId(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        res.json(user);
    }
    catch (error) {
        next(error);
    }
};
/**
 * POST /api/user/create
 * Create or update user
 */
export const createUser = async (req, res, next) => {
    try {
        const { role = 'user' } = req.body;
        const userId = req.userId; // From auth middleware
        if (!userId) {
            throw new AppError('Unauthorized', 401);
        }
        const result = await userService.createOrUpdateUser(userId, req.body, role);
        res.status(result.isNew ? 201 : 200).json({
            success: true,
            message: result.isNew
                ? `${role === 'vendor' ? 'Vendor' : 'User'} created successfully`
                : `${role === 'vendor' ? 'Vendor' : 'User'} already exists`,
            user: result.user,
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * PUT /api/user/:id
 * Update user
 */
export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new AppError('User ID is required', 400);
        }
        // Ensure user can only update their own profile (optional security check)
        if (req.userId && req.userId !== id) {
            throw new AppError('Forbidden: Cannot update other user profile', 403);
        }
        const updatedUser = await userService.updateUser(id, req.body);
        if (!updatedUser) {
            throw new AppError('User not found', 404);
        }
        res.json(updatedUser);
    }
    catch (error) {
        next(error);
    }
};
/**
 * GET /api/user/booking-requests
 * Get user's booking requests
 */
export const getUserBookingRequests = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new AppError('Unauthorized', 401);
        }
        await dbConnect();
        // Get query parameters
        const status = req.query.status;
        const limit = parseInt(req.query.limit || '50');
        const page = parseInt(req.query.page || '1');
        // Build query
        const query = {
            'user.id': userId,
        };
        if (status) {
            query['bookingDetails.status'] = status;
        }
        // Get total count for pagination
        const total = await MessageData.countDocuments(query);
        // Get messages with pagination
        const messages = await MessageData.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();
        // Transform the messages
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
        res.json({
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
        next(error);
    }
};
//# sourceMappingURL=user.controller.js.map