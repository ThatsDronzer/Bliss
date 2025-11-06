export class BaseException extends Error {
	statusCode: number;
	errorCode: string;

	constructor(message: string, errorCode: string, statusCode: number) {
		super(message);
		this.name = this.constructor.name;
		this.errorCode = errorCode;
		this.statusCode = statusCode;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class BadRequestError extends BaseException {
	constructor(message: string = 'Bad Request', errorCode: string = 'BAD_REQUEST') {
		super(message, errorCode, 400);
	}
}

export class UnauthorizedError extends BaseException {
	constructor(message: string = 'Unauthorized', errorCode: string = 'UNAUTHORIZED') {
		super(message, errorCode, 401);
	}
}

export class ForbiddenError extends BaseException {
	constructor(message: string = 'Forbidden', errorCode: string = 'FORBIDDEN') {
		super(message, errorCode, 403);
	}
}

export class NotFoundError extends BaseException {
	constructor(message: string = 'Not Found', errorCode: string = 'NOT_FOUND') {
		super(message, errorCode, 404);
	}
}

export class InternalServerError extends BaseException {
	constructor(message: string = 'Internal Server Error', errorCode: string = 'INTERNAL_SERVER_ERROR') {
		super(message, errorCode, 500);
	}
}

export class DBConnectionError extends BaseException {
	constructor(message: string = 'Database Connection Error', errorCode: string = 'DB_CONNECTION_ERROR') {
		super(message, errorCode, 500);
	}
}

