import type { IVendorService } from './vendor.service.interface.js';
import type { IVendor, IUpdateVendorInput } from '@models/vendor/vendor.model';
export declare class VendorService implements IVendorService {
    getVendorByClerkId(clerkId: string): Promise<IVendor | null>;
    getVendorById(id: string): Promise<any>;
    getVendorServices(id: string): Promise<any[]>;
    getVendorServicesForExplore(): Promise<any>;
    getVendorVerification(clerkId: string): Promise<any>;
    submitVendorVerification(verificationData: any): Promise<any>;
    updateVendorByClerkId(clerkId: string, updateData: IUpdateVendorInput): Promise<IVendor | null>;
}
//# sourceMappingURL=vendor.service.d.ts.map