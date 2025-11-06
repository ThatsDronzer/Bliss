export interface SelectedItem {
  name: string;
  description?: string;
  price: number;
  image?: string;
}

export interface BookingAddress {
  houseNo?: string;
  areaName?: string;
  landmark?: string;
  state?: string;
  pin?: string;
}

export interface BookingDetails {
  selectedItems: SelectedItem[];
  totalPrice: number;
  bookingDate: string;
  bookingTime: string;
  address?: BookingAddress | null;
  status: 'pending' | 'accepted' | 'not-accepted' | 'cancelled';
  specialInstructions?: string;
}

export interface BookingMessage {
  id: string;
  user: { id: string; name: string; email: string; phone?: string };
  vendor: { id: string; name: string; email: string; phone?: string; service?: string };
  listing: { id: string; title: string; description?: string; basePrice?: number; location?: string };
  bookingDetails: BookingDetails;
  createdAt: string;
}


