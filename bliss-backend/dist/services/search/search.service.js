import { searchVendorsFromDb, getServiceByIdFromDb, } from '@repository/search/search.repository';
import { DBConnectionError } from '@exceptions/core.exceptions';
import { SEARCH_ERROR } from '@exceptions/errors';
export class SearchService {
    async searchVendors(query, location) {
        try {
            return await searchVendorsFromDb(query, location);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(SEARCH_ERROR.message);
        }
    }
    async getServiceById(serviceId) {
        try {
            return await getServiceByIdFromDb(serviceId);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(SEARCH_ERROR.message);
        }
    }
}
//# sourceMappingURL=search.service.js.map