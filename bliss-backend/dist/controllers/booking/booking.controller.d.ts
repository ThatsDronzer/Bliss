import type { NextFunction, Request, Response } from 'express';
export declare function getBookingStatus(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
export declare function cancelBooking(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=booking.controller.d.ts.map