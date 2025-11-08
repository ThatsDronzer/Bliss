import type { Request, Response, NextFunction } from 'express';
import {
	getVendorByClerkIdFromDb,
	getVendorByIdFromDb,
	getVendorServicesFromDb,
	getVendorServicesForExploreFromDb,
	getVendorVerificationFromDb,
	submitVendorVerificationInDb,
	updateVendorByClerkIdInDb,
} from '@repository/vendor/vendor.repository';
import { BadRequestError, NotFoundError, UnauthorizedError, DBConnectionError } from '@exceptions/core.exceptions';
import { sendSuccessResponse } from '@utils/Response.utils';
import { FETCH_VENDOR_ERROR, CREATE_VENDOR_ERROR, UPDATE_VENDOR_ERROR } from '@exceptions/errors';

export async function getVendorByClerkId(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;

		if (!id) {
			throw new BadRequestError('Vendor ID is required');
		}

		const vendor = await getVendorByClerkIdFromDb(id);
		return sendSuccessResponse(res, vendor || {});
	} catch (error) {
		if (error instanceof DBConnectionError) {
			return next(error);
		}

		if (error instanceof BadRequestError) {
			return next(error);
		}

		console.error('Error while getVendorByClerkId()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: { id: req.params.id },
		});

		next(new Error(FETCH_VENDOR_ERROR.message));
	}
}

export async function getVendorById(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;

		if (!id) {
			throw new BadRequestError('Vendor ID is required');
		}

		const vendor = await getVendorByIdFromDb(id);
		if (!vendor) {
			throw new NotFoundError('Vendor not found');
		}
		return sendSuccessResponse(res, vendor);
	} catch (error) {
		if (error instanceof DBConnectionError) {
			return next(error);
		}

		if (error instanceof BadRequestError || error instanceof NotFoundError) {
			return next(error);
		}

		console.error('Error while getVendorById()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: { id: req.params.id },
		});

		next(new Error(FETCH_VENDOR_ERROR.message));
	}
}

export async function getVendorServices(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;

		if (!id) {
			throw new BadRequestError('Vendor ID is required');
		}

		const services = await getVendorServicesFromDb(id);
		return sendSuccessResponse(res, { services });
	} catch (error) {
		if (error instanceof DBConnectionError) {
			return next(error);
		}

		if (error instanceof BadRequestError) {
			return next(error);
		}

		console.error('Error while getVendorServices()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: { id: req.params.id },
		});

		next(new Error(FETCH_VENDOR_ERROR.message));
	}
}

export async function getVendorServicesForExplore(req: Request, res: Response, next: NextFunction) {
	try {
		const result = await getVendorServicesForExploreFromDb();
		return sendSuccessResponse(res, result);
	} catch (error) {
		if (error instanceof DBConnectionError) {
			return next(error);
		}

		console.error('Error while getVendorServicesForExplore()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
		});

		next(new Error(FETCH_VENDOR_ERROR.message));
	}
}

export async function getVendorVerification(req: Request, res: Response, next: NextFunction) {
	try {
		const userId = req.userId;

		if (!userId) {
			throw new UnauthorizedError('Unauthorized');
		}

		const result = await getVendorVerificationFromDb(userId);
		return sendSuccessResponse(res, result);
	} catch (error) {
		if (error instanceof DBConnectionError) {
			return next(error);
		}

		if (error instanceof UnauthorizedError) {
			return next(error);
		}

		console.error('Error while getVendorVerification()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: { userId: req.userId },
		});

		next(new Error(FETCH_VENDOR_ERROR.message));
	}
}

export async function submitVendorVerification(req: Request, res: Response, next: NextFunction) {
	try {
		const userId = req.userId;

		if (!userId) {
			throw new UnauthorizedError('Unauthorized');
		}

		const result = await submitVendorVerificationInDb({
			clerkId: userId,
			...req.body,
		});

		return sendSuccessResponse(res, result, 'Verification submitted successfully');
	} catch (error) {
		if (error instanceof DBConnectionError) {
			return next(error);
		}

		if (error instanceof UnauthorizedError) {
			return next(error);
		}

		console.error('Error while submitVendorVerification()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: { userId: req.userId, body: req.body },
		});

		next(new Error(CREATE_VENDOR_ERROR.message));
	}
}

export async function updateVendorByClerkId(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;

		if (!id) {
			throw new BadRequestError('Vendor ID is required');
		}

		const updatedVendor = await updateVendorByClerkIdInDb(id, req.body);
		return sendSuccessResponse(res, updatedVendor);
	} catch (error) {
		if (error instanceof DBConnectionError) {
			return next(error);
		}

		if (error instanceof BadRequestError) {
			return next(error);
		}

		console.error('Error while updateVendorByClerkId()', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: { id: req.params.id, body: req.body },
		});

		next(new Error(UPDATE_VENDOR_ERROR.message));
	}
}

