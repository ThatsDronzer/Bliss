import { NextFunction, Request, Response } from 'express';
declare global {
    namespace Express {
        interface Request {
            userId?: string;
            userRole?: string;
            user?: any;
        }
    }
}
export interface AuthRequest extends Request {
    userId: string;
    userRole: string;
    user: any;
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const requireRole: (...allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.middleware.d.ts.map