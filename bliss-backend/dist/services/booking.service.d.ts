export declare class BookingService {
    /**
     * Get booking status by service ID
     */
    getBookingStatus(userId: string, serviceId: string): Promise<{
        booking: null;
        message: string;
    } | {
        booking: {
            _id: any;
            status: any;
            paymentStatus: any;
            createdAt: any;
            listingTitle: any;
            totalPrice: any;
            canMakePayment: boolean;
        };
        message?: undefined;
    }>;
    /**
     * Cancel booking
     */
    cancelBooking(userId: string, requestId: string): Promise<{
        _id: any;
        status: any;
        paymentStatus: any;
    }>;
    /**
     * Create booking message
     */
    createBookingMessage(bookingData: {
        userId: string;
        vendorId: string;
        listingId: string;
        selectedItems: string[];
        totalPrice: number;
        address: any;
        bookingDate: string;
        bookingTime: string;
        specialInstructions?: string;
    }): Promise<any>;
    /**
     * Get vendor booking requests
     */
    getVendorBookingRequests(userId: string, options: {
        status?: string;
        limit?: number;
        page?: number;
    }): Promise<{
        messages: {
            id: any;
            user: {
                id: any;
                name: any;
                email: any;
                phone: any;
            };
            listing: {
                id: any;
                title: any;
                description: any;
                basePrice: any;
                location: any;
            };
            bookingDetails: {
                selectedItems: any;
                totalPrice: any;
                bookingDate: any;
                bookingTime: any;
                address: any;
                status: any;
                specialInstructions: any;
            };
            createdAt: any;
        }[];
        pagination: {
            total: number;
            pages: number;
            currentPage: number;
            perPage: number;
        };
    }>;
    /**
     * Update vendor booking request status
     */
    updateVendorBookingRequestStatus(userId: string, requestId: string, status: 'accepted' | 'not-accepted'): Promise<{
        id: any;
        user: {
            id: any;
            name: any;
            email: any;
            phone: any;
        };
        listing: {
            id: any;
            title: any;
            description: any;
            basePrice: any;
            location: any;
        };
        bookingDetails: {
            selectedItems: any;
            totalPrice: any;
            bookingDate: any;
            bookingTime: any;
            address: any;
            status: any;
            specialInstructions: any;
        };
        createdAt: any;
    }>;
}
//# sourceMappingURL=booking.service.d.ts.map