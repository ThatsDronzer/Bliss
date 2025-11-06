import { Request, Response, NextFunction } from 'express';
/**
 * GET /api/search-vendors
 * Search vendors by query and location
 */
export declare const searchVendors: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * GET /api/services/:serviceId
 * Get service by ID
 */
export declare const getServiceById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * GET /api/vendors/:id/services
 * Get all services for a vendor
 */
export declare const getVendorServices: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=search.controller.d.ts.map