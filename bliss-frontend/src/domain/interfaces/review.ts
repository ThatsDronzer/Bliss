export interface Review {
  id: string;
  userId?: string;
  targetId: string;
  targetType: 'service' | 'vendor';
  rating: number;
  comment: string;
  name?: string;
  avatar?: string;
  createdAt?: string;
}

export interface ListingReview {
  id: string;
  listing: string;
  username: string;
  comment: string;
  rating: number;
  createdAt?: string;
}


