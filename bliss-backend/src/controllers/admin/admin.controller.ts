import type { Request, Response, NextFunction } from 'express';
import {
	getAdminPaymentsFromDb,
	processAdvancePaymentInDb,
	processFullPaymentInDb,
} from '@repository/admin/admin.repository';
import { BadRequestError, NotFoundError, DBConnectionError } from '@exceptions/core.exceptions';
import { sendSuccessResponse } from '@utils/Response.utils';
import { ADMIN_ERROR } from '@exceptions/errors';

export async function getAdminPayments(req: Request, res: Response, next: NextFunction) {
	try {
		const result = await getAdminPaymentsFromDb();
		return sendSuccessResponse(res, result);
	} catch (error) {
		if (error instanceof DBConnectionError) {
			return next(error);
		}
		
		console.error('Error while getAdminPayments()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
		});
		
		next(new Error(ADMIN_ERROR.message));
	}
}

export async function processAdvancePayment(req: Request, res: Response, next: NextFunction) {
	const { paymentId } = req.body;
	
	try {
		if (!paymentId) {
			throw new BadRequestError('Payment ID is required');
		}

		const result = await processAdvancePaymentInDb(paymentId);
		return sendSuccessResponse(res, result);
	} catch (error) {
		if (error instanceof DBConnectionError) {
			return next(error);
		}
		
		if (error instanceof BadRequestError || error instanceof NotFoundError) {
			return next(error);
		}
		
		if (error instanceof Error) {
			if (error.message === 'Payment ID is required') {
				return next(new BadRequestError(error.message));
			}
			if (error.message === 'Payment not found') {
				return next(new NotFoundError(error.message));
			}
			if (error.message === 'Message not found') {
				return next(new NotFoundError(error.message));
			}
			if (error.message.includes('already processed')) {
				return next(new BadRequestError(error.message));
			}
		}
		
		console.error('Error while processAdvancePayment()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: { paymentId },
		});
		
		next(new Error(ADMIN_ERROR.message));
	}
}

export async function processFullPayment(req: Request, res: Response, next: NextFunction) {
	const { paymentId } = req.body;
	
	try {
		if (!paymentId) {
			throw new BadRequestError('Payment ID is required');
		}

		const result = await processFullPaymentInDb(paymentId);
		return sendSuccessResponse(res, result);
	} catch (error) {
		if (error instanceof DBConnectionError) {
			return next(error);
		}
		
		if (error instanceof BadRequestError || error instanceof NotFoundError) {
			return next(error);
		}
		
		if (error instanceof Error) {
			if (error.message === 'Payment ID is required') {
				return next(new BadRequestError(error.message));
			}
			if (error.message === 'Payment not found') {
				return next(new NotFoundError(error.message));
			}
			if (error.message.includes('already processed')) {
				return next(new BadRequestError(error.message));
			}
		}
		
		console.error('Error while processFullPayment()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: { paymentId },
		});
		
		next(new Error(ADMIN_ERROR.message));
	}
}

