import type { IVendorService } from './vendor.service.interface.js';
import type { IVendor, IUpdateVendorInput } from '@models/vendor/vendor.model';
import {
	getVendorByClerkIdFromDb,
	getVendorByIdFromDb,
	getVendorServicesFromDb,
	getVendorServicesForExploreFromDb,
	getVendorVerificationFromDb,
	submitVendorVerificationInDb,
	updateVendorByClerkIdInDb,
} from '@repository/vendor/vendor.repository';
import { DBConnectionError } from '@exceptions/core.exceptions';
import { FETCH_VENDOR_ERROR, CREATE_VENDOR_ERROR, UPDATE_VENDOR_ERROR } from '@exceptions/errors';

export class VendorService implements IVendorService {
	async getVendorByClerkId(clerkId: string): Promise<IVendor | null> {
		try {
			return await getVendorByClerkIdFromDb(clerkId);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(FETCH_VENDOR_ERROR.message);
		}
	}

	async getVendorById(id: string): Promise<any> {
		try {
			return await getVendorByIdFromDb(id);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(FETCH_VENDOR_ERROR.message);
		}
	}

	async getVendorServices(id: string): Promise<any[]> {
		try {
			return await getVendorServicesFromDb(id);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(FETCH_VENDOR_ERROR.message);
		}
	}

	async getVendorServicesForExplore(): Promise<any> {
		try {
			return await getVendorServicesForExploreFromDb();
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(FETCH_VENDOR_ERROR.message);
		}
	}

	async getVendorVerification(clerkId: string): Promise<any> {
		try {
			return await getVendorVerificationFromDb(clerkId);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(FETCH_VENDOR_ERROR.message);
		}
	}

	async submitVendorVerification(verificationData: any): Promise<any> {
		try {
			return await submitVendorVerificationInDb(verificationData);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(CREATE_VENDOR_ERROR.message);
		}
	}

	async updateVendorByClerkId(clerkId: string, updateData: IUpdateVendorInput): Promise<IVendor | null> {
		try {
			return await updateVendorByClerkIdInDb(clerkId, updateData);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(UPDATE_VENDOR_ERROR.message);
		}
	}
}

