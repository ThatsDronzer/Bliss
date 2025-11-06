import type { IBooking, ICreateBookingInput, IUpdateBookingInput } from '@models/booking/booking.model';

export interface IBookingService {
	getBookingStatus(userId: string, serviceId: string): Promise<any>;
	cancelBooking(userId: string, requestId: string): Promise<any>;
	createBookingMessage(bookingData: any): Promise<any>;
	getVendorBookingRequests(userId: string, options: any): Promise<any>;
	updateVendorBookingRequestStatus(userId: string, requestId: string, status: 'accepted' | 'not-accepted'): Promise<any>;
}

