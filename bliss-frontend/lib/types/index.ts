export interface ServiceCustomization {
  id: number;
  name: string;
  price: number;
  description: string;
  required: boolean;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  category?: string;
  customizations?: ServiceCustomization[];
  minQuantity?: number;
  maxQuantity?: number;
}

export interface Package {
  id: number;
  name: string;
  price: number;
  description: string;
  services: string[]; // Array of service IDs included in the package
  savings: number; // Amount saved compared to booking services individually
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface DayAvailability {
  date: string;
  slots: TimeSlot[];
}

export interface CancellationTerm {
  daysBeforeEvent: number;
  refundPercentage: number;
}

export interface RefundPolicy {
  description: string;
  cancellationTerms: CancellationTerm[];
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Vendor {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  image: string;
  location: string;
  services: Service[];
  experience: string;
  description: string;
  coverImage: string;
  phone: string;
  email: string;
  featured?: boolean;
  verified?: boolean;
  topServices?: string[];
  packages: Package[];
  availability: DayAvailability[];
  refundPolicy: RefundPolicy;
  reviews: Review[];
} 