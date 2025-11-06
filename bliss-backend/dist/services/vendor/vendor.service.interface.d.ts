import type { IUpdateVendorInput, IVendor } from '@models/vendor/vendor.model';
export interface IVendorService {
    getVendorByClerkId(clerkId: string): Promise<IVendor | null>;
    getVendorById(id: string): Promise<any>;
    getVendorServices(id: string): Promise<any[]>;
    getVendorServicesForExplore(): Promise<any>;
    getVendorVerification(clerkId: string): Promise<any>;
    submitVendorVerification(verificationData: any): Promise<any>;
    updateVendorByClerkId(clerkId: string, updateData: IUpdateVendorInput): Promise<IVendor | null>;
}
//# sourceMappingURL=vendor.service.interface.d.ts.map