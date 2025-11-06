import type { ISearchService } from './search.service.interface.js';
export declare class SearchService implements ISearchService {
    searchVendors(query?: string, location?: string): Promise<any>;
    getServiceById(serviceId: string): Promise<any>;
}
//# sourceMappingURL=search.service.d.ts.map