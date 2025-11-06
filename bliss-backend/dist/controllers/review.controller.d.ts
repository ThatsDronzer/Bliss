import { Request, Response, NextFunction } from 'express';
/**
 * POST /api/review
 * Create review (for service or vendor)
 */
export declare const createReview: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * GET /api/review
 * Get reviews by target
 */
export declare const getReviews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * DELETE /api/review
 * Delete review
 */
export declare const deleteReview: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * POST /api/reviews
 * Create listing review
 */
export declare const createListingReview: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * DELETE /api/reviews
 * Delete listing review
 */
export declare const deleteListingReview: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=review.controller.d.ts.map