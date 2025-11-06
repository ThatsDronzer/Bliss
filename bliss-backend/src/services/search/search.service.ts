import type { ISearchService } from './search.service.interface.js';
import {
	searchVendorsFromDb,
	getServiceByIdFromDb,
} from '@repository/search/search.repository';
import { DBConnectionError } from '@exceptions/core.exceptions';
import { SEARCH_ERROR } from '@exceptions/errors';

export class SearchService implements ISearchService {
	async searchVendors(query?: string, location?: string): Promise<any> {
		try {
			return await searchVendorsFromDb(query, location);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(SEARCH_ERROR.message);
		}
	}

	async getServiceById(serviceId: string): Promise<any> {
		try {
			return await getServiceByIdFromDb(serviceId);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(SEARCH_ERROR.message);
		}
	}
}

