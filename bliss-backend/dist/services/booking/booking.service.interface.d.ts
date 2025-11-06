export interface IBookingService {
    getBookingStatus(userId: string, serviceId: string): Promise<any>;
    cancelBooking(userId: string, requestId: string): Promise<any>;
    createBookingMessage(bookingData: any): Promise<any>;
    getVendorBookingRequests(userId: string, options: any): Promise<any>;
    updateVendorBookingRequestStatus(userId: string, requestId: string, status: 'accepted' | 'not-accepted'): Promise<any>;
}
//# sourceMappingURL=booking.service.interface.d.ts.map