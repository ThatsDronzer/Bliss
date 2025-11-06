import { SearchService } from '../services/search.service.js';
import { AppError } from '../middleware/error.middleware.js';
const searchService = new SearchService();
/**
 * GET /api/search-vendors
 * Search vendors by query and location
 */
export const searchVendors = async (req, res, next) => {
    try {
        const query = req.query.query;
        const location = req.query.location;
        const result = await searchService.searchVendors(query, location);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
/**
 * GET /api/services/:serviceId
 * Get service by ID
 */
export const getServiceById = async (req, res, next) => {
    try {
        const { serviceId } = req.params;
        if (!serviceId) {
            throw new AppError('Service ID is required', 400);
        }
        const serviceDetails = await searchService.getServiceById(serviceId);
        res.json(serviceDetails);
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Service ID is required') {
                return next(new AppError('Invalid service ID', 400));
            }
            if (error.message === 'Service not found') {
                return next(new AppError('Service not found', 404));
            }
            if (error.message === 'Vendor not found') {
                return next(new AppError('Vendor not found', 404));
            }
        }
        next(error);
    }
};
/**
 * GET /api/vendors/:id/services
 * Get all services for a vendor
 */
export const getVendorServices = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new AppError('Vendor ID is required', 400);
        }
        // This endpoint can be handled by the vendor service
        // For now, return empty array or implement if needed
        res.json({ services: [] });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=search.controller.js.map