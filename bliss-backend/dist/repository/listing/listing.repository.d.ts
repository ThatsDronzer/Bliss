interface CloudinaryImage {
    url: string;
    public_id: string;
    [key: string]: any;
}
export declare function getVendorListingsFromDb(clerkId: string): Promise<any>;
export declare function getListingByIdFromDb(listingId: string, clerkId: string): Promise<any>;
export declare function createListingInDb(clerkId: string, listingData: any): Promise<any>;
export declare function updateListingInDb(clerkId: string, updateData: any): Promise<any>;
export declare function deleteListingFromDb(clerkId: string, listingId: string): Promise<string>;
export declare function toggleListingStatusInDb(clerkId: string, listingId: string): Promise<any>;
export declare function addImagesToListingInDb(clerkId: string, listingId: string, images: CloudinaryImage[]): Promise<any>;
export {};
//# sourceMappingURL=listing.repository.d.ts.map