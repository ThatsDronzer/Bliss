interface CloudinaryImage {
    url: string;
    public_id: string;
    [key: string]: any;
}
export declare class ListingService {
    /**
     * Get all listings for a vendor
     */
    getVendorListings(clerkId: string): Promise<{
        listings: any[];
    }>;
    /**
     * Get listing by ID (vendor must own it)
     */
    getListingById(listingId: string, clerkId: string): Promise<{
        listing: any;
    }>;
    /**
     * Create new listing
     */
    createListing(clerkId: string, listingData: any): Promise<any>;
    /**
     * Update listing
     */
    updateListing(clerkId: string, updateData: any): Promise<any>;
    /**
     * Delete listing
     */
    deleteListing(clerkId: string, listingId: string): Promise<string>;
    /**
     * Toggle listing active status
     */
    toggleListingStatus(clerkId: string, listingId: string): Promise<any>;
    /**
     * Add images to listing
     */
    addImages(clerkId: string, listingId: string, newImages: CloudinaryImage[]): Promise<CloudinaryImage[]>;
    /**
     * Get listing reviews
     */
    getListingReviews(listingId: string): Promise<any[]>;
}
export {};
//# sourceMappingURL=listing.service.d.ts.map