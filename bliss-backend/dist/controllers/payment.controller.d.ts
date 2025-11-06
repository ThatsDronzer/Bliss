import { Request, Response, NextFunction } from 'express';
/**
 * POST /api/payments/create
 * Create payment order
 */
export declare const createPayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * POST /api/payments/verify
 * Verify payment
 */
export declare const verifyPayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=payment.controller.d.ts.map