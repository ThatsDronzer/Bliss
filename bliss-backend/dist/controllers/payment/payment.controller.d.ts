import type { Request, Response, NextFunction } from 'express';
export declare function createPayment(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
export declare function verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=payment.controller.d.ts.map