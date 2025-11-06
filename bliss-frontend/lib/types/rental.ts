export type RentalCategory =
  | "DJ Setup"
  | "Tent & Canopy"
  | "Chairs & Tables"
  | "Lighting & Decoration"
  | "Party Decor"
  | "Sound Systems"
  | "Portable Stage"
  | "Photography"
  | "Buffet Setup";

export interface RentalItem {
  id: string;
  name: string;
  category: RentalCategory;
  description: string;
  details: string[];
  images: string[];
  price: number;
  priceUnit: "per_day" | "per_event" | "per_hour";
  minQuantity: number;
  maxQuantity: number;
  vendorId: string;
  vendorName: string;
  vendorRating: number;
  availability: {
    availableDates: string[]; // ISO date strings
    unavailableDates: string[]; // ISO date strings
    leadTime: number; // minimum days notice required
    maxBookingAdvance: number; // maximum days in advance that can be booked
  };
}

export interface CartItem {
  itemId: string;
  quantity: number;
  selectedDate: string; // ISO date string
  duration: number; // in hours or days depending on priceUnit
  item: RentalItem;
}

export interface RentalFilter {
  categories: RentalCategory[];
  priceRange: {
    min: number;
    max: number;
  };
  date?: string; // ISO date string
  vendorRating?: number;
  searchQuery?: string;
  sortBy: "price_asc" | "price_desc" | "rating" | "popularity";
}

export interface RentalBooking {
  id: string;
  userId: string;
  items: CartItem[];
  eventDate: string;
  eventDuration: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded";
  createdAt: string;
  updatedAt: string;
}
