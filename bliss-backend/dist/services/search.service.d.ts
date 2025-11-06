export declare class SearchService {
    /**
     * Search vendors by query and location
     */
    searchVendors(query?: string, location?: string): Promise<{
        vendors: any[];
        total: number;
        listings: {
            id: any;
            title: any;
            description: any;
            price: any;
            location: any;
            features: any;
        }[];
    }>;
    /**
     * Get service by ID
     */
    getServiceById(serviceId: string): Promise<{
        _id: any;
        name: any;
        description: any;
        price: any;
        images: any;
        features: any;
        isActive: any;
        vendor: {
            _id: any;
            name: any;
            category: any;
        };
        category: any;
        items: any;
    }>;
}
//# sourceMappingURL=search.service.d.ts.map