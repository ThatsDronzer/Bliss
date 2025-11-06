import type { IBookingService } from './booking.service.interface.js';
export declare class BookingService implements IBookingService {
    getBookingStatus(userId: string, serviceId: string): Promise<any>;
    cancelBooking(userId: string, requestId: string): Promise<any>;
    createBookingMessage(bookingData: any): Promise<any>;
    getVendorBookingRequests(userId: string, options: any): Promise<any>;
    updateVendorBookingRequestStatus(userId: string, requestId: string, status: 'accepted' | 'not-accepted'): Promise<any>;
}
//# sourceMappingURL=booking.service.d.ts.map