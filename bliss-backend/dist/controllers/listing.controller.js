import { ListingService } from '../services/listing.service.js';
import { AppError } from '../middleware/error.middleware.js';
import { users } from '@clerk/clerk-sdk-node';
import multer from 'multer';
const listingService = new ListingService();
// Configure multer for memory storage (for Express file uploads)
const upload = multer({ storage: multer.memoryStorage() });
/**
 * GET /api/listing
 * Get all listings for authenticated vendor
 */
export const getVendorListings = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new AppError('Unauthorized', 401);
        }
        const result = await listingService.getVendorListings(userId);
        res.json(result);
    }
    catch (error) {
        if (error instanceof Error && error.message === 'Vendor not found') {
            return next(new AppError('Vendor not found', 404));
        }
        next(error);
    }
};
/**
 * POST /api/listing
 * Create new listing
 */
export const createListing = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new AppError('Unauthorized', 401);
        }
        const user = await users.getUser(userId);
        const role = user.unsafeMetadata?.role;
        if (role !== 'vendor') {
            throw new AppError('User is not a vendor', 403);
        }
        const listing = await listingService.createListing(userId, req.body);
        res.status(201).json({
            message: 'Listing created successfully',
            listing,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Missing required fields') {
                return next(new AppError('Missing required fields', 400));
            }
            if (error.message === 'At least one image is required') {
                return next(new AppError('At least one image is required', 400));
            }
            if (error.message === 'Vendor not found') {
                return next(new AppError('Vendor not found', 404));
            }
        }
        next(error);
    }
};
/**
 * PUT /api/listing
 * Update listing
 */
export const updateListing = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new AppError('Unauthorized', 401);
        }
        const listing = await listingService.updateListing(userId, req.body);
        res.json({
            message: 'Listing updated successfully',
            listing,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Listing ID is required') {
                return next(new AppError('Listing ID is required', 400));
            }
            if (error.message === 'Listing not found') {
                return next(new AppError('Listing not found', 404));
            }
            if (error.message.includes('Unauthorized')) {
                return next(new AppError(error.message, 403));
            }
        }
        next(error);
    }
};
/**
 * DELETE /api/listing
 * Delete listing
 */
export const deleteListing = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new AppError('Unauthorized', 401);
        }
        const { listingId } = req.body;
        if (!listingId) {
            throw new AppError('Listing ID is required', 400);
        }
        const deletedListingId = await listingService.deleteListing(userId, listingId);
        res.json({
            message: 'Listing deleted successfully',
            deletedListingId,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Listing not found') {
                return next(new AppError('Listing not found', 404));
            }
            if (error.message === 'Vendor not found') {
                return next(new AppError('Vendor not found', 404));
            }
            if (error.message.includes('Unauthorized')) {
                return next(new AppError(error.message, 403));
            }
        }
        next(error);
    }
};
/**
 * GET /api/listing/:id
 * Get listing by ID (vendor must own it)
 */
export const getListingById = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new AppError('Unauthorized', 401);
        }
        const { id } = req.params;
        const result = await listingService.getListingById(id, userId);
        res.json(result);
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Vendor not found') {
                return next(new AppError('Vendor not found', 404));
            }
            if (error.message === 'Listing not found') {
                return next(new AppError('Listing not found', 404));
            }
        }
        next(error);
    }
};
/**
 * PATCH /api/listing/:id/status
 * Toggle listing active status
 */
export const toggleListingStatus = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new AppError('Unauthorized', 401);
        }
        const user = await users.getUser(userId);
        const role = user.unsafeMetadata?.role;
        if (role !== 'vendor') {
            throw new AppError('User is not a vendor', 403);
        }
        const { id } = req.params;
        const listing = await listingService.toggleListingStatus(userId, id);
        res.json({
            message: `Listing status updated to ${listing.isActive ? 'active' : 'inactive'}`,
            listing,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Listing ID is required') {
                return next(new AppError('Listing ID is required', 400));
            }
            if (error.message === 'Vendor not found') {
                return next(new AppError('Vendor not found', 404));
            }
            if (error.message === 'Listing not found') {
                return next(new AppError('Listing not found', 404));
            }
            if (error.message.includes('Unauthorized')) {
                return next(new AppError(error.message, 403));
            }
        }
        next(error);
    }
};
/**
 * PATCH /api/listing/add-images
 * Add images to listing (form data with file uploads)
 */
export const addImages = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new AppError('Unauthorized', 401);
        }
        const user = await users.getUser(userId);
        const role = user.unsafeMetadata?.role;
        if (role !== 'vendor') {
            throw new AppError('User is not a vendor', 403);
        }
        // Note: For file uploads in Express, you'll need to use multer middleware
        // This is a simplified version - you may need to adjust based on your file upload setup
        const listingId = req.body.listingId || req.query.listingId;
        if (!listingId) {
            throw new AppError('Listing ID is required', 400);
        }
        // If images are already uploaded to Cloudinary and provided in body
        if (req.body.images && Array.isArray(req.body.images)) {
            const newImages = await listingService.addImages(userId, listingId, req.body.images);
            return res.json({
                message: 'Images added successfully',
                newImages,
            });
        }
        throw new AppError('Images are required', 400);
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Vendor not found') {
                return next(new AppError('Vendor not found', 404));
            }
            if (error.message.includes('not found') || error.message.includes('unauthorized')) {
                return next(new AppError(error.message, 404));
            }
        }
        next(error);
    }
};
/**
 * GET /api/listing/reviews
 * Get listing reviews
 */
export const getListingReviews = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new AppError('Unauthorized', 401);
        }
        const listingId = req.query.listingId;
        if (!listingId) {
            throw new AppError('Listing ID is required', 400);
        }
        const reviews = await listingService.getListingReviews(listingId);
        res.json({
            message: 'Reviews fetched successfully',
            reviews,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Listing not found') {
                return next(new AppError('Listing not found', 404));
            }
        }
        next(error);
    }
};
//# sourceMappingURL=listing.controller.js.map