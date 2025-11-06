export interface ListingImage { url: string; publicId?: string }

export interface Listing {
  id: string;
  owner: string;
  title: string;
  description: string;
  price: number;
  basePrice?: number;
  images?: ListingImage[];
  features?: string[];
  location?: string;
  isActive: boolean;
}


