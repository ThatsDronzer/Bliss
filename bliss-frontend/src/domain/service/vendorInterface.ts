import type { Vendor } from '@domain/interfaces/vendor';

export interface IVendorService {
  getVendorByClerkId(id: string): Promise<Vendor | null>;
  updateVendorByClerkId(id: string, data: Partial<Vendor>): Promise<Vendor>;
  getVendorById(id: string): Promise<any>;
  getVendorServices(id: string): Promise<any[]>;
  getVendorVerification(): Promise<any>;
  submitVendorVerification(data: any): Promise<any>;
  getVendorServicesForExplore(): Promise<any>;
}


