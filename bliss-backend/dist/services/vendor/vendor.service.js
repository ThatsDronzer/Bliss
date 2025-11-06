import { getVendorByClerkIdFromDb, getVendorByIdFromDb, getVendorServicesFromDb, getVendorServicesForExploreFromDb, getVendorVerificationFromDb, submitVendorVerificationInDb, updateVendorByClerkIdInDb, } from '@repository/vendor/vendor.repository';
import { DBConnectionError } from '@exceptions/core.exceptions';
import { FETCH_VENDOR_ERROR, CREATE_VENDOR_ERROR, UPDATE_VENDOR_ERROR } from '@exceptions/errors';
export class VendorService {
    async getVendorByClerkId(clerkId) {
        try {
            return await getVendorByClerkIdFromDb(clerkId);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(FETCH_VENDOR_ERROR.message);
        }
    }
    async getVendorById(id) {
        try {
            return await getVendorByIdFromDb(id);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(FETCH_VENDOR_ERROR.message);
        }
    }
    async getVendorServices(id) {
        try {
            return await getVendorServicesFromDb(id);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(FETCH_VENDOR_ERROR.message);
        }
    }
    async getVendorServicesForExplore() {
        try {
            return await getVendorServicesForExploreFromDb();
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(FETCH_VENDOR_ERROR.message);
        }
    }
    async getVendorVerification(clerkId) {
        try {
            return await getVendorVerificationFromDb(clerkId);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(FETCH_VENDOR_ERROR.message);
        }
    }
    async submitVendorVerification(verificationData) {
        try {
            return await submitVendorVerificationInDb(verificationData);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(CREATE_VENDOR_ERROR.message);
        }
    }
    async updateVendorByClerkId(clerkId, updateData) {
        try {
            return await updateVendorByClerkIdInDb(clerkId, updateData);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(UPDATE_VENDOR_ERROR.message);
        }
    }
}
//# sourceMappingURL=vendor.service.js.map