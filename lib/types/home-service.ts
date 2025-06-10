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