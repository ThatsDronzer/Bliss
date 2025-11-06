export interface ISearchService {
	searchVendors(query?: string, location?: string): Promise<any>;
	getServiceById(serviceId: string): Promise<any>;
}

