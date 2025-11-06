import type { IVendorService } from '@domain/service/vendorInterface';
import { vendorApi } from '@/lib/api/services';

export class VendorService implements IVendorService {
  async getVendorByClerkId(id: string) {
    const res = await vendorApi.getVendorByClerkId(id);
    return res.data;
  }
  async updateVendorByClerkId(id: string, data: any) {
    const res = await vendorApi.updateVendorByClerkId(id, data);
    return res.data;
  }
  async getVendorById(id: string) {
    const res = await vendorApi.getVendorById(id);
    return res.data;
  }
  async getVendorServices(id: string) {
    const res = await vendorApi.getVendorServices(id);
    return res.data?.services ?? [];
  }
  async getVendorVerification() {
    const res = await vendorApi.getVendorVerification('me');
    return res.data;
  }
  async submitVendorVerification(data: any) {
    const res = await vendorApi.submitVendorVerification(data);
    return res.data;
  }
  async getVendorServicesForExplore() {
    const res = await vendorApi.getVendorServicesForExplore();
    return res.data;
  }
}


