import type { Response } from 'express';
import { BaseException } from '../exceptions/core.exceptions.js';
export declare function getSuccessApiResponse(data: any, message?: string): {
    status: string;
    statusCode: number;
    data: any;
    error: null;
    message: string;
};
export declare function sendSuccessResponse(res: Response, data: any, message?: string, statusCode?: number): Response<any, Record<string, any>>;
export declare function sendErrorResponse(res: Response, error: BaseException | Error, statusCode?: number): Response<any, Record<string, any>>;
export declare function getErrorApiResponse(error: BaseException | Error): {
    status: string;
    statusCode: number;
    data: null;
    error: {
        message: string;
        errorCode: string;
    };
    message: string;
};
//# sourceMappingURL=Response.utils.d.ts.map