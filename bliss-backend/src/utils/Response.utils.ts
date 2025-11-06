import type { Response } from 'express';
import { BaseException } from '../exceptions/core.exceptions.js';

export function getSuccessApiResponse(data: any, message: string = 'Operation Successful') {
	return {
		status: 'success',
		statusCode: 200,
		data,
		error: null,
		message,
	};
}

export function sendSuccessResponse(res: Response, data: any, message: string = 'Operation Successful', statusCode: number = 200) {
	return res.status(statusCode).json({
		status: 'success',
		statusCode,
		data,
		error: null,
		message,
	});
}

export function sendErrorResponse(res: Response, error: BaseException | Error, statusCode?: number) {
	if (error instanceof BaseException) {
		return res.status(statusCode || error.statusCode).json({
			status: 'error',
			statusCode: statusCode || error.statusCode,
			data: null,
			error: {
				message: error.message,
				errorCode: error.errorCode,
			},
			message: error.message,
		});
	}

	return res.status(statusCode || 500).json({
		status: 'error',
		statusCode: statusCode || 500,
		data: null,
		error: {
			message: error.message || 'Internal Server Error',
			errorCode: 'INTERNAL_SERVER_ERROR',
		},
		message: error.message || 'Internal Server Error',
	});
}

export function getErrorApiResponse(error: BaseException | Error) {
	if (error instanceof BaseException) {
		return {
			status: 'error',
			statusCode: error.statusCode,
			data: null,
			error: {
				message: error.message,
				errorCode: error.errorCode,
			},
			message: error.message,
		};
	}

	return {
		status: 'error',
		statusCode: 500,
		data: null,
		error: {
			message: error.message || 'Internal Server Error',
			errorCode: 'INTERNAL_SERVER_ERROR',
		},
		message: error.message || 'Internal Server Error',
	};
}

