export interface ISearchService {
  searchVendors(query?: string, location?: string): Promise<{ vendors: any[]; total: number; listings: any[] }>;
  getServiceById(serviceId: string): Promise<any>;
}


