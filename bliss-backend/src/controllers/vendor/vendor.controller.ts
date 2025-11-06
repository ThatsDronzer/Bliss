import type { Request, Response, NextFunction } from 'express';
import { VendorService } from '@services/vendor/vendor.service';
import { BadRequestError, NotFoundError, UnauthorizedError } from '@exceptions/core.exceptions';
import { sendSuccessResponse } from '@utils/Response.utils';

const vendorService = new VendorService();

export async function getVendorByClerkId(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;

		if (!id) {
			throw new BadRequestError('Vendor ID is required');
		}

		const vendor = await vendorService.getVendorByClerkId(id);
		return sendSuccessResponse(res, vendor || {});
	} catch (error) {
		next(error);
	}
}

export async function getVendorById(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;

		if (!id) {
			throw new BadRequestError('Vendor ID is required');
		}

		const vendor = await vendorService.getVendorById(id);
		if (!vendor) {
			throw new NotFoundError('Vendor not found');
		}
		return sendSuccessResponse(res, vendor);
	} catch (error) {
		next(error);
	}
}

export async function getVendorServices(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;

		if (!id) {
			throw new BadRequestError('Vendor ID is required');
		}

		const services = await vendorService.getVendorServices(id);
		return sendSuccessResponse(res, { services });
	} catch (error) {
		next(error);
	}
}

export async function getVendorServicesForExplore(req: Request, res: Response, next: NextFunction) {
	try {
		const result = await vendorService.getVendorServicesForExplore();
		return sendSuccessResponse(res, result);
	} catch (error) {
		next(error);
	}
}

export async function getVendorVerification(req: Request, res: Response, next: NextFunction) {
	try {
		const userId = req.userId;

		if (!userId) {
			throw new UnauthorizedError('Unauthorized');
		}

		const result = await vendorService.getVendorVerification(userId);
		return sendSuccessResponse(res, result);
	} catch (error) {
		next(error);
	}
}

export async function submitVendorVerification(req: Request, res: Response, next: NextFunction) {
	try {
		const userId = req.userId;

		if (!userId) {
			throw new UnauthorizedError('Unauthorized');
		}

		const result = await vendorService.submitVendorVerification({
			clerkId: userId,
			...req.body,
		});

		return sendSuccessResponse(res, result, 'Verification submitted successfully');
	} catch (error) {
		next(error);
	}
}

export async function updateVendorByClerkId(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;

		if (!id) {
			throw new BadRequestError('Vendor ID is required');
		}

		const updatedVendor = await vendorService.updateVendorByClerkId(id, req.body);
		return sendSuccessResponse(res, updatedVendor);
	} catch (error) {
		next(error);
	}
}

