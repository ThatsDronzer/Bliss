import type { Request, Response, NextFunction } from 'express';
import {
	searchVendorsFromDb,
	getServiceByIdFromDb,
} from '@repository/search/search.repository';
import { BadRequestError, NotFoundError, DBConnectionError } from '@exceptions/core.exceptions';
import { sendSuccessResponse } from '@utils/Response.utils';
import { SEARCH_ERROR } from '@exceptions/errors';

export async function searchVendors(req: Request, res: Response, next: NextFunction) {
	const query = req.query.query as string | undefined;
	const location = req.query.location as string | undefined;
	
	try {
		const result = await searchVendorsFromDb(query, location);
		return sendSuccessResponse(res, result);
	} catch (error) {
		if (error instanceof DBConnectionError) {
			return next(error);
		}
		
		console.error('Error while searchVendors()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: { query, location },
		});
		
		next(new Error(SEARCH_ERROR.message));
	}
}

export async function getServiceById(req: Request, res: Response, next: NextFunction) {
	const { serviceId } = req.params;
	
	try {
		if (!serviceId) {
			throw new BadRequestError('Service ID is required');
		}

		const serviceDetails = await getServiceByIdFromDb(serviceId);
		return sendSuccessResponse(res, serviceDetails);
	} catch (error) {
		if (error instanceof DBConnectionError) {
			return next(error);
		}
		
		if (error instanceof BadRequestError || error instanceof NotFoundError) {
			return next(error);
		}
		
		if (error instanceof Error) {
			if (error.message === 'Service ID is required') {
				return next(new BadRequestError('Invalid service ID'));
			}
			if (error.message === 'Service not found') {
				return next(new NotFoundError('Service not found'));
			}
			if (error.message === 'Vendor not found') {
				return next(new NotFoundError('Vendor not found'));
			}
		}
		
		console.error('Error while getServiceById()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: { serviceId },
		});
		
		next(new Error(SEARCH_ERROR.message));
	}
}

