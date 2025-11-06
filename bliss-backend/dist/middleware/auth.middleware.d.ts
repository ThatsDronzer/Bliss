import { Request, Response, NextFunction } from 'express';
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
/**
 * Middleware to authenticate requests using Clerk
 */
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Middleware to check if user has required role
 */
export declare const requireRole: (...allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Optional authentication - doesn't fail if no token, but attaches user if token is valid
 */
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.middleware.d.ts.map