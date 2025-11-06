import { DBConnectionError } from '@exceptions/core.exceptions';
import { CREATE_LISTING_ERROR, DELETE_LISTING_ERROR, FETCH_LISTING_ERROR, UPDATE_LISTING_ERROR } from '@exceptions/errors';
import {
    addImagesToListingInDb,
    createListingInDb,
    deleteListingFromDb,
    getListingByIdFromDb,
    getVendorListingsFromDb,
    toggleListingStatusInDb,
    updateListingInDb,
} from '@repository/listing/listing.repository';
import type { IListingService } from './listing.service.interface.js';

export class ListingService implements IListingService {
	async getVendorListings(clerkId: string): Promise<{ listings: any[] }> {
		try {
			return await getVendorListingsFromDb(clerkId);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(FETCH_LISTING_ERROR.message);
		}
	}

	async getListingById(listingId: string, clerkId: string): Promise<{ listing: any }> {
		try {
			return await getListingByIdFromDb(listingId, clerkId);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(FETCH_LISTING_ERROR.message);
		}
	}

	async createListing(clerkId: string, listingData: any): Promise<any> {
		try {
			return await createListingInDb(clerkId, listingData);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(CREATE_LISTING_ERROR.message);
		}
	}

	async updateListing(clerkId: string, updateData: any): Promise<any> {
		try {
			return await updateListingInDb(clerkId, updateData);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(UPDATE_LISTING_ERROR.message);
		}
	}

	async deleteListing(clerkId: string, listingId: string): Promise<string> {
		try {
			return await deleteListingFromDb(clerkId, listingId);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(DELETE_LISTING_ERROR.message);
		}
	}

	async toggleListingStatus(clerkId: string, listingId: string): Promise<any> {
		try {
			return await toggleListingStatusInDb(clerkId, listingId);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(FETCH_LISTING_ERROR.message);
		}
	}

	async addImages(clerkId: string, listingId: string, images: any[]): Promise<any> {
		try {
			return await addImagesToListingInDb(clerkId, listingId, images);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(UPDATE_LISTING_ERROR.message);
		}
	}
}

