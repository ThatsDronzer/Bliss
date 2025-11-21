export interface OccasionPackage {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  image: string;
  featured?: boolean;
  features: string[];
}

export interface Category {
  id: string;
  name: string;
}

export interface HomeServiceCategory extends Category {
  icon?: string;
}

export interface HomeService {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  duration: string;
  locations: string[];
  featured?: boolean;
  tags?: string[];
}

export interface HomeServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  guests: string;
  category: string;
  popular: boolean;
  features: string[];
} 