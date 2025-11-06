import { NextFunction, Request, Response } from 'express';
/**
 * GET /api/admin/payments
 * Get all admin payments
 */
export declare const getAdminPayments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * POST /api/admin/payments/advance
 * Process advance payment
 */
export declare const processAdvancePayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=admin.controller.d.ts.map