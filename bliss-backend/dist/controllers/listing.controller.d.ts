import { Request, Response, NextFunction } from 'express';
/**
 * GET /api/listing
 * Get all listings for authenticated vendor
 */
export declare const getVendorListings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * POST /api/listing
 * Create new listing
 */
export declare const createListing: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * PUT /api/listing
 * Update listing
 */
export declare const updateListing: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * DELETE /api/listing
 * Delete listing
 */
export declare const deleteListing: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * GET /api/listing/:id
 * Get listing by ID (vendor must own it)
 */
export declare const getListingById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * PATCH /api/listing/:id/status
 * Toggle listing active status
 */
export declare const toggleListingStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * PATCH /api/listing/add-images
 * Add images to listing (form data with file uploads)
 */
export declare const addImages: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
/**
 * GET /api/listing/reviews
 * Get listing reviews
 */
export declare const getListingReviews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=listing.controller.d.ts.map