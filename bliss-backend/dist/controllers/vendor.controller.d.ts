import { Request, Response, NextFunction } from 'express';
/**
 * GET /api/vendor/:id
 * Get vendor by Clerk ID
 */
export declare const getVendorByClerkId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * PUT /api/vendor/:id
 * Update vendor by Clerk ID
 */
export declare const updateVendorByClerkId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * GET /api/vendors/:id
 * Get vendor by MongoDB ID with listings
 */
export declare const getVendorById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * GET /api/vendors/:id/services
 * Get vendor services
 */
export declare const getVendorServices: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * GET /api/vendor-services
 * Get vendor services for explore services page
 */
export declare const getVendorServicesForExplore: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * GET /api/vendor-verification
 * Get vendor verification status
 */
export declare const getVendorVerification: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
/**
 * POST /api/vendor-verification
 * Submit vendor verification
 */
export declare const submitVendorVerification: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=vendor.controller.d.ts.map