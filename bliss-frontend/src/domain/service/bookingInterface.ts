import type { BookingMessage } from '@domain/interfaces/booking';

export interface IBookingService {
  getBookingStatus(serviceId: string): Promise<any>;
  cancelBooking(requestId: string): Promise<any>;
  createBookingMessage(data: any): Promise<any>;
  getVendorBookingRequests(params?: { status?: string; limit?: number; page?: number }): Promise<{ messages: BookingMessage[]; pagination: any }>;
  updateVendorBookingRequestStatus(requestId: string, status: 'accepted' | 'not-accepted'): Promise<BookingMessage>;
}


