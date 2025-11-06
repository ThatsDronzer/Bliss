import { Request, Response, NextFunction } from 'express';
/**
 * GET /api/user/:id
 * Get user by Clerk ID
 */
export declare const getUserById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * POST /api/user/create
 * Create or update user
 */
export declare const createUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * PUT /api/user/:id
 * Update user
 */
export declare const updateUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * GET /api/user/booking-requests
 * Get user's booking requests
 */
export declare const getUserBookingRequests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=user.controller.d.ts.map