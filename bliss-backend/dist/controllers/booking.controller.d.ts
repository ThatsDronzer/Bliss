import { Request, Response, NextFunction } from 'express';
/**
 * GET /api/booking-status
 * Get booking status by service ID
 */
export declare const getBookingStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * PATCH /api/booking-status/:requestId
 * Cancel booking
 */
export declare const cancelBooking: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * POST /api/message-create
 * Create booking message
 */
export declare const createBookingMessage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * GET /api/vendor/booking-requests
 * Get vendor booking requests
 */
export declare const getVendorBookingRequests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * PATCH /api/vendor/booking-requests/:requestId
 * Update vendor booking request status
 */
export declare const updateVendorBookingRequestStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=booking.controller.d.ts.map