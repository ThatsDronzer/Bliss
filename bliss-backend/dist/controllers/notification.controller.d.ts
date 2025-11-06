import { Request, Response, NextFunction } from 'express';
/**
 * POST /api/notify/customer
 * Send customer notification
 */
export declare const notifyCustomer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * POST /api/notify/vendor
 * Send vendor notification
 */
export declare const notifyVendor: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=notification.controller.d.ts.map