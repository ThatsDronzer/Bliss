import type { IListing } from '@models/listing/listing.model';

export interface IListingService {
	getVendorListings(clerkId: string): Promise<{ listings: any[] }>;
	getListingById(listingId: string, clerkId: string): Promise<{ listing: any }>;
	createListing(clerkId: string, listingData: any): Promise<any>;
	updateListing(clerkId: string, updateData: any): Promise<any>;
	deleteListing(clerkId: string, listingId: string): Promise<string>;
	toggleListingStatus(clerkId: string, listingId: string): Promise<any>;
	addImages(clerkId: string, listingId: string, images: any[]): Promise<any>;
}

