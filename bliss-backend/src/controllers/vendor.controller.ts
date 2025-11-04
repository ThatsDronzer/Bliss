import { Request, Response, NextFunction } from 'express';
import { VendorService } from '../services/vendor.service.js';
import { AppError } from '../middleware/error.middleware.js';

const vendorService = new VendorService();

/**
 * GET /api/vendor/:id
 * Get vendor by Clerk ID
 */
export const getVendorByClerkId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new AppError('Vendor ID is required', 400);
    }

    const vendor = await vendorService.getVendorByClerkId(id);
    res.json(vendor || {});
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/vendor/:id
 * Update vendor by Clerk ID
 */
export const updateVendorByClerkId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new AppError('Vendor ID is required', 400);
    }

    const updatedVendor = await vendorService.updateVendorByClerkId(id, req.body);
    res.json(updatedVendor);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/vendors/:id
 * Get vendor by MongoDB ID with listings
 */
export const getVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new AppError('Vendor ID is required', 400);
    }

    const vendorDetails = await vendorService.getVendorById(id);

    if (!vendorDetails) {
      throw new AppError('Vendor not found', 404);
    }

    res.json(vendorDetails);
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid vendor ID') {
      return next(new AppError('Invalid vendor ID', 400));
    }
    next(error);
  }
};

/**
 * GET /api/vendors/:id/services
 * Get vendor services
 */
export const getVendorServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new AppError('Vendor ID is required', 400);
    }

    const services = await vendorService.getVendorServices(id);
    res.json({ services });
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid vendor ID') {
      return next(new AppError('Invalid vendor ID', 400));
    }
    next(error);
  }
};

/**
 * GET /api/vendor-services
 * Get vendor services for explore services page
 */
export const getVendorServicesForExplore = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await vendorService.getVendorServicesForExplore();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/vendor-verification
 * Get vendor verification status
 */
export const getVendorVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clerkId = req.query.clerkId as string;

    if (!clerkId) {
      throw new AppError('clerkId is required', 400);
    }

    const result = await vendorService.getVendorVerification(clerkId);

    if (result.message === 'Vendor not found') {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'clerkId is required') {
      return next(new AppError(error.message, 400));
    }
    next(error);
  }
};

/**
 * POST /api/vendor-verification
 * Submit vendor verification
 */
export const submitVendorVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await vendorService.submitVendorVerification(req.body);
    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'clerkId is required') {
      return next(new AppError(error.message, 400));
    }
    next(error);
  }
};

