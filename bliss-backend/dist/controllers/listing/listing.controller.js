import { users } from '@clerk/clerk-sdk-node';
import { BadRequestError, DBConnectionError, ForbiddenError, NotFoundError, UnauthorizedError } from '@exceptions/core.exceptions';
import { FETCH_LISTING_ERROR } from '@exceptions/errors';
import { addImagesToListingInDb, createListingInDb, deleteListingFromDb, getListingByIdFromDb, getVendorListingsFromDb, toggleListingStatusInDb, updateListingInDb, } from '@repository/listing/listing.repository';
import { sendSuccessResponse } from '@utils/Response.utils';
export async function getVendorListings(req, res, next) {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new UnauthorizedError('Unauthorized');
        }
        const result = await getVendorListingsFromDb(userId);
        return sendSuccessResponse(res, result);
    }
    catch (error) {
        if (error instanceof DBConnectionError) {
            return next(error);
        }
        console.error('Error while getVendorListings()', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            data: { userId: req.userId },
        });
        next(new Error(FETCH_LISTING_ERROR.message));
    }
}
export async function createListing(req, res, next) {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new UnauthorizedError('Unauthorized');
        }
        const user = await users.getUser(userId);
        const role = user.unsafeMetadata?.role;
        if (role !== 'vendor') {
            throw new ForbiddenError('User is not a vendor');
        }
        const listing = await createListingInDb(userId, req.body);
        return sendSuccessResponse(res, {
            listing,
        }, 'Listing created successfully', 201);
    }
    catch (error) {
        if (error instanceof DBConnectionError) {
            return next(error);
        }
        if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
            return next(error);
        }
        if (error instanceof Error) {
            if (error.message === 'Missing required fields') {
                return next(new BadRequestError('Missing required fields'));
            }
            if (error.message === 'At least one image is required') {
                return next(new BadRequestError('At least one image is required'));
            }
            if (error.message === 'Vendor not found') {
                return next(new NotFoundError('Vendor not found'));
            }
        }
        console.error('Error while createListing()', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            data: { userId: req.userId, body: req.body },
        });
        next(error);
    }
}
export async function updateListing(req, res, next) {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new UnauthorizedError('Unauthorized');
        }
        const listing = await updateListingInDb(userId, req.body);
        return sendSuccessResponse(res, {
            listing,
        }, 'Listing updated successfully');
    }
    catch (error) {
        if (error instanceof DBConnectionError) {
            return next(error);
        }
        if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
            return next(error);
        }
        if (error instanceof Error) {
            if (error.message === 'Listing ID is required') {
                return next(new BadRequestError('Listing ID is required'));
            }
            if (error.message === 'Listing not found') {
                return next(new NotFoundError('Listing not found'));
            }
            if (error.message === 'Unauthorized: You do not own this listing') {
                return next(new ForbiddenError('Unauthorized: You do not own this listing'));
            }
        }
        console.error('Error while updateListing()', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            data: { userId: req.userId, body: req.body },
        });
        next(error);
    }
}
export async function deleteListing(req, res, next) {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new UnauthorizedError('Unauthorized');
        }
        const { listingId } = req.body;
        if (!listingId) {
            throw new BadRequestError('Listing ID is required');
        }
        await deleteListingFromDb(userId, listingId);
        return sendSuccessResponse(res, {
            listingId,
        }, 'Listing deleted successfully');
    }
    catch (error) {
        if (error instanceof DBConnectionError) {
            return next(error);
        }
        if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
            return next(error);
        }
        if (error instanceof Error) {
            if (error.message === 'Listing not found') {
                return next(new NotFoundError('Listing not found'));
            }
            if (error.message === 'Vendor not found') {
                return next(new NotFoundError('Vendor not found'));
            }
            if (error.message === 'Unauthorized: You do not own this listing') {
                return next(new ForbiddenError('Unauthorized: You do not own this listing'));
            }
        }
        console.error('Error while deleteListing()', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            data: { userId: req.userId, listingId },
        });
        next(error);
    }
}
export async function getListingById(req, res, next) {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new UnauthorizedError('Unauthorized');
        }
        const { id } = req.params;
        if (!id) {
            throw new BadRequestError('Listing ID is required');
        }
        const result = await getListingByIdFromDb(id, userId);
        return sendSuccessResponse(res, result);
    }
    catch (error) {
        if (error instanceof DBConnectionError) {
            return next(error);
        }
        if (error instanceof BadRequestError || error instanceof NotFoundError) {
            return next(error);
        }
        if (error instanceof Error) {
            if (error.message === 'Listing not found') {
                return next(new NotFoundError('Listing not found'));
            }
            if (error.message === 'Vendor not found') {
                return next(new NotFoundError('Vendor not found'));
            }
        }
        console.error('Error while getListingById()', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            data: { userId: req.userId, listingId: id },
        });
        next(error);
    }
}
export async function toggleListingStatus(req, res, next) {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new UnauthorizedError('Unauthorized');
        }
        const { id } = req.params;
        if (!id) {
            throw new BadRequestError('Listing ID is required');
        }
        const listing = await toggleListingStatusInDb(userId, id);
        return sendSuccessResponse(res, {
            listing,
        }, 'Listing status updated successfully');
    }
    catch (error) {
        if (error instanceof DBConnectionError) {
            return next(error);
        }
        if (error instanceof BadRequestError || error instanceof NotFoundError) {
            return next(error);
        }
        if (error instanceof Error) {
            if (error.message === 'Listing ID is required') {
                return next(new BadRequestError('Listing ID is required'));
            }
            if (error.message === 'Vendor not found') {
                return next(new NotFoundError('Vendor not found'));
            }
            if (error.message === 'Listing not found') {
                return next(new NotFoundError('Listing not found'));
            }
        }
        console.error('Error while toggleListingStatus()', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            data: { userId: req.userId, listingId: id },
        });
        next(error);
    }
}
export async function addImages(req, res, next) {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new UnauthorizedError('Unauthorized');
        }
        const { listingId, images } = req.body;
        if (!listingId || !images) {
            throw new BadRequestError('Listing ID and images are required');
        }
        const listing = await addImagesToListingInDb(userId, listingId, images);
        return sendSuccessResponse(res, {
            listing,
        }, 'Images added successfully');
    }
    catch (error) {
        if (error instanceof DBConnectionError) {
            return next(error);
        }
        if (error instanceof BadRequestError || error instanceof NotFoundError) {
            return next(error);
        }
        if (error instanceof Error) {
            if (error.message === 'Vendor not found') {
                return next(new NotFoundError('Vendor not found'));
            }
            if (error.message === 'Listing not found') {
                return next(new NotFoundError('Listing not found'));
            }
        }
        console.error('Error while addImages()', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            data: { userId: req.userId, listingId, imagesCount: images?.length },
        });
        next(error);
    }
}
export async function getListingReviews(req, res, next) {
    try {
        // This will be implemented when review repository is created
        return sendSuccessResponse(res, {
            reviews: [],
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=listing.controller.js.map