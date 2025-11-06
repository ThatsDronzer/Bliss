export declare function getBookingStatusFromDb(userId: string, serviceId: string): Promise<any>;
export declare function cancelBookingFromDb(userId: string, requestId: string): Promise<any>;
export declare function createBookingMessageInDb(bookingData: any): Promise<any>;
export declare function getVendorBookingRequestsFromDb(userId: string, options: {
    status?: string;
    limit?: number;
    page?: number;
}): Promise<any>;
export declare function updateVendorBookingRequestStatusFromDb(userId: string, requestId: string, status: 'accepted' | 'not-accepted'): Promise<any>;
export declare function getUserBookingRequestsFromDb(userId: string, options: {
    status?: string;
    limit?: number;
    page?: number;
}): Promise<any>;
//# sourceMappingURL=message.repository.d.ts.map