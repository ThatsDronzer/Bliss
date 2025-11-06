import type { Listing } from '@domain/interfaces/listing';

export interface IListingService {
  getListings(): Promise<Listing[]>;
  getListingById(id: string): Promise<Listing>;
  createListing(data: Partial<Listing>): Promise<Listing>;
  updateListing(data: Partial<Listing>): Promise<Listing>;
  deleteListing(listingId: string): Promise<void>;
  toggleListingStatus(id: string): Promise<Listing>;
  addImages(listingId: string, images: File[]): Promise<any>;
  getListingReviews(listingId: string): Promise<any[]>;
}


