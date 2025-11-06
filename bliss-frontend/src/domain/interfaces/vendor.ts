export interface VendorAddress {
  City?: string;
  State?: string;
}

export interface VendorServiceItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  images?: string[];
  features?: string[];
  isActive?: boolean;
}

export interface Vendor {
  id: string;
  service_name: string;
  service_email?: string;
  service_phone?: string;
  service_address?: VendorAddress;
  service_description?: string;
  service_type?: string;
  isVerified?: boolean;
  services?: VendorServiceItem[];
}


