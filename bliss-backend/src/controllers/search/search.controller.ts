import type { Request, Response, NextFunction } from 'express';
import { SearchService } from '@services/search/search.service';
import { BadRequestError, NotFoundError } from '@exceptions/core.exceptions';
import { sendSuccessResponse } from '@utils/Response.utils';

const searchService = new SearchService();

export async function searchVendors(req: Request, res: Response, next: NextFunction) {
	try {
		const query = req.query.query as string | undefined;
		const location = req.query.location as string | undefined;

		const result = await searchService.searchVendors(query, location);
		return sendSuccessResponse(res, result);
	} catch (error) {
		next(error);
	}
}

export async function getServiceById(req: Request, res: Response, next: NextFunction) {
	try {
		const { serviceId } = req.params;

		if (!serviceId) {
			throw new BadRequestError('Service ID is required');
		}

		const serviceDetails = await searchService.getServiceById(serviceId);
		return sendSuccessResponse(res, serviceDetails);
	} catch (error) {
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
		next(error);
	}
}

