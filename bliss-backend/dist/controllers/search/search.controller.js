import { SearchService } from '@services/search/search.service';
import { BadRequestError, NotFoundError } from '@exceptions/core.exceptions';
import { sendSuccessResponse } from '@utils/Response.utils';
const searchService = new SearchService();
export async function searchVendors(req, res, next) {
    try {
        const query = req.query.query;
        const location = req.query.location;
        const result = await searchService.searchVendors(query, location);
        return sendSuccessResponse(res, result);
    }
    catch (error) {
        next(error);
    }
}
export async function getServiceById(req, res, next) {
    try {
        const { serviceId } = req.params;
        if (!serviceId) {
            throw new BadRequestError('Service ID is required');
        }
        const serviceDetails = await searchService.getServiceById(serviceId);
        return sendSuccessResponse(res, serviceDetails);
    }
    catch (error) {
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
//# sourceMappingURL=search.controller.js.map