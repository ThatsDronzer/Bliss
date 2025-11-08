import type { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../../services/notification.service.js';
import { BadRequestError } from '@exceptions/core.exceptions';
import { sendSuccessResponse } from '@utils/Response.utils';

const notificationService = new NotificationService();

export async function notifyCustomer(req: Request, res: Response, next: NextFunction) {
	const { requestId, customerPhone, vendorName, status, customerName } = req.body;
	
	try {
		if (!requestId || !customerPhone || !vendorName || !status) {
			throw new BadRequestError('Missing required fields: requestId, customerPhone, vendorName, status');
		}

		const result = await notificationService.notifyCustomer({
			requestId,
			customerPhone,
			vendorName,
			status,
			customerName,
		});

		return sendSuccessResponse(res, {
			result,
		});
	} catch (error) {
		if (error instanceof BadRequestError) {
			return next(error);
		}
		
		if (error instanceof Error) {
			if (error.message.includes('Missing required fields')) {
				return next(new BadRequestError(error.message));
			}
			if (error.message.includes('Twilio not configured') || error.message.includes('not configured')) {
				return next(new BadRequestError(error.message));
			}
		}
		
		console.error('Error while notifyCustomer()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: { requestId, customerPhone, vendorName, status },
		});
		
		next(error);
	}
}

export async function notifyVendor(req: Request, res: Response, next: NextFunction) {
	const { customerName, requestId } = req.body;
	
	try {
		if (!customerName || !requestId) {
			throw new BadRequestError('Missing required fields: customerName, requestId');
		}

		const result = await notificationService.notifyVendor({
			customerName,
			requestId,
		});

		return sendSuccessResponse(res, {
			sid: result.sid,
		});
	} catch (error) {
		if (error instanceof BadRequestError) {
			return next(error);
		}
		
		if (error instanceof Error) {
			if (error.message.includes('Missing required fields')) {
				return next(new BadRequestError(error.message));
			}
			if (error.message.includes('not configured')) {
				return next(new BadRequestError(error.message));
			}
		}
		
		console.error('Error while notifyVendor()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: { customerName, requestId },
		});
		
		next(error);
	}
}

