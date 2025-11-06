import type { IVendor } from '@models/vendor/vendor.model';
export declare function getVendorByClerkIdFromDb(clerkId: string): Promise<IVendor | null>;
export declare function getVendorByIdFromDb(id: string): Promise<any>;
export declare function getVendorServicesFromDb(id: string): Promise<any[]>;
export declare function getVendorServicesForExploreFromDb(): Promise<any>;
export declare function getVendorVerificationFromDb(clerkId: string): Promise<any>;
export declare function submitVendorVerificationInDb(verificationData: any): Promise<any>;
export declare function updateVendorByClerkIdInDb(clerkId: string, updateData: any): Promise<IVendor | null>;
//# sourceMappingURL=vendor.repository.d.ts.map