export class BaseException extends Error {
    constructor(message, errorCode, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class BadRequestError extends BaseException {
    constructor(message = 'Bad Request', errorCode = 'BAD_REQUEST') {
        super(message, errorCode, 400);
    }
}
export class UnauthorizedError extends BaseException {
    constructor(message = 'Unauthorized', errorCode = 'UNAUTHORIZED') {
        super(message, errorCode, 401);
    }
}
export class ForbiddenError extends BaseException {
    constructor(message = 'Forbidden', errorCode = 'FORBIDDEN') {
        super(message, errorCode, 403);
    }
}
export class NotFoundError extends BaseException {
    constructor(message = 'Not Found', errorCode = 'NOT_FOUND') {
        super(message, errorCode, 404);
    }
}
export class InternalServerError extends BaseException {
    constructor(message = 'Internal Server Error', errorCode = 'INTERNAL_SERVER_ERROR') {
        super(message, errorCode, 500);
    }
}
export class DBConnectionError extends BaseException {
    constructor(message = 'Database Connection Error', errorCode = 'DB_CONNECTION_ERROR') {
        super(message, errorCode, 500);
    }
}
//# sourceMappingURL=core.exceptions.js.map