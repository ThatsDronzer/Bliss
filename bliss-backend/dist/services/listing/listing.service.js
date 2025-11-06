import { DBConnectionError } from '@exceptions/core.exceptions';
import { CREATE_LISTING_ERROR, DELETE_LISTING_ERROR, FETCH_LISTING_ERROR, UPDATE_LISTING_ERROR } from '@exceptions/errors';
import { addImagesToListingInDb, createListingInDb, deleteListingFromDb, getListingByIdFromDb, getVendorListingsFromDb, toggleListingStatusInDb, updateListingInDb, } from '@repository/listing/listing.repository';
export class ListingService {
    async getVendorListings(clerkId) {
        try {
            return await getVendorListingsFromDb(clerkId);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(FETCH_LISTING_ERROR.message);
        }
    }
    async getListingById(listingId, clerkId) {
        try {
            return await getListingByIdFromDb(listingId, clerkId);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(FETCH_LISTING_ERROR.message);
        }
    }
    async createListing(clerkId, listingData) {
        try {
            return await createListingInDb(clerkId, listingData);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(CREATE_LISTING_ERROR.message);
        }
    }
    async updateListing(clerkId, updateData) {
        try {
            return await updateListingInDb(clerkId, updateData);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(UPDATE_LISTING_ERROR.message);
        }
    }
    async deleteListing(clerkId, listingId) {
        try {
            return await deleteListingFromDb(clerkId, listingId);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(DELETE_LISTING_ERROR.message);
        }
    }
    async toggleListingStatus(clerkId, listingId) {
        try {
            return await toggleListingStatusInDb(clerkId, listingId);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(FETCH_LISTING_ERROR.message);
        }
    }
    async addImages(clerkId, listingId, images) {
        try {
            return await addImagesToListingInDb(clerkId, listingId, images);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(UPDATE_LISTING_ERROR.message);
        }
    }
}
//# sourceMappingURL=listing.service.js.map