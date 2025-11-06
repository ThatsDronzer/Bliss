import type { IListingService } from './listing.service.interface.js';
export declare class ListingService implements IListingService {
    getVendorListings(clerkId: string): Promise<{
        listings: any[];
    }>;
    getListingById(listingId: string, clerkId: string): Promise<{
        listing: any;
    }>;
    createListing(clerkId: string, listingData: any): Promise<any>;
    updateListing(clerkId: string, updateData: any): Promise<any>;
    deleteListing(clerkId: string, listingId: string): Promise<string>;
    toggleListingStatus(clerkId: string, listingId: string): Promise<any>;
    addImages(clerkId: string, listingId: string, images: any[]): Promise<any>;
}
//# sourceMappingURL=listing.service.d.ts.map