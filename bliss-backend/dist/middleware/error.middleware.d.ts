import { Request, Response, NextFunction } from 'express';
export interface ApiError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}
export declare class AppError extends Error implements ApiError {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number);
}
export declare const errorHandler: (err: ApiError, req: Request, res: Response, next: NextFunction) => void;
export default errorHandler;
//# sourceMappingURL=error.middleware.d.ts.map