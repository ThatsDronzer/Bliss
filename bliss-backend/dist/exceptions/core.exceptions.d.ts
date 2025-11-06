export declare class BaseException extends Error {
    statusCode: number;
    errorCode: string;
    constructor(message: string, errorCode: string, statusCode: number);
}
export declare class BadRequestError extends BaseException {
    constructor(message?: string, errorCode?: string);
}
export declare class UnauthorizedError extends BaseException {
    constructor(message?: string, errorCode?: string);
}
export declare class ForbiddenError extends BaseException {
    constructor(message?: string, errorCode?: string);
}
export declare class NotFoundError extends BaseException {
    constructor(message?: string, errorCode?: string);
}
export declare class InternalServerError extends BaseException {
    constructor(message?: string, errorCode?: string);
}
export declare class DBConnectionError extends BaseException {
    constructor(message?: string, errorCode?: string);
}
//# sourceMappingURL=core.exceptions.d.ts.map